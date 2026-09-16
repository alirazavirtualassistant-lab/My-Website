---
id: interview-mastery
title: Interview Mastery
icon: 🎯
track: Operations & Career
color: #C0392B
runner: none
tagline: Walk into any interview — technical, analytical or operational — and win it.
description: The complete interview playbook for a document-automation specialist and data/reporting analyst: how hiring works, resume and LinkedIn alignment, the 90-second introduction, STAR stories mined from real experience (20-agent team, 400+ Fiverr reviews, rate matrices, 168-field forms, 767-page handbook), technical screens (Python, SQL, Excel, JavaScript), take-home tests, case studies, portfolio presentation, remote/international interviews, salary negotiation for Pakistan and remote USD roles, and follow-up.
---

# LEVEL: Beginner

## How hiring pipelines work (screen, technical, panel, offer)

An interview is not one conversation. It is a **pipeline**: a series of filters, each run by a different person with a different question in mind. If you know what each stage is trying to find out, you can give each interviewer exactly what they need and nothing that hurts you.

Here is the pipeline most companies use for analyst, operations and document-automation roles, whether the employer is a Lahore software house, a US title-insurance company hiring remote support, or an Upwork client hiring for a three-month contract.

| Stage | Who runs it | What they are really asking | Typical length |
|---|---|---|---|
| Application / ATS | Software, then a recruiter | Does the resume contain the keywords from the job description? | Seconds |
| Recruiter screen | HR or a recruiter | Can this person communicate, is the salary in range, are they available? | 20–30 min |
| Technical screen | A senior analyst or engineer | Can they actually do the work (SQL, Excel, Python, documents)? | 45–60 min |
| Take-home / case | Hiring manager | How do they work without someone watching? | 2–6 hours of your time |
| Panel / loop | 2–4 people, back to back | Culture, behaviour, depth, cross-team fit | 2–4 hours |
| Hiring manager final | Your future boss | Would I trust this person with my queue and my reports? | 30–45 min |
| Offer & negotiation | Recruiter / HR | Can we agree on money, start date, notice period? | Days |

### What each stage filters out

The **ATS** (Applicant Tracking System, e.g. Workday, Greenhouse, Lever) parses your resume into fields and often scores it against the job description. A resume that says "Made reports in Excel" scores lower than one that says "Built weekly production status reports in Excel (SUMIFS, PivotTables, Power Query) for a US title-insurance client". Same work, different keywords.

The **recruiter screen** is a fluency and logistics test. The recruiter usually cannot judge your SQL, so they judge how clearly you describe it, whether your expected salary fits the band, and whether you can start in time. Have three numbers ready: notice period, expected salary, earliest start date.

The **technical screen** is where most candidates are eliminated. The interviewer wants proof, not adjectives. "I am good at Excel" proves nothing; "I maintained a rate matrix workbook with INDEX/MATCH lookups across 50 US states and validated it against the underwriter's published rate manual" proves a lot.

The **panel** tests consistency. Three people ask overlapping questions and later compare notes. If your story about the 20-agent team is different in each room, that is a red flag. This is why you build a story bank (Intermediate level) before any panel.

```text
Typical timeline for a remote analyst role

Day 0    Apply (tailored resume + 4-line cover note)
Day 3–7  Recruiter screen (30 min video or phone)
Day 7–14 Technical screen (live SQL/Excel or a 2–4 hour take-home)
Day 14–21 Panel: hiring manager + peer + cross-functional (e.g. finance)
Day 21–28 Offer, negotiation, reference checks
Day 28+  Background check, contract, notice period, start
```

### Why the pipeline matters for you specifically

Ali's profile crosses three worlds: BPO operations (Systems Limited team lead), production support for a US title insurer (Stewart Title reports and rate matrices) and freelance document engineering (400+ Fiverr reviews). Different stages care about different parts of that story:

- Recruiters care about the **headline**: "7+ years, documents plus data, remote-ready, UTC+5".
- Technical screeners care about **tools**: python-docx, PyMuPDF, openpyxl, SQL, Power BI, AcroForms.
- Panels care about **behaviour**: leading 20 agents, hitting daily targets, handling a rework spike.
- The hiring manager cares about **risk**: will this person deliver a 767-page handbook on time without supervision?

> **Tip:** Ask the recruiter on the first call: "Can you walk me through the remaining stages and who I will meet?" It is a normal question, it shows you are organised, and it tells you exactly what to prepare.

### Scorecards

Most structured interviewers fill in a **scorecard**: 4–8 competencies rated 1–4, with a written justification. Common competencies for analyst roles are Technical Skills, Problem Solving, Communication, Ownership, Collaboration and Attention to Detail. Every answer you give should be easy to copy into a scorecard as evidence. If an interviewer can write "Led a 20-person team to 100% daily target for six months, measured by delivered items vs. queue" next to Ownership, you scored a 4.

### Try It Yourself

```text
Pipeline tracker (copy into a spreadsheet, one row per application)

Company | Role | Stage (Applied/Screen/Tech/Panel/Offer) | Date | Interviewer | Prep needed | Next action | Notes
Acme Title | Reporting Analyst (remote) | Screen | 2026-09-18 | Recruiter, Sara | Salary band, notice period | Confirm 8pm PKT slot | Uses Greenhouse; SQL test next
```

### Quiz

1. What is the main purpose of the recruiter screen?
- [ ] To test your SQL and Python skills in depth
- [x] To check communication, salary fit, availability and basic role fit
- [ ] To negotiate the final offer
> Recruiters usually cannot assess technical depth; they filter on fluency, logistics and range.

2. Why do panel interviewers compare notes afterwards?
- [x] To check that your answers were consistent across interviewers
- [ ] To decide which interviewer asked the hardest question
- [ ] To fill in the ATS
> Inconsistent stories across a panel are one of the most common reasons a strong candidate is rejected.

3. What does an ATS score a resume against?
- [ ] The candidate's LinkedIn photo
- [ ] The number of pages
- [x] Keywords and phrases from the job description
> Applicant Tracking Systems parse resumes into fields and match them against the posting.

### Exercises

1. **Map a real posting** — Find a live "Data Analyst" or "Reporting Analyst" posting and write down which stages it lists (many postings say "our process: phone screen, technical assessment, final panel"). Note the tools mentioned.
<details><summary>Solution</summary>

A typical answer: Stage 1 recruiter call (30 min); Stage 2 SQL and Excel assessment (60 min live); Stage 3 case study presentation to the hiring manager and a finance partner; Stage 4 offer. Tools listed: SQL, Excel, Power BI, Python (nice to have). Prep list: SQL joins and window functions, PivotTables, one dashboard to present.

</details>

2. **Three numbers** — Write down your notice period, expected monthly salary (PKR and USD) and earliest start date so you can answer a recruiter in one sentence.
<details><summary>Solution</summary>

"My notice period is 30 days, I can start on 1 November, and I am targeting PKR 300,000 per month for a local role or USD 2,000–2,500 per month for a remote contract, depending on the full package." Say it once, calmly, and move on.

</details>

### Interview Questions

**Q: Walk me through how you would prepare for a four-stage interview process.**
I start by asking the recruiter for the stage list and interviewer names, then I prepare per stage rather than generically. For the recruiter screen I prepare my 90-second introduction and my three numbers (notice, salary, start date). For the technical screen I rehearse the tools named in the posting, for example SQL joins and Excel lookups, using my own production-report data. For the panel I prepare a story bank of 12–15 STAR stories drawn from my team-lead, title-insurance and freelance work so every interviewer hears consistent facts. For the final I prepare questions about the team's queue, KPIs and reporting stack so I can show I am already thinking like an employee.

**Q: What do you think interviewers are looking for in a reporting analyst?**
Evidence that I can turn messy operational data into a report someone will act on, and that I will not break trust with a wrong number. Concretely they look for SQL and Excel fluency, attention to detail, the habit of validating data before publishing, and communication skills to explain a variance to a non-technical manager. My weekly status reports for a US title-insurance client are the example I use: I reconciled the counts against the source system every week before sending, which is the behaviour they are hiring for.

**Q: Why do companies use scorecards instead of gut feel?**
Scorecards reduce bias and make interviewers compare candidates on the same competencies. For me as a candidate it means every answer should produce a piece of evidence that fits a competency such as Ownership or Technical Skills. So I give numbers, tools and outcomes rather than adjectives, for example "20 agents, 100% daily target, six months" instead of "I am a strong leader".

## Reading a job description & mapping your resume to it

A job description (JD) is a specification. Treat it the way you treat a client brief for a document project: parse it into requirements, decide which ones are mandatory, and produce a deliverable (your resume and cover note) that visibly satisfies each one.

### The four parts of every JD

1. **Title and level** — "Senior", "II", "Lead" tell you the salary band and the depth expected.
2. **Responsibilities** — what you will do every week. These become your interview stories.
3. **Requirements** — split into *must have* and *nice to have*. Most candidates ignore this split; do not.
4. **Signals** — company size, tools named, whether "remote" means US-hours or async.

Here is a real-style excerpt and how to parse it.

```text
Reporting Analyst (Remote, Title & Escrow Operations)

Responsibilities
- Build and maintain weekly and monthly production reports for operations leadership
- Maintain rate calculators and premium matrices across states
- Validate data from multiple sources before distribution
- Automate recurring reports where possible

Requirements
- 3+ years in reporting or operations analytics
- Advanced Excel (lookups, PivotTables, Power Query)
- SQL for data extraction
- Strong written English; comfortable with US stakeholders
Nice to have
- Python, Power BI, experience in title insurance or mortgage
```

### Build a requirement-to-evidence table

For every line in the JD, write the strongest piece of evidence from your own history. If a line has no evidence, that is a gap you either close before applying or address honestly in the cover note.

| JD line | Evidence from Ali's history | Strength |
|---|---|---|
| Weekly/monthly production reports | Weekly status reports for Stewart Title production support | Strong |
| Rate calculators and premium matrices | Built and maintained rate calculators and rate matrices across states | Strong |
| Validate data before distribution | Data validation routines; QC role at Systems Limited | Strong |
| Automate recurring reports | Python (openpyxl, python-docx) automation of Fiverr deliverables | Strong |
| SQL | Coursework plus personal projects; less production use | Medium — practise |
| Power BI | Excel/Power BI dashboards for freelance clients | Medium |
| Title insurance experience | Stewart Title and the Systems Limited title-search project | Strong |

Now the resume rewrite is mechanical: lift the JD's own phrases into your bullets wherever they are true.

```text
Before
- Made reports for the operations team every week.

After
- Built and maintained weekly and monthly production status reports for US title-insurance
  operations leadership; validated counts against the source system before every distribution.
```

The second bullet uses "production", "operations leadership", "validated" and "distribution", four phrases lifted straight from the JD, and it is still 100% true.

### Must-have vs nice-to-have

If you meet all must-haves and half the nice-to-haves, apply. If you miss one must-have (for example "5+ years" when you have 4), apply anyway if the rest is strong; the number is usually a proxy for depth, and depth you can prove. If you miss two or more must-haves, spend the time closing the gap instead.

> **Warning:** Do not put a tool on your resume that you cannot discuss for ten minutes. "SQL" on the resume means the technical screen will contain SQL. If your real level is "I can write joins and GROUP BY but not window functions", say exactly that when asked and then show what you can do.

### Decode the signals

- **"Remote (US hours)"** means evening and night shifts from Lahore (a 9am Central start is 7pm PKT). Decide before applying whether that suits you.
- **"Fast-paced"** usually means understaffed. Ask about queue size and headcount in the interview.
- **"Wear many hats"** at a small company means documents, data and support all at once, which is actually a good match for a documents-plus-data profile.
- A JD that names specific software (Qualia, ResWare, SoftPro in title; Power BI, Tableau in analytics) tells you the stack. Mention any you have touched, and say "not yet" honestly for the rest.

### The cover note

Long cover letters are rarely read. A four-line note that mirrors the JD is.

```text
Subject: Reporting Analyst (Remote) — 7 yrs title-insurance ops + reporting, UTC+5

Hi [Name],
I have spent 7+ years between BPO operations (led a 20-agent data-processing team) and
production support for a US title insurer (weekly status reports, rate calculators and
state rate matrices, data validation). I automate recurring reports with Python and Excel
and have 400+ five-star reviews delivering documents and dashboards to remote clients.
Resume attached; portfolio at alirazaworks.com. Available for US-morning overlap.
Best regards, Ali Raza
```

### Try It Yourself

```text
Requirement-to-evidence worksheet

JD line (copy verbatim)            | My evidence (role, tool, number)                 | Strong/Medium/Gap
-----------------------------------|--------------------------------------------------|------------------
"Advanced Excel (lookups, Pivot)"  | Rate matrix workbook, INDEX/MATCH, PivotTables    | Strong
"SQL for data extraction"          | Joins/GROUP BY on practice DB; no prod use yet    | Medium
"Power BI"                         | Two client dashboards (sales, production)         | Medium
"Title insurance experience"       | Stewart Title support; SL title-search project    | Strong
Action for every Medium/Gap: one practice task + one line of honest wording for the interview.
```

### Quiz

1. What is the first thing to do with a job description?
- [ ] Apply immediately before the posting closes
- [x] Split it into responsibilities, must-have requirements, nice-to-haves and signals
- [ ] Copy it into your resume unchanged
> Parsing the JD lets you map evidence to each requirement and spot gaps.

2. A JD asks for "5+ years" and you have 4 strong years. What should you do?
- [x] Apply if the rest of your evidence is strong; years are a proxy for depth
- [ ] Never apply
- [ ] Claim 5 years
> Years requirements are guidelines; honesty plus strong evidence usually wins.

3. What does "Remote (US hours)" mean for a candidate in Lahore?
- [ ] Nothing changes
- [x] Evening and night work, because 9am Central is 7pm PKT
- [ ] Only weekends
> Always convert the stated hours to PKT before deciding whether to apply.

### Exercises

1. **Rewrite three bullets** — Take any three bullets from your current resume and rewrite them using verbs and phrases from a real JD, keeping every fact true.
<details><summary>Solution</summary>

```text
- Led a 20-agent data-processing team; allocated daily queues and achieved 100% daily target
  attainment across the title-search project.
- Performed quality checks on processed records, logged error categories and coached agents,
  reducing rework in the sampled batches.
- Built rate calculators and multi-state rate matrices in Excel for a US title insurer;
  validated every release against the published rate manual.
```

</details>

2. **Find the gap** — For a JD that requires "Tableau", and you only have Power BI, write the one sentence you would say in the interview.
<details><summary>Solution</summary>

"I have built dashboards in Power BI, including DAX measures and scheduled refresh; I have not shipped a Tableau dashboard yet, but the modelling and visual-design skills transfer directly and I have already rebuilt one of my Power BI reports in Tableau Public to learn the tool."

</details>

### Interview Questions

**Q: This role asks for SQL and you list it, but your background is mostly Excel and documents. How strong is your SQL really?**
I can confidently write SELECT queries with multiple joins, GROUP BY with HAVING, subqueries and CTEs, and I have used window functions such as ROW_NUMBER and SUM OVER for running totals in practice datasets. My production reporting for the title-insurance client was Excel-based because that is what the client used, so I have not yet run SQL against a production warehouse at scale. I would rate myself solid intermediate: I can extract and aggregate the data a report needs and I know when to push work into the database rather than Excel. I am happy to do a live exercise so you can calibrate.

**Q: Why did you apply for this role specifically?**
The responsibilities are almost a description of my last two roles: weekly production reports, rate matrices, data validation and automating what repeats. I also have direct title-insurance context from Stewart Title production support and from a title-search project at Systems Limited, so I would not need to learn the domain vocabulary. The part that attracts me most is the automation line, because I have already replaced manual report assembly with Python and openpyxl for freelance clients and I would like to do that at a larger scale.

**Q: What did you notice in our job description that made you think you might not be a fit?**
The posting mentions Tableau and I have shipped dashboards in Power BI rather than Tableau. I flagged that honestly because I would rather you know it now. The data-modelling, measure design and visual-hierarchy skills are the same, and I have started rebuilding one of my Power BI reports in Tableau Public so I can show you the difference in a week. Everything else in the posting, especially reporting, rate matrices and validation, I have done in production.

## Your 90-second introduction (tell me about yourself)

"Tell me about yourself" opens almost every interview, and it is the only question you know is coming. It is not an invitation to recite your resume. It is a request for a **positioning statement**: who you are professionally, what you have proven, and why you are in this room.

### The structure

A strong introduction has four beats and takes 75–100 seconds spoken at a normal pace (about 180–220 words).

| Beat | Time | Content |
|---|---|---|
| Present | 15 s | Your current title, what you actually do, one number |
| Past | 40 s | Two or three roles that built the skills this job needs, each with a proof point |
| Proof | 15 s | The single most impressive, relevant achievement |
| Future | 15 s | Why this role, and a handover to the interviewer |

The beats are ordered present-past-future rather than chronological because the interviewer wants to know what you are *now* before they care how you got there.

### Ali's version (analyst / reporting role)

```text
I am a Document Production and Automation Specialist and Data and Reporting Analyst based
in Lahore, with about seven years across BPO operations, US title-insurance production
support and freelance document engineering.

I started at Systems Limited, where I moved from quality checker to team lead of a
20-agent data-processing team on a title-search project. I owned the daily queue,
allocation and QC sampling, and we hit 100 percent of our daily targets consistently.

I then supported Stewart Title's production operations, building weekly status reports,
rate calculators and multi-state rate matrices in Excel, and validating the data behind
them before every distribution.

Alongside that I have delivered more than 400 five-star projects on Fiverr and Upwork:
fillable PDF forms with up to 168 AcroForm fields, branded Word template suites, a
767-page handbook with a fully automated table of contents, EPUB3 ebooks and Excel and
Power BI dashboards. Most of that work I automate with Python.

I am finishing a BS in Software Engineering on top of a BS in Economics, and I am looking
for a reporting role where the reports, the automation and the domain knowledge all get
used. That is why this position stood out. Happy to go deeper on any part of that.
```

Read it aloud and time it. It should land between 80 and 95 seconds. If it runs long, cut the Fiverr list to two items.

### Ali's version (document-automation role)

For a documents-first role, swap the order of the Past beats so the freelance work leads and the reporting work supports.

```text
I build documents and the systems that produce them. Over the last seven years I have
delivered 400+ projects for remote clients: policy manuals and handbooks up to 767 pages
with automated TOCs and cross-references, branded .dotx template suites, fillable PDF forms
with up to 168 fields and validation, EPUB3 ebooks and print-ready PDFs. I automate the
repetitive parts with Python, mainly python-docx, PyMuPDF and openpyxl.

Before freelancing full-time I led a 20-agent data-processing team at Systems Limited and
supported Stewart Title's production reporting, so I am comfortable with SLAs, QC and
stakeholders in US time zones.

I am finishing a BS in Software Engineering, and I am looking for a role where document
quality and automation both matter, which is exactly how this posting reads.
```

### What makes it work

- **One number per beat.** 20 agents, 100 percent, 400+ reviews, 168 fields, 767 pages. Numbers are remembered; adjectives are not.
- **Tools named, not implied.** "Excel" is weak; "rate matrices in Excel, validated before distribution" is strong.
- **The last sentence hands control back.** "Happy to go deeper on any part" invites the interviewer to pick the thread, which tells you what they care about.
- **No personal life.** Family, hobbies and where you went to school belong later, if at all.

> **Interview note:** Interviewers often decide within the first two minutes whether the rest of the hour will be a conversation or an interrogation. A tight, numeric, confident introduction buys you a conversation.

### Common mistakes

1. **Starting at birth.** "I did my matric in 2010, then FSc..." Nobody hired anyone for their matric.
2. **Reading the resume.** They have it. Give them the story behind it.
3. **Going over two minutes.** Attention drops sharply after 90 seconds.
4. **Vague verbs.** "Handled", "worked on", "was involved in". Use "built", "led", "validated", "automated", "delivered".
5. **Ending with silence.** Always finish with a handover line.

### Try It Yourself

```text
Introduction builder (fill each line, then read aloud with a timer)

PRESENT (15s): I am a ____________ based in ______, with ___ years across ______, ______ and ______.
PAST 1  (15s): At ______ I ______ [role], where I ______ [verb + object + number].
PAST 2  (15s): At ______ I ______ [verb + object + tool + number].
PAST 3  (15s): Alongside that I ______ [freelance/side proof + number].
PROOF   (15s): The piece of work I am proudest of is ______ because ______ [outcome number].
FUTURE  (15s): I am looking for ______, which is why this role stood out. Happy to go deeper on any part.
Target: 180–220 words, 80–95 seconds.
```

### Quiz

1. How long should "tell me about yourself" take?
- [ ] 5 minutes, covering the whole resume
- [x] About 90 seconds, in a present-past-future structure
- [ ] 15 seconds
> Ninety seconds is long enough to position yourself and short enough to keep attention.

2. Which opening is strongest?
- [ ] "I was born in Lahore and did my matric in 2010"
- [x] "I am a Document Production and Automation Specialist with seven years across BPO operations and US title-insurance reporting"
- [ ] "Well, it is all in my resume"
> Lead with your professional identity and scope, not chronology.

3. Why end the introduction with "happy to go deeper on any part"?
- [x] It hands control back and reveals what the interviewer cares about
- [ ] It fills time
- [ ] It is required by HR
> The interviewer's follow-up tells you which thread to prepare for.

### Exercises

1. **Record and cut** — Record your introduction on your phone. If it exceeds 100 seconds, cut one Past beat and re-record until it fits.
<details><summary>Solution</summary>

Typical cuts: remove the education sentence for experienced-hire roles; merge "quality checker to team lead" into one clause; reduce the Fiverr list from five deliverables to the two most relevant to the JD (for an analyst role: dashboards and the 767-page handbook; for a documents role: forms and the handbook).

</details>

2. **Two variants** — Write a 60-second version for a recruiter screen and a 90-second version for a hiring manager.
<details><summary>Solution</summary>

The 60-second recruiter version keeps Present, one Past beat with the two most relevant roles compressed, and Future with logistics: "I am based in Lahore, UTC+5, available for a 30-day notice, and comfortable with US-morning overlap." The 90-second hiring-manager version keeps all three Past beats and the Proof beat, because the manager wants depth and numbers.

</details>

### Interview Questions

**Q: Tell me about yourself.**
I am a Document Production and Automation Specialist and Data and Reporting Analyst in Lahore with about seven years across BPO operations, US title-insurance production support and freelance document engineering. At Systems Limited I moved from quality checker to leading a 20-agent data-processing team on a title-search project, owning the daily queue and QC sampling and hitting our daily targets consistently. I then supported Stewart Title's production operations with weekly status reports, rate calculators and state rate matrices in Excel, validating the data before every distribution. Alongside that I have delivered more than 400 five-star projects on Fiverr and Upwork, including a 767-page handbook with an automated TOC and fillable PDF forms with up to 168 fields, most of it automated in Python. I am finishing a BS in Software Engineering and looking for a role where reporting, automation and domain knowledge all get used, which is why this one stood out.

**Q: What would your last manager say about you in one sentence?**
"He is the person I hand the report to when it has to be right the first time." I earned that by validating every weekly status report against the source counts before sending it and by flagging discrepancies proactively instead of letting them be discovered downstream. The trade-off is that I sometimes take an extra thirty minutes to reconcile, and I have learned to tell stakeholders when a number is provisional rather than delaying the whole report.

**Q: Summarise your experience in three bullet points.**
First, operations leadership: led a 20-agent data-processing team at Systems Limited to consistent 100 percent daily target attainment on a title-search project, including QC sampling and coaching. Second, reporting and data: built weekly status reports, rate calculators and multi-state rate matrices for Stewart Title production support, with validation before every release. Third, document automation: 400+ freelance projects including a 767-page handbook with an automated TOC, fillable PDF forms with 168 fields, .dotx template suites, EPUB3 ebooks and Power BI dashboards, largely automated with Python.

## Resume, LinkedIn & portfolio (alirazaworks.com, Fiverr) alignment

Recruiters look at three places: your resume, your LinkedIn profile and, if you are lucky, your portfolio. If these three disagree, you look careless; if they reinforce each other, you look like a professional with a coherent brand. Alignment means the same headline, the same numbers, the same dates and the same tools in all three.

### The resume: one page, evidence-first

For seven years of experience a one-page resume is still the safest format for remote and international roles. Two pages are acceptable only if every line earns its place.

```text
ALI RAZA
Document Production & Automation Specialist | Data & Reporting Analyst
Lahore, Pakistan (UTC+5) | alirazaworks.com | linkedin.com/in/... | email | phone

SUMMARY
7+ years across BPO operations, US title-insurance production support and freelance document
engineering. Led a 20-agent data-processing team; built weekly status reports, rate calculators
and state rate matrices; delivered 400+ five-star document and dashboard projects, automated
with Python (python-docx, PyMuPDF, openpyxl), Excel and Power BI.

EXPERIENCE
Freelance Document & Data Specialist — Fiverr / Upwork            2019 – present
- Delivered 400+ projects (4.9+ rating): DOCX/PDF/EPUB production, fillable forms (up to 168
  AcroForm fields with validation), branded .dotx template suites, print-ready covers.
- Produced a 767-page policy handbook with automated multi-level TOC, cross-references and
  index; built Excel and Power BI dashboards for operations and sales clients.
- Automated repetitive production with Python, cutting turnaround on template jobs.

Production Support Analyst — Stewart Title (contract)              20xx – 20xx
- Built weekly status reports for operations leadership; validated counts vs. source before
  every distribution.
- Maintained rate calculators and multi-state rate matrices; reconciled against rate manuals.

Team Lead, Data Processing (earlier: Quality Checker) — Systems Limited   20xx – 20xx
- Led 20 agents on a US title-search project: daily allocation, QC sampling, coaching;
  consistent 100% daily target attainment.

SKILLS
Excel (SUMIFS, INDEX/MATCH, XLOOKUP, PivotTables, Power Query) | SQL | Python (pandas,
openpyxl, python-docx, PyMuPDF, pikepdf) | Power BI (DAX) | Word (styles, fields, .dotx) |
Acrobat (AcroForms, preflight) | EPUB3 | JavaScript

EDUCATION
BS Software Engineering (in progress) | BS Economics
```

Replace the `20xx` placeholders with your actual years; recruiters check that resume dates match LinkedIn dates exactly.

### Rules that make a resume pass the ATS

- Save as PDF unless the posting asks for DOCX. Use a standard font, no text boxes, no two-column tables (many parsers read them left-to-right and scramble the content).
- Section headings must be literal: EXPERIENCE, SKILLS, EDUCATION.
- Put tools in the bullets, not just in the skills list, so the parser associates them with real roles.
- File name: `Ali-Raza-Reporting-Analyst.pdf`, not `resume_final_v3.pdf`.

### LinkedIn: the searchable version of your resume

Recruiters search LinkedIn with Boolean strings like `"data analyst" AND (Excel OR SQL) AND "Power BI" AND Lahore`. Your profile has to contain those words in the headline, the About section and the experience bullets.

| Field | What to write |
|---|---|
| Headline | Document Automation Specialist & Reporting Analyst \| Python, Excel, SQL, Power BI \| 400+ five-star projects |
| About | Your 90-second introduction, written out, with the same numbers as the resume |
| Experience | Same roles, same dates, same bullets as the resume (shorter is fine) |
| Featured | Link to alirazaworks.com, one dashboard screenshot, one document sample |
| Skills | Pin the top three that match your target role (Excel, SQL, Python) |
| Open to work | Turn on the recruiter-only setting with "Remote" and your target titles |

> **Tip:** Set your LinkedIn location to "Lahore, Punjab, Pakistan" and add "(UTC+5, remote)" to the headline. Recruiters for remote roles filter by time-zone overlap and will read that immediately.

### The portfolio: alirazaworks.com and Fiverr

A portfolio turns claims into proof. The best portfolio pages for a documents-plus-data profile show a before/after and a short note on how it was made.

```text
Portfolio page structure (one per project)

Title:      767-page Policy Handbook — automated TOC, cross-references and index
Client:     US HR consultancy (name withheld)
Problem:    Manually maintained Word file; TOC broke on every edit; 3 days per revision.
Solution:   Rebuilt on a styled .dotx template; heading-based TOC, SEQ-numbered figures,
            cross-references via REF fields; Python (python-docx) to apply styles in bulk.
Result:     Revision cycle from 3 days to 2 hours; zero broken references at delivery.
Evidence:   PDF sample (first 10 pages), screenshot of the TOC, redacted client review.
```

Your Fiverr profile is also a portfolio: 400+ reviews are social proof that no resume line can match. Link it from LinkedIn's Featured section and from your website, and quote two or three reviews verbatim on alirazaworks.com.

### Keep the numbers identical

Pick one canonical set of numbers and use them everywhere: 7+ years, 20 agents, 400+ reviews, 168 fields, 767 pages. If the resume says 400+ and LinkedIn says 350+, an attentive recruiter will ask which is true, and the answer "both, at different times" makes you sound inattentive.

### Try It Yourself

```text
Alignment checklist (tick every row before you apply)

[ ] Headline identical on resume, LinkedIn and website
[ ] Same job titles and same start/end months in all three
[ ] Same five numbers everywhere: 7+ yrs, 20 agents, 400+ reviews, 168 fields, 767 pages
[ ] Skills list on resume matches LinkedIn pinned skills
[ ] Resume PDF file named Ali-Raza-<Role>.pdf
[ ] Portfolio has at least: one document project, one dashboard, one automation script
[ ] Fiverr and Upwork profile links work and show current ratings
[ ] Email signature contains website link
```

### Quiz

1. Why should resume dates exactly match LinkedIn dates?
- [x] Recruiters cross-check them and mismatches look careless or dishonest
- [ ] LinkedIn requires it
- [ ] It improves the ATS font score
> Consistency across resume, LinkedIn and portfolio builds trust.

2. Which resume format is safest for ATS parsing?
- [ ] Two-column design with icons
- [x] Single-column PDF with literal section headings
- [ ] A scanned image
> Multi-column layouts and images are frequently scrambled by parsers.

3. What should a portfolio project page contain?
- [ ] Only a screenshot
- [x] Problem, solution, tools, measurable result and evidence
- [ ] The full client file
> Interviewers want to see the problem you solved and how you measured the outcome.

### Exercises

1. **Write the LinkedIn About** — Convert your 90-second introduction into a 150-word About section in first person with the same numbers.
<details><summary>Solution</summary>

"I build documents and the reports behind them. Over seven years I have led a 20-agent data-processing team at Systems Limited, supported Stewart Title's production operations with weekly status reports and multi-state rate matrices, and delivered 400+ five-star projects on Fiverr and Upwork, including a 767-page handbook with an automated TOC and fillable PDF forms with 168 fields. I automate the repetitive parts with Python (python-docx, PyMuPDF, openpyxl) and build dashboards in Excel and Power BI. Currently finishing a BS in Software Engineering alongside a BS in Economics. Open to remote reporting and document-automation roles with US or UK overlap. Portfolio: alirazaworks.com."

</details>

2. **Portfolio audit** — List three projects from your Fiverr history that best match a "Reporting Analyst" JD and write one result line for each.
<details><summary>Solution</summary>

1. Operations dashboard in Power BI: "Replaced a weekly manual Excel summary with a refreshable dashboard; the client's Monday reporting went from 3 hours to 10 minutes." 2. Rate-matrix workbook: "Consolidated 50 state tables into one lookup model with INDEX/MATCH; eliminated the copy-paste errors found in the previous version." 3. Report automation script: "openpyxl script that assembles a 12-tab monthly report from raw CSV exports in under a minute."

</details>

### Interview Questions

**Q: I looked at your portfolio. Which project best represents how you work?**
The 767-page policy handbook, because it shows the whole way I work: I diagnosed why the client's revisions took three days (manual TOC, hand-typed cross-references), rebuilt the document on a styled template so the TOC and references regenerate automatically, and wrote a small python-docx script to apply the styles in bulk. The measurable result was a revision cycle of about two hours and zero broken references at delivery. It is also a good example of the trade-off I always make: an upfront day of structure to save weeks later.

**Q: Your Fiverr profile shows 400+ reviews. How is freelance work relevant to a full-time analyst role?**
Freelance work is 400 separate mini-projects with a brief, a deadline, a stakeholder and a public rating, so it trained exactly the habits an analyst role needs: clarifying requirements before starting, delivering on time, and communicating clearly with remote clients in US and UK time zones. Many of those projects were dashboards and data cleaning, not just documents. The difference in a full-time role is continuity, which I actually prefer, because I can automate more when I own the same report every week.

**Q: Why is your resume one page when you have seven years of experience?**
Because a recruiter spends under a minute on the first pass and I want the five numbers that matter to be visible immediately: 20 agents, 100 percent target attainment, 400+ reviews, 168-field forms, 767-page handbook. Everything else is in the portfolio and LinkedIn, which I keep aligned to the same facts. If the role asks for a detailed CV, I have a two-page version with project lists, but I lead with the one-pager.

## Interview logistics & remote setup (time zones UTC+5, camera, audio)

Remote interviews are won or lost before the first question. A candidate who joins late because of a time-zone mistake, whose audio echoes, or whose camera shows a dark room has already lost points that no answer can recover. This chapter is the checklist.

### Time zones from Lahore

Pakistan Standard Time is UTC+5 all year; Pakistan does not observe daylight saving. The United States and the United Kingdom do, so the offset between you and the interviewer changes twice a year.

| Interviewer zone | Winter offset from PKT | Summer offset from PKT | Their 10:00 = your |
|---|---|---|---|
| US Eastern (New York) | −10 h | −9 h (EDT) | 20:00 winter / 19:00 summer |
| US Central (Houston, Chicago) | −11 h | −10 h (CDT) | 21:00 / 20:00 |
| US Pacific (Los Angeles) | −13 h | −12 h (PDT) | 23:00 / 22:00 |
| UK (London) | −5 h | −4 h (BST) | 15:00 / 14:00 |
| UAE (Dubai) | −1 h | −1 h | 11:00 |
| Australia Eastern (Sydney) | +6 h (AEDT) | +5 h | 04:00 / 05:00 |

Always confirm in writing with the zone spelled out: "Confirming Tuesday 16 September, 9:00 AM CDT, which is 7:00 PM PKT." Google Calendar and Calendly convert automatically if your calendar's time zone is set to Asia/Karachi; check it once and never again.

### The confirmation email

```text
Subject: Confirming interview — Reporting Analyst — Tue 16 Sep, 9:00 AM CDT / 7:00 PM PKT

Hi Sara,
Thank you for scheduling. Confirming Tuesday 16 September at 9:00 AM CDT (7:00 PM PKT)
with Daniel Reyes via Google Meet. I will join from the link in the invite.
If anything changes on your side, my WhatsApp is +92 3xx xxxxxxx.
Best regards,
Ali Raza
```

Two things in this email do work for you: repeating both zones prevents a mismatch, and giving a backup contact shows you have thought about failure modes, which is exactly what a reporting analyst is hired to do.

### Camera, audio, light, background

- **Camera at eye level.** Stack books under the laptop. Looking down into a camera reads as disengaged.
- **Light in front of you, not behind.** A window or lamp facing you; never a bright window behind you.
- **Audio beats video.** Use wired earphones with a microphone or a USB headset. Laptop mics pick up the fan and the room echo.
- **Background plain.** A wall, a bookshelf or a light blur. Avoid virtual backgrounds that flicker around your head.
- **Frame:** head and shoulders, small gap above the head, centred.

### Power and internet in Lahore

Load-shedding and fibre drops are real, so plan for them like you would plan for a client deadline.

```text
Redundancy checklist (30 minutes before)
[ ] Laptop charged to 100%, charger connected
[ ] UPS or power bank for the router (a 10,000 mAh bank runs most routers ~4 h)
[ ] Mobile hotspot tested: phone charged, 4G signal checked in the interview room
[ ] Meeting link opened once already; browser permissions for camera and mic granted
[ ] Backup: phone number of the interviewer/recruiter saved; Meet/Zoom/Teams app on phone
[ ] Notifications silenced: WhatsApp Web closed, Slack and email muted, phone on silent
[ ] Water, notebook, pen, printed resume and JD on the desk
```

If you drop, rejoin from the phone hotspot within a minute and say once: "Apologies, my connection dropped; I am back on a backup line." Then continue. Do not apologise three times.

### Platform quirks

- **Zoom:** test at zoom.us/test. Turn on "Touch up my appearance" only if lighting is poor; otherwise leave it off.
- **Google Meet:** works in Chrome; check that the correct Google account is signed in so you are not stuck in the waiting room under an unrecognised name.
- **Microsoft Teams:** the web version works without installing; use the desktop app if screen-sharing will be needed for a live Excel task.
- **HackerRank / CoderPad / CodeSignal:** used for live coding; open the link ten minutes early to accept browser permissions and choose your language.

> **Warning:** Never take an interview from a phone held in your hand or from a moving vehicle. If a slot is impossible, ask to reschedule; interviewers respect that far more than a shaky, noisy call.

### Dress and posture

Business-casual top, plain colours, no logos. Sit upright with both feet on the floor. Keep your hands visible when you gesture; it reads as open. Look at the camera lens, not at your own image, when delivering key points.

### Try It Yourself

```text
Time-zone conversion drill (write the PKT time for each, assuming September = US/UK summer time)

1. 9:00 AM EDT     -> ______ PKT
2. 2:30 PM CDT     -> ______ PKT
3. 11:00 AM BST    -> ______ PKT
4. 8:00 AM PDT     -> ______ PKT
5. 4:00 PM AEST    -> ______ PKT

Answers: 1) 6:00 PM  2) 12:30 AM next day  3) 3:00 PM  4) 8:00 PM  5) 2:00 PM
```

### Quiz

1. Pakistan Standard Time is:
- [x] UTC+5 all year, with no daylight saving
- [ ] UTC+5 in winter and UTC+6 in summer
- [ ] UTC+4
> Pakistan does not observe DST; the US and UK do, so the offset to them changes twice a year.

2. What is 9:00 AM CDT in PKT?
- [ ] 6:00 PM
- [x] 7:00 PM
- [ ] 8:00 PM
> CDT is UTC−5, so the difference to UTC+5 is 10 hours.

3. What is the best single upgrade for remote interview quality?
- [ ] A virtual background
- [x] A wired headset or earphones with a microphone
- [ ] A 4K webcam
> Clear audio matters more than video; laptop mics capture echo and fan noise.

### Exercises

1. **Write your confirmation email** — Draft a confirmation for an interview at 10:30 AM Eastern next Wednesday, including both time zones and a backup contact.
<details><summary>Solution</summary>

"Subject: Confirming interview — Wed 23 Sep, 10:30 AM EDT / 7:30 PM PKT. Hi [Name], thank you for scheduling. Confirming Wednesday 23 September at 10:30 AM EDT (7:30 PM PKT) via Zoom. I will join from the invite link; if there is any issue, my WhatsApp is +92 3xx xxxxxxx. Best regards, Ali Raza."

</details>

2. **Failure drill** — Simulate a dropped connection: switch off Wi-Fi mid-call with a friend and time how long it takes you to rejoin via hotspot.
<details><summary>Solution</summary>

Target is under 60 seconds. Pre-conditions that make it possible: the meeting app is already installed and signed in on the phone, the hotspot is already configured as a saved network on the laptop, and the meeting link is in your phone's calendar. Practise once and the real event becomes routine.

</details>

### Interview Questions

**Q: This role requires overlap with US Central hours. How would you manage that from Lahore?**
US Central mornings are my evenings: 9:00 AM CDT is 7:00 PM PKT, and in winter 8:00 PM. I would commit to a fixed overlap window, for example 6:00 PM to 11:00 PM PKT, which covers the client's first half-day for stand-ups and urgent requests, and do heads-down report building during my daytime when your queue data has landed. I already worked this pattern supporting Stewart Title's production reporting and delivering to Fiverr clients in US time zones, and I keep a UPS and a 4G hotspot as backup so a power cut does not turn into a missed meeting.

**Q: What would you do if your internet failed during a client presentation?**
Switch to the phone hotspot, which I keep configured, rejoin within a minute and say once that I am back on a backup line, then continue from the slide I was on. Before any presentation I also send the deck or dashboard link in advance, so the client can keep reading while I reconnect. In production support I treated my own connectivity like any other single point of failure: identify it, add redundancy, test the failover. The same habit applies here.

**Q: How do you make sure you are on time for interviews across time zones?**
I write every meeting in both zones in the confirmation email and in my calendar, which is set to Asia/Karachi so invites convert automatically. I check whether the other side is currently on daylight time, because Pakistan does not observe it and the offset to the US shifts by an hour in March and November. I join five minutes early with the link already tested, and I keep the recruiter's number in case something on their side changes.

# LEVEL: Intermediate

## STAR method & building a story bank

Behavioural questions ("tell me about a time when...") are answered with **stories**, and the standard structure for a story is **STAR**: Situation, Task, Action, Result. Interviewers are trained to listen for those four parts; if one is missing they will probe for it, and if two are missing they will mark the answer as weak.

| Part | What it contains | Share of the answer |
|---|---|---|
| **S**ituation | Where, when, what was going on. One or two sentences. | 15% |
| **T**ask | What *you* were responsible for. Not the team: you. | 10% |
| **A**ction | What you did, step by step, with tools and decisions. | 55% |
| **R**esult | The measurable outcome, plus what you learned. | 20% |

The most common failure is a long Situation and a vague Action. Flip it: two sentences of context, then most of your time on what you personally did.

### One story in full

```text
Q: Tell me about a time you had to hit a target under pressure.

S: At Systems Limited I led a 20-agent data-processing team on a US title-search project.
   One Monday the client sent a backlog of roughly three days of work with the same TAT.
T: I owned the queue, allocation and QC, so the daily target was mine to hit.
A: I split the batch by document type and re-allocated by each agent's measured accuracy
   on that type, moved two of my strongest processors onto QC to keep the sample rate,
   and set a 2-hour checkpoint on the status board instead of the usual end-of-day check.
   I told the client at noon exactly what we would deliver by 6 pm and what would roll over.
R: We cleared the backlog in two days instead of three with the error rate unchanged, and
   the client asked for the checkpoint report to become the daily standard.
   What I learned: telling the client the honest number at noon bought more goodwill than
   any amount of over-promising.
```

### The story bank: 15 stories from Ali's history

A story bank is a list of 12–15 STAR stories, each tagged with the competencies it proves. Prepare it once and you can answer almost any behavioural question by picking the right story. Every story below is written in compressed STAR form; expand any of them to 90 seconds when spoken.

```text
 1. Backlog under TAT (Systems Limited, team lead) — see full version above.
    Tags: pressure, planning, leadership, client communication.

 2. QC to team lead promotion — S: quality checker sampling processed records. T: reduce
    rework. A: built an error taxonomy (wrong field, missing page, typo, misread stamp),
    tracked it per agent, ran 10-minute daily coaching on the top category. R: rework in
    sampled batches fell visibly within a month; promoted to lead the team.
    Tags: initiative, data-driven coaching, quality.

 3. Underperforming agent — S: one agent at 60% of target for two weeks. T: fix or escalate.
    A: sat with him for a shift, found he was re-opening images because of a slow viewer
    setting; fixed the setup, set a two-week plan with daily numbers. R: back to target in
    eight days; no HR escalation. Tags: coaching, empathy, root cause.

 4. Conflict with a peer lead over shared QC capacity — A: proposed a rota based on each
    team's queue size, agreed in writing. R: no further disputes. Tags: conflict, fairness.

 5. Weekly status report for Stewart Title — S: leadership needed a Monday report. T: build
    and own it. A: pulled counts per stage, reconciled against source before sending,
    added a variance column and a one-paragraph narrative. R: became the standard report;
    zero corrections issued after distribution. Tags: reporting, accuracy, ownership.

 6. Caught a wrong number before it went out — S: a state count did not reconcile by 14
    files. T: find why. A: traced to duplicate rows from a re-run export; de-duplicated on
    file number and added a check row. R: report went out correct; check became permanent.
    Tags: attention to detail, validation, integrity.

 7. Rate matrix rebuild — S: 50-state rate tables maintained by copy-paste. T: make them
    reliable. A: single lookup model with INDEX/MATCH and named ranges, version tab, test
    cases against the published rate manual. R: eliminated the class of copy errors found
    earlier. Tags: Excel, design, quality.

 8. Rate calculator for non-technical users — A: form-style sheet, data validation lists,
    protected cells, explicit rounding rule documented. R: adopted by the support team.
    Tags: user focus, documentation.

 9. 767-page handbook — S: client's TOC broke on every edit; 3-day revision cycle. A:
    rebuilt on a styled .dotx, heading-based TOC, REF cross-references, python-docx bulk
    styling. R: revision in ~2 hours, zero broken references. Tags: automation, structure.

10. 168-field fillable PDF — S: complex intake form for a US client. A: AcroForm fields
    with consistent naming, calculation and validation scripts, tab order, tested in Acrobat,
    Preview and Chrome. R: accepted first pass; repeat client. Tags: detail, testing.

11. Difficult freelance client — S: scope grew from 1 template to a 6-document suite
    mid-project. A: paused, wrote the scope as a list, priced the delta, offered a phased
    delivery. R: client accepted the phased plan and left a 5-star review.
    Tags: scope management, negotiation, communication.

12. Missed deadline (failure story) — S: EPUB3 conversion delivered a day late because
    epubcheck failed on an embedded font licence. A: told the client the same hour with
    a new ETA, fixed the font, added epubcheck to my pre-delivery checklist. R: late but
    accepted; never repeated. Tags: failure, honesty, process improvement.

13. Power BI dashboard for a sales client — S: weekly manual Excel summary took 3 hours.
    A: star-schema model, DAX measures for MTD/YTD, scheduled refresh. R: Monday reporting
    down to ~10 minutes. Tags: data modelling, impact.

14. Learning a new tool fast — S: client needed pikepdf-based PDF repair I had not done.
    A: read the docs, prototyped on sample files, shipped with tests. R: delivered on time;
    now a standard service. Tags: learning agility.

15. Studying while working — S: BS Software Engineering alongside full-time freelance.
    A: fixed study blocks, applied coursework (SQL, OOP) directly to client automation.
    R: on track to graduate; skills used on paid work. Tags: time management, growth.
```

### Choosing the right story

Most behavioural questions map onto one of about eight themes: leadership, teamwork, conflict, failure, pressure, initiative, attention to detail, learning. Tag every story with two or three themes so that any question has at least two candidate stories, and never tell the same story twice to the same panel.

> **Interview note:** Interviewers probe the Action with "what did *you* do?" and the Result with "how do you know?". Have the number and the method ready: "rework fell" is weak; "rework in the sampled batches fell from about 8% to under 3% in a month, measured from the QC log" is strong.

### Try It Yourself

```text
Story card template (make one per story, 15 cards)

Title:        Backlog under TAT
Role/Place:   Team lead, Systems Limited, title-search project
Situation:    3-day backlog arrived Monday with unchanged TAT
Task:         Hit daily target without dropping QC sample rate
Action:       1) Split by doc type  2) Allocate by measured accuracy
              3) 2 strong agents to QC  4) 2-hour checkpoints  5) Noon client update
Result:       Cleared in 2 days, error rate flat, checkpoint report adopted
Number:       ~3 days of work in 2; error rate unchanged
Learned:      Honest midday number > over-promising
Tags:         pressure | leadership | client comms | planning
```

### Quiz

1. Which STAR part should take most of the answer?
- [ ] Situation
- [ ] Task
- [x] Action
> The interviewer is evaluating what you personally did; context should be brief.

2. How many stories should a story bank contain?
- [ ] 2
- [x] 12–15, each tagged with two or three themes
- [ ] 50
> Enough to cover every theme twice without repeating a story to the same panel.

3. What is the best way to state a Result?
- [ ] "It went well"
- [x] A measurable outcome plus how you measured it
- [ ] Skip it if the Action was strong
> Interviewers probe results with "how do you know?"; have the number and the source ready.

### Exercises

1. **Expand story 6** — Write the "caught a wrong number" story as a full 90-second STAR answer.
<details><summary>Solution</summary>

"While building the weekly production status report for the title-insurance client, one state's file count was 14 higher than the source system showed. It was my report, so it was my job to explain it before sending. I traced the extra rows to a re-run export that had appended instead of replaced, de-duplicated on file number, and added a reconciliation row at the bottom of the workbook that compares report totals to the source totals and turns red on any difference. The report went out correct and on time, the check has stayed in every version since, and it has caught two more issues without anyone downstream noticing a problem."

</details>

2. **Tag the bank** — Assign each of the 15 stories to at least two of: leadership, teamwork, conflict, failure, pressure, initiative, detail, learning.
<details><summary>Solution</summary>

1 pressure/leadership; 2 initiative/detail; 3 leadership/teamwork; 4 conflict/teamwork; 5 initiative/detail; 6 detail/pressure; 7 initiative/detail; 8 teamwork/initiative; 9 initiative/learning; 10 detail/pressure; 11 conflict/pressure; 12 failure/learning; 13 initiative/learning; 14 learning/pressure; 15 learning/initiative.

</details>

### Interview Questions

**Q: Tell me about a time you improved a process.**
As quality checker at Systems Limited I noticed that rework was being logged as a single count with no reason. I built a simple error taxonomy, wrong field, missing page, typo, misread stamp, and recorded it per agent in the QC log. Within two weeks the data showed that one category, misread stamps on older scanned deeds, caused most of the rework, so I ran ten-minute daily coaching sessions on just that. Rework in the sampled batches fell noticeably within a month, measured from the same log, and the taxonomy was adopted for the whole project. That work is what led to my promotion to team lead.

**Q: Describe a time you had to deliver something you had never done before.**
A client needed damaged PDFs repaired and re-linearised, which I had not done with pikepdf before. I read the pikepdf documentation, prototyped on three of the client's sample files, and wrote a small script that opened each file, saved it with `pikepdf.Pdf.save(..., linearize=True)` and verified page counts before and after. I delivered on the original deadline and added a test step that compares text extraction before and after so silent corruption cannot slip through. It is now a standard service on my Fiverr profile, and the pattern of prototype, test, then ship is how I approach every new tool.

**Q: Give an example of a measurable result you delivered.**
For a sales client I replaced a weekly manual Excel summary that took about three hours with a Power BI dashboard on a star-schema model with DAX measures for month-to-date and year-to-date, refreshed on a schedule. Their Monday reporting went from three hours to about ten minutes, which I know because the client timed it before and after and told me in the review. The trade-off was two days of modelling work upfront, which paid back within the first month.

## Behavioural questions (teamwork, conflict, failure, leadership, deadlines)

Behavioural interviewing rests on one belief: past behaviour predicts future behaviour. So instead of "are you a team player?" the interviewer asks "tell me about a time you disagreed with a teammate." This chapter covers the five themes that appear in almost every panel and shows how to answer each with a story from the bank.

### What the interviewer is scoring

| Theme | Hidden question | Weak answer smell | Strong answer includes |
|---|---|---|---|
| Teamwork | Do you make others better or just do your part? | "We all worked hard" | Your specific contribution and how you helped someone else |
| Conflict | Can you disagree without drama? | "I avoid conflict" | A real disagreement, how you resolved it, the relationship afterwards |
| Failure | Do you own mistakes and fix the system? | Blaming others, or "my weakness is perfectionism" | A genuine failure, what you changed, evidence it never recurred |
| Leadership | Can you get results through people? | Title-dropping | A decision you made, how you communicated it, the outcome |
| Deadlines | Can you plan and re-plan? | "I just worked late" | Prioritisation, trade-offs, stakeholder updates |

### Teamwork

**Q: Tell me about a time you helped a teammate succeed.**

```text
S: On the title-search project, a newer agent was consistently slow on a document type
   (older scanned deeds with handwritten stamps).
T: As team lead I needed her at target without lowering QC sample rate.
A: I paired her with a strong processor for two shifts, created a one-page cheat sheet
   of the twelve most common stamp formats with examples, and tracked her daily count.
R: She reached target in a week; the cheat sheet became part of onboarding for all new agents.
```

The interviewer hears: you noticed, you acted, you left a reusable artefact behind.

### Conflict

**Q: Describe a disagreement with a colleague and how you handled it.**

Use story 4 (shared QC capacity) or story 11 (client scope). The pattern is: state the other person's position fairly, explain what you proposed, show the resolution was based on data or a written agreement, and end with the relationship intact.

```text
"Another team lead and I both needed the shared QC pool at the same hours. Rather than
argue by seniority, I proposed we allocate QC time proportional to each team's queue size
that day, written on the board each morning. He agreed, we trialled it for a week, and the
dispute did not recur. We still coordinate that way."
```

> **Warning:** Never tell a conflict story where the other person is a villain. The interviewer imagines being that person.

### Failure

**Q: Tell me about a time you failed.**

Pick a real failure with a real cost, and spend most of the answer on what you changed. Story 12 (late EPUB3 delivery) works because it is specific, honest and closed.

```text
"I delivered an EPUB3 conversion a day late. The file failed epubcheck on an embedded font
licence issue I had not tested for. I told the client the same hour, gave a new ETA, fixed
the font and delivered. I then added epubcheck to my pre-delivery checklist for every ebook
and have not missed a delivery for that reason since. The client still left a 5-star review,
which I attribute to telling them early rather than to the fix."
```

Avoid the fake failure ("I care too much") and the catastrophic one ("I lost the client's data"). The right size is a mistake a competent professional could make once.

### Leadership

**Q: Tell me about a decision you made that was unpopular.**

```text
"When the backlog arrived, I moved two of my fastest processors onto QC. They were unhappy
because their personal counts would drop. I explained that without QC we would deliver
faster but with errors, and the client would send it all back. I also made sure their
performance review counted QC output. We cleared the backlog with the error rate flat,
and both were the first to volunteer for QC the next time."
```

The scorecard evidence: made a decision, explained the reasoning, handled the people impact, got the result.

### Deadlines

**Q: How do you handle multiple deadlines at once?**

Talk about a system, then a story. The system: list every deliverable with its due date and effort, identify the one with the worst ratio of risk to slack, negotiate early, and communicate changes before they are discovered. The story: three Fiverr deliveries and a Stewart Title weekly report landing on the same Monday.

```text
Priority triage (what to say you actually do)

1. List everything due with the hard deadline and the estimated hours.
2. Mark items where being late costs someone else's deadline (the weekly report feeds a
   Monday leadership meeting; it goes first).
3. Negotiate the item with the most slack (a Fiverr template job with a flexible client:
   ask for one extra day, offer a partial delivery today).
4. Automate or template the repeatable item (the report assembly is scripted).
5. Send a short status to each stakeholder before the day ends.
```

### Follow-up probes and how to survive them

Interviewers dig with "what would you do differently?", "what did your manager think?", "what if it had not worked?". Prepare one sentence for each on every story. For the backlog story: "Differently, I would have set the two-hour checkpoint on day one, not day two." "My manager adopted the checkpoint report." "If it had not worked, I had already told the client which items would roll to day three, so the miss would have been managed, not discovered."

### Try It Yourself

```text
Behavioural answer skeleton (fill in under 120 words, speak in ~75 seconds)

Question theme: ____________
Story #: ____ from the bank
S (1–2 sentences): ______________________________________________
T (1 sentence, "I was responsible for"): ________________________
A (3–5 numbered actions with a tool or decision each): 1) ___ 2) ___ 3) ___
R (number + how measured + one lesson): __________________________
Probe answers: Differently? ______  Manager's view? ______  If it failed? ______
```

### Quiz

1. What is the safest kind of failure story?
- [ ] A weakness disguised as a strength
- [x] A real mistake with a real cost, followed by a system change that prevented recurrence
- [ ] A disaster caused by someone else
> Interviewers want ownership and a fixed process, not blame or humble-bragging.

2. In a conflict story, how should you describe the other person?
- [x] Fairly, stating their position as they would
- [ ] As the cause of the problem
- [ ] Not at all
> The interviewer imagines being the colleague; fairness signals you can work with anyone.

3. What proves leadership better than a title?
- [ ] Number of direct reports
- [x] A decision you made, how you communicated it and the outcome
- [ ] Years of experience
> Leadership is scored on behaviour and results, not on hierarchy.

### Exercises

1. **Deadline story** — Write a STAR answer for "tell me about a time you missed a deadline or nearly did" using a real week of your own.
<details><summary>Solution</summary>

"One Monday I had the weekly production status report due for the title-insurance client and two Fiverr deliveries. The report feeds a leadership meeting, so it went first; I ran my assembly script, reconciled the counts and sent it by 9 am Central. One Fiverr client had a fixed launch date, so I delivered that second. For the third I messaged the client at the start of the day, explained I could deliver the styled template the next morning or a draft that evening, and they chose the next morning. Nothing was late, and the lesson I keep is that a short message at 9 am is worth more than a heroic 2 am delivery."

</details>

2. **Probe drill** — For story 3 (underperforming agent), write one-sentence answers to: What if he had not improved? What did HR say? What would you do differently?
<details><summary>Solution</summary>

"If he had not improved by the end of the two-week plan I would have escalated with the daily numbers and the coaching log so HR had evidence, not opinion." "HR was not involved because the plan worked, but my manager was informed from day one." "Differently, I would have sat with him in the first week rather than the second; the root cause was a viewer setting that took one shift to find."

</details>

### Interview Questions

**Q: Tell me about a time you disagreed with your manager.**
At Systems Limited my manager wanted to raise the daily target after a strong week. I agreed with the goal but showed him from the QC log that the strong week coincided with a run of easier document types, and that the error rate had already crept up on the harder ones. I proposed raising the target in two steps with a QC sample-rate check between them. He accepted the phased approach; we reached the higher target a month later without a quality drop. I disagreed with data, not opinion, and I offered a path to his goal rather than a no.

**Q: Describe a situation where you had to work with someone difficult.**
A freelance client changed the scope from one letterhead template to a six-document branded suite halfway through, without expecting the price or the deadline to change. Instead of pushing back emotionally, I paused, wrote the new scope as a numbered list, priced the difference and offered a phased delivery: the original template on the original date, the rest a week later. Putting it in writing turned a frustrating chat into a decision they could approve, they accepted the phased plan and left a five-star review. I now confirm scope in a numbered list on every order before starting.

**Q: What is your biggest professional weakness?**
I over-validate. On reports I would rather reconcile a number twice than send it once, which occasionally costs thirty minutes when a stakeholder needed the draft immediately. I have addressed it by separating "provisional" from "final": I send the draft on time marked provisional with the specific numbers still being reconciled, and follow with the final. That keeps my accuracy habit, which has caught real errors such as duplicated export rows, without holding up people who need direction now.

**Q: Tell me about a time you took initiative without being asked.**
As a quality checker, nobody asked me to categorise errors; the log was just a count. I added an error taxonomy and tracked it per agent, which revealed that a single category was driving most rework. I then ran short daily coaching sessions on it and rework fell within a month. My manager adopted the taxonomy for the whole project, and it was the main reason I was promoted to team lead. The general habit is that whenever a number is reported without a reason attached, I try to add the reason.

## Questions to ask the interviewer

"Do you have any questions for us?" is not politeness; it is scored. A candidate with no questions signals low interest or low preparation. A candidate with sharp questions signals that they are already thinking like an employee. Prepare six to eight questions, ask three or four, and adapt them to who is in the room.

### Match the question to the interviewer

| Interviewer | Ask about | Avoid |
|---|---|---|
| Recruiter | Process, timeline, team size, remote policy, band | Deep technical detail |
| Technical screener | Stack, data sources, how reports are validated, tooling pain | Salary |
| Hiring manager | Success at 90 days, biggest problem right now, how decisions are made | Vacation policy |
| Peer / cross-functional | A day in the role, what they wish they had known, collaboration | Their salary or performance |
| Executive | Strategy, why this role exists now, what "great" looks like in a year | Trivia |

### Questions that show you understand reporting and operations

```text
For a Reporting Analyst role
1. What does the current weekly reporting look like, and what breaks most often?
2. Where does the data come from (system exports, a warehouse, manual sheets), and who
   owns the source of truth when two numbers disagree?
3. How are reports validated before they reach leadership today?
4. What would you want automated first if I started Monday?
5. What decision did a report change in the last quarter?

For a Document Automation / Production role
1. What is the volume: documents per month, typical page counts, how many templates?
2. Which formats matter most: DOCX, PDF (fillable or print), EPUB?
3. Where do errors surface today, at QC, at the client, or in the field?
4. Is there an existing template suite or style guide, or would I be building one?
5. How much of the pipeline is scripted (Python, VBA, Power Automate) versus manual?

For any hiring manager
1. What would a great first 90 days look like from your side?
2. What is the biggest problem on the team right now that this hire should help with?
3. How is performance measured for this role: metrics, reviews, both?
4. Why is the role open: growth, backfill or a new function?
```

### Questions for a remote or international role

- "What hours do you need me online in your time zone, and which are flexible?"
- "How does the team communicate: Slack, email, daily stand-up, weekly sync?"
- "Are there other team members outside the US, and how has that worked?"
- "How is the contract structured for international hires: contractor, EOR platform such as Deel or Remote, or local entity?"

The last question matters for salary negotiation later: contractor status changes tax, benefits and payment method.

### Questions to avoid in the first round

Salary, leave, benefits and "how soon can I be promoted?" belong with the recruiter or after an offer, not in the technical screen. "What does your company do?" tells them you did not read the website. "Did I pass?" puts the interviewer in an awkward spot; ask instead "Is there anything about my background you would like me to clarify?", which invites them to surface a concern you can still address.

> **Tip:** Write the interviewer's answers down. When a second interviewer asks whether you have questions, you can say "Daniel mentioned the Monday report breaks when the export format changes; how does your team handle that?" That is the single most impressive thing a candidate can do in a panel.

### The closing question

End every interview with a version of: "Based on what we have discussed, is there anything that gives you pause about my fit for the role?" Sixty percent of the time the answer is "no, this was great". The other forty percent you get one more chance to address the concern, for example "you have not used Tableau", with a concrete plan.

### Try It Yourself

```text
Question plan for a 45-minute hiring-manager interview

Before:  Read the JD, the company's site, the interviewer's LinkedIn; note 2 things to reference.
Minute 35–42 (their "any questions?"):
  Q1 (role):     "What would a great first 90 days look like from your side?"
  Q2 (problem):  "What breaks most often in the current weekly reporting?"
  Q3 (context):  "You mentioned ___ earlier; how does that affect this role?"
  Q4 (closing):  "Is there anything about my background you would like me to clarify?"
After:   Note the answers; reuse Q2's answer in the follow-up email and the next round.
```

### Quiz

1. When should you ask about salary and leave?
- [ ] In the technical screen
- [x] With the recruiter or after an offer
- [ ] Never
> Compensation questions belong with HR or at offer stage, not with technical interviewers.

2. What is the best closing question?
- [ ] "Did I pass?"
- [x] "Is there anything about my background you would like me to clarify?"
- [ ] "When do I start?"
> It invites the interviewer to surface a concern you can still address.

3. Why reference an earlier interviewer's answer in a later round?
- [x] It shows listening and makes you look like a colleague already
- [ ] It fills time
- [ ] It is required
> Cross-referencing information from the panel is a strong signal of engagement.

### Exercises

1. **Six questions** — Write two questions each for a recruiter, a technical screener and a hiring manager for a Reporting Analyst role.
<details><summary>Solution</summary>

Recruiter: "What are the remaining stages and the timeline?" "Is the role a contractor or employee arrangement for international hires?" Technical: "Where does the reporting data come from and how is it validated today?" "What tools are in the stack: SQL warehouse, Excel, Power BI?" Hiring manager: "What would a great first 90 days look like?" "What is the biggest reporting problem on the team right now?"

</details>

2. **Turn an answer into a follow-up** — The manager says "our Monday report breaks when the export format changes." Write the sentence you would put in your thank-you email.
<details><summary>Solution</summary>

"You mentioned the Monday report breaks whenever the export format changes. In my last reporting role I handled that by loading the export through Power Query with a column-name check that fails loudly and a reconciliation row that compares totals to the source, and I would be glad to sketch how that could apply to your report."

</details>

### Interview Questions

**Q: Do you have any questions for me?**
Yes, three. First, what would a great first ninety days look like from your side, so I can understand what to prioritise? Second, you mentioned the weekly report is assembled by hand from several exports; what breaks most often, and who owns the source of truth when two numbers disagree? Third, is there anything about my background, for example that my SQL has been used more in projects than in a production warehouse, that you would like me to clarify before we finish?

**Q: What do you want to know about the team before accepting an offer?**
Three practical things: the overlap hours you expect in your time zone so I can commit honestly from UTC+5; how the team communicates day to day, whether that is Slack, a daily stand-up or a weekly sync, because it affects how I plan my heads-down time; and the contract structure for international hires, since contractor versus employer-of-record changes how benefits and taxes work. I would also want to know how performance is measured, because I like to have a number I am accountable for, as I did with daily target attainment on my team.

**Q: Why do you ask so many questions about data sources?**
Because in my experience most reporting failures are upstream of the report. When my weekly production report showed a 14-file discrepancy, the cause was a duplicated export, not the formulas. Knowing where data comes from, who owns it and how exceptions are handled tells me how much validation I will need to build and where I can automate safely. It also tells me how quickly I can be useful, which is what both of us care about in the first ninety days.

## Handling gaps, career changes & "why are you leaving"

Every resume has a story the interviewer wants explained: a gap, a change of direction, a short stint, or a reason for leaving. These questions are not traps. The interviewer is checking for two things: honesty and a forward-looking reason. Give both in two or three sentences and move on.

### The general formula

```text
1. State the fact plainly (no apology, no drama).
2. Give the real reason in one sentence.
3. Say what you did or learned during that time.
4. Connect it to why you are a stronger candidate now.
```

### "Why are you leaving?" / "Why did you leave?"

The only acceptable direction is **towards** something, never **away** from someone. Even if the real story is a bad manager, the interviewer will hear it as "this person might say the same about us".

```text
Weak:   "The management was terrible and there was no growth."
Strong: "I have taken the reporting work as far as it goes in a support contract; the next
         step is owning reports end-to-end inside an operations team, which is what this
         role is."

Weak:   "Freelancing is unstable."
Strong: "Freelance taught me to scope, deliver and communicate with 400+ clients. What it
         cannot give me is continuity: owning the same reports every week so I can automate
         deeper. That is what I want now."
```

### Gaps

A gap is a period of three months or more with no listed role. Common honest reasons: study, family, health, relocation, a freelance period that was not on the resume, a job search after a contract ended. State the reason and what you did.

```text
"There is a gap between the Stewart Title contract ending and my next role. I used it to
finish two semesters of my Software Engineering degree and to build the Python automation
that now runs most of my document work. I also kept freelancing part-time, which is why the
Fiverr count kept growing."
```

For a health or family reason: "I took six months to deal with a family matter; it is fully resolved and I have been back at full capacity since [date]." No further detail is owed, and a good interviewer will not ask.

### Career change: from BPO operations to analyst or document engineer

Framing is everything. The wrong framing is "I used to do data entry and now I want to do analysis." The right framing is that operations gave you the domain and the discipline, and the new role is the natural next layer.

| Old role | Transferable evidence | How to say it |
|---|---|---|
| Quality checker | Sampling, error taxonomies, attention to detail | "I built the error taxonomy the team still uses" |
| Team lead of 20 | Targets, allocation, reporting, coaching | "I owned the queue numbers every day; reporting was already my job" |
| Production support | Weekly reports, rate matrices, validation | "This is analyst work under a different title" |
| Freelance | Client management, delivery, automation | "400 briefs, 400 deadlines, public ratings" |

A BS in Economics plus a BS in Software Engineering in progress makes the story even cleaner: quantitative foundation, then engineering depth, applied throughout in real work.

### Short stints and contracts

Contracts end; that is what contracts do. Say so. "The Stewart Title engagement was a fixed-term production support contract; it ended on schedule and I left with the reports I built still in use." For a genuinely short permanent role: "I joined, realised within three months that the role was mostly phone support rather than reporting, and left cleanly rather than stay unhappy. I now ask about the actual split of work before accepting, which is why I asked you about it earlier."

### Overqualified, underqualified, or "why not a bigger company?"

- **Overqualified for a role:** "I want to be hands-on with reports and automation for the next few years; a title is less important than the work."
- **Underqualified on one tool:** name it, show a plan, offer a test.
- **Why a small company / why a contract:** "Smaller teams let me own the whole pipeline: data, report and document. That is where I do my best work, as my freelance record shows."

> **Interview note:** Never say anything negative about a previous employer, client or manager. If pressed ("what did you dislike?"), name a structural thing you could not change, for example "the client's systems did not allow automation, so reports stayed manual", and pivot to what you did about it.

### Study while working

Interviewers sometimes worry a degree in progress will compete with the job. Answer with the schedule: "My remaining coursework is evenings and weekends, roughly eight hours a week, and it has been that way while I delivered full-time for the last two years. The coursework, SQL and OOP in particular, has directly improved my client automation."

### Try It Yourself

```text
Gap / change script builder

Fact:        "There is a ___-month gap between ___ and ___."
Reason:      "I ___ ." (one sentence, true, no blame)
Used it for: "During that time I ___ ." (study, project, freelance, family, recovery)
Now:         "That is why I can now ___ ." (skill or clarity you bring to this role)
Practise until the whole thing is under 30 seconds.
```

### Quiz

1. What is the safest direction for a "why are you leaving?" answer?
- [x] Towards something the new role offers
- [ ] Away from a bad manager
- [ ] Away from low pay
> Interviewers hear complaints about a past employer as a preview of complaints about them.

2. How should you explain a fixed-term contract ending?
- [ ] Avoid mentioning it
- [x] State that it was a contract that ended on schedule and what you left behind
- [ ] Say you were let go
> Contracts ending on schedule is normal; frame it plainly with the work you delivered.

3. How much detail do you owe about a health or family gap?
- [ ] Full medical history
- [x] The category, that it is resolved, and when you returned to full capacity
- [ ] None; refuse to answer
> A brief, honest statement with a resolution is enough and is what good interviewers expect.

### Exercises

1. **Write your leaving line** — Draft the two-sentence answer for why you are moving from freelance to full-time, in the "towards" framing.
<details><summary>Solution</summary>

"Freelance gave me 400 projects' worth of scoping, delivery and client communication, and I am proud of that record. What it cannot give me is continuity: owning the same reports and documents week after week so I can automate deeper and see the impact over time, and that is exactly what this role offers."

</details>

2. **Reframe a negative** — Rewrite "the client's processes were outdated and nobody wanted to change" into a neutral, forward-looking sentence.
<details><summary>Solution</summary>

"The client's systems did not allow automation at the time, so the reports stayed manual; I documented the process thoroughly and built validation checks around it, and I am looking for a team where the automation side can actually be built."

</details>

### Interview Questions

**Q: Why are you leaving freelancing for a full-time role?**
Freelancing has been a good teacher: more than four hundred briefs, each with a deadline, a stakeholder and a public rating, taught me to scope precisely and deliver on time. What it lacks is continuity. When I own the same weekly report or template suite for a year, I can automate deeper, measure the impact and improve it, which I did during the Stewart Title contract and enjoyed most. This role offers that continuity plus a domain I already know, which is why I am moving towards it rather than away from anything.

**Q: You moved from BPO operations into reporting and document automation. Why the change?**
It was less a change than a progression. As a quality checker I was already building error taxonomies; as a team lead I owned the daily queue numbers and produced the reports; in production support I built the weekly status reports and rate matrices officially. Freelance let me add the engineering side, python-docx, PyMuPDF and openpyxl, to automate what I used to assemble by hand. The Economics degree gave me the quantitative base and the Software Engineering degree is adding the engineering depth, so the path has been the same job at increasing levels of leverage.

**Q: There is a gap on your resume. What were you doing?**
After the production-support contract ended on schedule I took several months to complete two semesters of my Software Engineering degree full-time and to build the Python automation that now runs most of my document pipeline. I kept freelancing part-time during that period, which is why the Fiverr review count kept rising through it. I came out of the gap with SQL and OOP coursework applied directly to client work, and I have been at full capacity since.

## Body language, tone & English fluency tips

Interviewers form impressions from how you speak long before they evaluate what you say. This is not about accent; strong candidates from Lahore interview successfully with US and UK teams every day. It is about clarity, pacing, structure and presence on camera. All of it is trainable.

### Pacing and structure

The single biggest improvement most candidates can make is to **slow down and signpost**. Nervous candidates speak fast and in one long sentence. Confident candidates speak at about 140–160 words per minute and announce their structure.

```text
Signposting phrases that make you easy to follow

"There are three parts to that."                  (before a longer answer)
"First... second... and finally..."               (inside it)
"The short answer is yes; the detail is..."       (direct question)
"Let me give a concrete example."                 (before the STAR story)
"The result was..."                                (so they hear the number)
"To summarise..."                                  (when you sense you ran long)
```

Pause for a full second after a question before answering. It looks thoughtful, and it stops the "umm" reflex.

### Fillers, hedges and upspeak

- **Fillers:** "umm", "like", "basically", "you know", "actually". Record yourself and count them; most people are shocked. Replace with a silent pause.
- **Hedges:** "I think maybe I kind of sort of did..." Say "I built" or "I led".
- **Upspeak:** ending statements with a rising tone makes facts sound like questions. Practise ending sentences with a falling tone: "We cleared the backlog in two days."
- **Minimising:** "I just made a small report." Say "I built the weekly production report leadership used every Monday."

### Common South Asian English patterns to watch

None of these is wrong, but each can slow a US or UK listener.

| Habit | Better in interviews |
|---|---|
| "I am having 7 years experience" | "I have seven years of experience" |
| "Do the needful", "revert back", "prepone" | "handle it", "reply", "move it earlier" |
| "Myself Ali" | "I am Ali" |
| Very long compound sentences with "and... and... and" | Short sentences. Full stop. Next point. |
| "Sir" / "Madam" in every sentence | Use their first name once they use yours |
| Very fast pace under nerves | Deliberate pace with pauses |

Use the interviewer's first name when they introduce themselves that way; US and UK interviewers find "Sir" distancing. Say "Daniel" or nothing.

### Vocabulary that sounds like an analyst

Interviewers listen for professional vocabulary used correctly. A short list to use naturally:

```text
reconcile, variance, source of truth, validate, sample rate, throughput, backlog, TAT/SLA,
root cause, trade-off, stakeholder, scope, deliverable, iteration, baseline, KPI,
"the number moved from X to Y", "measured by", "the constraint was", "the trade-off was"
```

### On camera

- **Eye contact** means looking at the lens when you deliver the key point, then back to the screen while listening. A small sticky note next to the camera helps.
- **Sit still but not stiff.** Lean in slightly when listening. Nod occasionally.
- **Hands** in frame when explaining; keep them below chin height.
- **Smile** when greeting and when the interviewer makes a joke; a neutral face on video reads as cold.
- **Do not read.** Notes are fine for questions to ask and numbers, but reading an answer is obvious and sounds flat.

### Handling the moment you do not know

Silence is worse than a structured "I do not know". Use one of three moves:

```text
1. Partial: "I have not used Tableau in production; in Power BI I would do it with a DAX
   measure, and I expect the equivalent in Tableau is a calculated field."
2. Clarify: "Do you mean validating at import or at report time? I have done both differently."
3. Think aloud: "Let me reason through it. If the export duplicates rows, the first check I
   would run is a count of distinct file numbers against total rows..."
```

> **Tip:** Practise with a recording, not a mirror. Record five answers on your phone, play them back at 1.25x speed and note every filler, hedge and upspeak. Repeat three times a week for two weeks; the improvement is dramatic.

### Warm-up before the call

Ten minutes before: read your introduction aloud twice, say a few tongue-twisters to loosen your mouth, drink water, and stand up straight for a minute. Sit down at the two-minute mark, open the link, smile.

### Try It Yourself

```text
Self-review sheet (score each recorded answer 1–5)

Answer: ______________________       Length: ___ s (target 60–90)
Pace (140–160 wpm, pauses used)          ___
Structure (signposted, STAR complete)    ___
Fillers counted (umm/like/basically)     ___  (target < 3 per answer)
Upspeak / hedges noticed                 ___  (target 0)
Eye contact at key point                 ___
Number stated clearly                    ___
One thing to fix next take:              ______________________________
```

### Quiz

1. What speaking pace is comfortable for interviewers?
- [ ] As fast as possible to fit everything in
- [x] About 140–160 words per minute with pauses
- [ ] Under 100 words per minute
> Deliberate pacing with pauses sounds confident and is easier to follow across accents.

2. Where should you look when delivering a key point on video?
- [x] At the camera lens
- [ ] At your own image
- [ ] At your notes
> Looking into the lens reads as eye contact to the interviewer.

3. What should you say when you do not know an answer?
- [ ] Nothing; wait for the next question
- [x] Give a partial answer, ask a clarifying question or reason aloud
- [ ] Change the subject
> Structured honesty shows how you think; silence or bluffing does not.

### Exercises

1. **Filler count** — Record your 90-second introduction and count fillers. Re-record until there are fewer than three.
<details><summary>Solution</summary>

Most candidates start at 8–15 fillers in ninety seconds. The fastest fix is to replace each filler with a one-second pause and to memorise the first sentence of each beat so there is no searching for words at transitions. Three takes typically halve the count; a week of daily practice gets it under three.

</details>

2. **Rewrite five sentences** — Convert "I am having good experience in making reports and I was doing validation also" into interview English.
<details><summary>Solution</summary>

"I have seven years of experience building production reports. I validated every report against the source system before it was distributed." Two short sentences, a number, and two strong verbs.

</details>

### Interview Questions

**Q: How comfortable are you communicating with US stakeholders in English?**
Very comfortable. I have supported Stewart Title's production team and delivered to more than four hundred clients on Fiverr and Upwork, most of them in the US and UK, on calls, on video and in writing. I keep my writing short and structured, with a number and a next step in every status message, and on calls I signpost longer answers so people can follow across accents and connection quality. If a term is ambiguous, for example whether "validation" means at import or at report time, I ask rather than guess.

**Q: How do you handle a question you do not know the answer to?**
I say what I do know, then reason towards the rest out loud. For example, if asked about a Tableau feature I have not used, I would explain how I would solve the problem in Power BI with a DAX measure and note that Tableau's equivalent is a calculated field, then offer to confirm. Interviewers usually care more about the reasoning than the specific fact, and bluffing is far more damaging than a clear "not yet, here is how I would find out."

**Q: Describe how you explain a technical problem to a non-technical manager.**
I lead with the impact, then the cause, then the fix, in that order and in plain words. When a weekly report showed fourteen extra files, I told the manager: "The count is fourteen high because an export ran twice and appended; I have removed the duplicates and added a check that will flag this automatically; the corrected report is attached." Three sentences, no jargon, and a permanent fix they can trust. I save the technical detail, such as the de-duplication key, for anyone who asks.

# LEVEL: Advanced

## Technical screens: Python, SQL, Excel & JavaScript

A technical screen for an analyst or document-automation role is rarely an algorithms contest. It tests whether you can do the daily work in front of someone: pull and shape data, write a correct formula, script a repetitive task, and explain your reasoning while you do it. This chapter shows what each language screen typically asks, with sample questions and worked answers you can practise against.

### What each screen is really testing

| Screen | Typical format | What they look for |
|---|---|---|
| SQL | 3–5 queries on a small schema, live or in a sandbox | Joins, aggregation, filtering after grouping, window functions, NULL handling |
| Excel | Shared workbook, screen share | Lookups, SUMIFS, PivotTables, cleaning text, absolute references, error handling |
| Python | CoderPad or a shared notebook | Loops, dicts, string handling, pandas basics, reading files, clean functions |
| JavaScript | Rare for analysts; common for docx-js or web form work | Arrays, objects, async/await, DOM or library calls |

### SQL: the questions that always come up

Assume a small production schema: `files(file_id, state, received_date, status, agent_id)` and `agents(agent_id, name, team)`.

```sql
-- 1. Files completed per state this month, largest first
SELECT state, COUNT(*) AS completed
FROM files
WHERE status = 'DONE'
  AND received_date >= date('now', 'start of month')
GROUP BY state
ORDER BY completed DESC;

-- 2. Agents with more than 50 rework items (filter AFTER grouping = HAVING)
SELECT a.name, COUNT(*) AS rework
FROM files f
JOIN agents a ON a.agent_id = f.agent_id
WHERE f.status = 'REWORK'
GROUP BY a.name
HAVING COUNT(*) > 50;

-- 3. Latest file per agent (window function)
SELECT agent_id, file_id, received_date
FROM (
  SELECT agent_id, file_id, received_date,
         ROW_NUMBER() OVER (PARTITION BY agent_id ORDER BY received_date DESC) AS rn
  FROM files
) t
WHERE rn = 1;

-- 4. Running total of files received per day
SELECT received_date,
       COUNT(*) AS received,
       SUM(COUNT(*)) OVER (ORDER BY received_date) AS running_total
FROM files
GROUP BY received_date;
```

What interviewers probe: the difference between `WHERE` and `HAVING`; why `LEFT JOIN` keeps agents with zero files while `INNER JOIN` drops them; that `COUNT(column)` ignores NULLs while `COUNT(*)` does not; and that `ROW_NUMBER` gives unique ranks while `RANK` allows ties. Say these out loud as you write.

### Excel: the live workbook

The screen shares a workbook with a `Production` sheet (State, Date, Agent, Status, Files) and asks you to build summaries. The formulas they expect:

```excel
=SUMIFS(Production!E:E, Production!A:A, "TX", Production!D:D, "DONE")
=XLOOKUP(A2, Rates!A:A, Rates!C:C, "not found")
=INDEX(Rates!C:C, MATCH(A2, Rates!A:A, 0))
=IFERROR(VLOOKUP(A2, Rates!A:C, 3, FALSE), 0)
=COUNTIFS(Production!B:B, ">="&DATE(2026,9,1), Production!D:D, "REWORK")
=TRIM(PROPER(SUBSTITUTE(A2, "  ", " ")))
=TEXT(B2, "yyyy-mm") & " | " & A2
```

They will also ask you to build a PivotTable (Insert → PivotTable, States as Rows, Status as Columns, Files as Values), then to add a calculated percentage, and to explain when you would use Power Query (Data → Get Data → From File) instead of formulas: repeatable cleaning of an export, unpivoting a wide rate matrix, merging two tables. The best candidates mention `$A$2` absolute references, the danger of `VLOOKUP` with approximate match left on, and how to spot text-stored numbers (`=ISNUMBER(A2)`).

### Python: small, clean, explained

Analyst Python screens ask for a function, not a system. Typical tasks: parse a CSV, group and sum, de-duplicate, format an output. Here is a common one with the answer a strong candidate writes.

```python
# Q: Given rows of (file_id, state, status), return files completed per state,
#    ignoring duplicate file_ids, sorted by count descending.
from collections import Counter

def completed_per_state(rows):
    seen = set()
    counts = Counter()
    for file_id, state, status in rows:
        if file_id in seen:
            continue
        seen.add(file_id)
        if status == "DONE":
            counts[state] += 1
    return sorted(counts.items(), key=lambda kv: kv[1], reverse=True)

rows = [("F1", "TX", "DONE"), ("F2", "TX", "DONE"), ("F2", "TX", "DONE"),
        ("F3", "CA", "DONE"), ("F4", "CA", "REWORK")]
print(completed_per_state(rows))   # [('TX', 2), ('CA', 1)]
```

Explain as you go: why a set for de-duplication (O(1) lookups), why `Counter` instead of a manual dict, what happens with an empty list. If pandas is allowed, show the equivalent: `df.drop_duplicates("file_id").query("status == 'DONE'").groupby("state").size().sort_values(ascending=False)`.

A document-automation screen may instead ask you to sketch python-docx code: open a template, replace placeholders in paragraphs and table cells, save under a new name. Know that `python-docx` runs are split, so naive `paragraph.text` replacement loses formatting, and say how you handle it (replace at run level or rebuild the paragraph).

### JavaScript: when it appears

For roles involving docx-js, pdf-lib or web forms, expect array and async questions.

```js
// Q: Total pages across documents, only for status "final"
const docs = [
  { name: "Handbook", pages: 767, status: "final" },
  { name: "SOP", pages: 42, status: "draft" },
  { name: "Letterhead", pages: 1, status: "final" },
];
const total = docs.filter(d => d.status === "final").reduce((sum, d) => sum + d.pages, 0);
console.log(total); // 768

// Q: Explain what this prints and why
async function build() { return "done"; }
build().then(console.log); // "done" – async functions always return a Promise
```

> **Interview note:** Screens are scored on process as much as output. Restate the question, ask about edge cases (duplicates, NULLs, empty input), write the simple version first, test it with one example, then improve. A correct answer delivered silently scores lower than a correct answer you narrated.

### How to practise in two weeks

- SQL: one hour a day on a small SQLite database you build from your own production-report data; write the four query patterns above until they are automatic.
- Excel: rebuild your rate matrix as a lookup model; time yourself building a PivotTable from a raw export in under three minutes.
- Python: solve five small data-shaping tasks with plain Python, then the same five with pandas.
- Say every solution aloud as you write it.

### Try It Yourself

```sql
-- Practise: build this schema in SQLite and answer all four questions above.
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT, team TEXT);
CREATE TABLE files (file_id TEXT PRIMARY KEY, state TEXT, received_date TEXT,
                    status TEXT, agent_id INTEGER);
INSERT INTO agents VALUES (1,'Ayesha','A'),(2,'Bilal','A'),(3,'Chen','B');
INSERT INTO files VALUES
 ('F001','TX','2026-09-01','DONE',1),('F002','TX','2026-09-01','REWORK',2),
 ('F003','CA','2026-09-02','DONE',1),('F004','CA','2026-09-02','DONE',3),
 ('F005','NY','2026-09-03','DONE',2),('F006','TX','2026-09-03','DONE',3);
SELECT state, COUNT(*) AS completed FROM files
WHERE status='DONE' GROUP BY state ORDER BY completed DESC;
```

### Quiz

1. Which clause filters after aggregation?
- [ ] WHERE
- [x] HAVING
- [ ] GROUP BY
> `WHERE` filters rows before grouping; `HAVING` filters the grouped results.

2. What does `COUNT(column)` do with NULLs?
- [x] Ignores them
- [ ] Counts them
- [ ] Raises an error
> `COUNT(*)` counts rows; `COUNT(col)` counts non-NULL values in that column.

3. Why is `VLOOKUP(A2, Rates!A:C, 3)` risky?
- [ ] It is too slow
- [x] The omitted fourth argument defaults to approximate match
- [ ] It only works on sorted text
> Without `FALSE` (or 0), VLOOKUP returns the nearest lower match on unsorted data, which is wrong silently.

4. What does an `async` function always return?
- [ ] undefined
- [x] A Promise
- [ ] A string
> Even `return "done"` inside `async` is wrapped in a resolved Promise.

### Exercises

1. **Left join gap** — Write the SQL that lists every agent and their completed-file count, including agents with zero.
<details><summary>Solution</summary>

```sql
SELECT a.name, COUNT(f.file_id) AS completed
FROM agents a
LEFT JOIN files f ON f.agent_id = a.agent_id AND f.status = 'DONE'
GROUP BY a.name
ORDER BY completed DESC;
```

Putting `f.status = 'DONE'` in the `ON` clause keeps agents with no completed files; putting it in `WHERE` would drop them.

</details>

2. **Text-number cleanup** — In Excel a Files column is stored as text. Write the formula that converts it and the check that finds the bad cells.
<details><summary>Solution</summary>

Convert with `=VALUE(TRIM(E2))` (or `=--TRIM(E2)`); find bad cells with `=IF(ISNUMBER(E2), "", "text")` in a helper column and filter on "text". In Power Query the same fix is Transform → Data Type → Whole Number, which is repeatable on every export.

</details>

3. **Python de-dup** — Extend `completed_per_state` to also return the number of duplicate rows it skipped.
<details><summary>Solution</summary>

```python
def completed_per_state(rows):
    seen, counts, dupes = set(), Counter(), 0
    for file_id, state, status in rows:
        if file_id in seen:
            dupes += 1
            continue
        seen.add(file_id)
        if status == "DONE":
            counts[state] += 1
    return sorted(counts.items(), key=lambda kv: kv[1], reverse=True), dupes
```

</details>

### Interview Questions

**Q: Explain the difference between INNER JOIN and LEFT JOIN with an example from reporting.**
An inner join returns only rows with a match on both sides; a left join returns every row from the left table and fills the right side with NULLs where there is no match. In an agent productivity report, joining `agents` to `files` with an inner join silently drops any agent who processed nothing today, which hides exactly the people a team lead needs to see. I use a left join from agents to files and `COUNT(f.file_id)`, which counts non-NULL matches, so idle agents show zero rather than disappearing. If a filter such as `status = 'DONE'` belongs to the right table, it goes in the `ON` clause, not the `WHERE`, or the left join collapses back into an inner join.

**Q: When would you use Power Query instead of formulas?**
When the same cleaning has to be repeated on every new export: renaming columns, changing types, unpivoting a wide rate matrix into state, tier, rate rows, or merging two extracts on a key. Formulas are fine for a one-off summary, but they break when the export gains a column or the row count changes. With Power Query I load the file once, record the steps, and each week the refresh reapplies them; I add a step that fails loudly if an expected column is missing. For the weekly production report I would put ingestion in Power Query and keep SUMIFS and PivotTables for the presentation layer.

**Q: How would you replace placeholders in a Word template with python-docx without losing formatting?**
Word splits a paragraph into runs whenever formatting or spell-check state changes, so a placeholder like `{{client_name}}` can be broken across runs and a naive replace on `paragraph.text` either misses it or wipes the run formatting. My approach is to iterate runs, join their text, find the placeholder, and write the replacement into the first affected run while clearing the others, so the first run's formatting is preserved. I do the same for table cells and headers, and I keep placeholders in their own runs in the template by typing them in one go. For heavy templating I use docxtpl, which handles this with Jinja syntax, and I test on the real template with a checklist of every placeholder.

**Q: What is a window function and when did you last need one?**
A window function computes a value across a set of rows related to the current row without collapsing them, unlike GROUP BY. `ROW_NUMBER() OVER (PARTITION BY agent_id ORDER BY received_date DESC)` gives each agent's files a rank so I can pick the latest one; `SUM(COUNT(*)) OVER (ORDER BY received_date)` gives a running total for a cumulative throughput chart. I needed the running total for a status report that showed cumulative files delivered against a monthly target line, which is far simpler as a window function than as a correlated subquery.

## Take-home tests & case studies (data cleaning, report building, document automation)

A take-home is the hiring manager watching you work without watching you. It is the stage where a good document-and-data professional has the biggest advantage, because the skills being tested (scoping, cleaning, building, validating, communicating) are exactly the daily job. The trap is treating it as a coding exercise instead of a deliverable for a client.

### The three take-homes you will meet

| Type | Typical brief | Deliverable they expect |
|---|---|---|
| Data cleaning + summary | "Here is a messy CSV of 5,000 production rows. Clean it and tell us what you see." | Cleaned file, a short summary with 3–5 findings, the script or steps |
| Report building | "Build a weekly report from these exports for an operations manager." | Workbook or dashboard, a one-page narrative, refresh instructions |
| Document automation | "Generate 50 personalised letters from this template and this spreadsheet." | The generated files, the script, a QC checklist |

### Read the brief like a client order

Before touching data, write down: the audience, the decision the output supports, the hard constraints (format, deadline, tools), and any ambiguity. Then send one short clarifying email if there are open questions. That email itself scores points.

```text
Subject: Take-home — two quick clarifications

Hi Daniel,
Thanks for the brief. Two questions before I start:
1. The "Files" column has both counts and blanks; should a blank be treated as 0 or excluded?
2. Is the audience the operations manager only, or will this go to the client as well
   (affects how much detail I show per agent)?
If I do not hear back by tomorrow I will assume 0 and internal-only, and note the
assumptions in the deliverable.
Best regards, Ali
```

### Data cleaning: a repeatable script, not a one-off

Interviewers open the script before the output. They want to see functions, comments where a decision was made, and validation that fails loudly.

```python
import pandas as pd

def load_production(path):
    df = pd.read_csv(path, dtype=str)
    expected = {"file_id", "state", "received_date", "status", "agent", "files"}
    missing = expected - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
    df.columns = [c.strip().lower() for c in df.columns]
    df["state"] = df["state"].str.strip().str.upper()
    df["status"] = df["status"].str.strip().str.upper()
    df["files"] = pd.to_numeric(df["files"].str.replace(",", ""), errors="coerce").fillna(0)
    df["received_date"] = pd.to_datetime(df["received_date"], errors="coerce", dayfirst=False)
    before = len(df)
    df = df.drop_duplicates(subset="file_id", keep="first")
    print(f"rows: {before} -> {len(df)} after de-dup; unparsable dates: "
          f"{df['received_date'].isna().sum()}")
    return df

df = load_production("production_raw.csv")
summary = df[df.status == "DONE"].groupby("state")["files"].sum().sort_values(ascending=False)
print(summary.head())
```

Every choice is visible: uppercase normalisation, comma removal in numbers, coerced dates, de-duplication key, and a printed reconciliation line. In the write-up, list the anomalies you found ("312 duplicate file_ids, 18 dates in DD/MM format, 4 states with trailing spaces") and how you handled each.

### Report building: audience first

For the operations-manager report, structure the workbook like a professional deliverable: a `README` tab (source, refresh steps, assumptions), a `Data` tab loaded by Power Query, a `Summary` tab with the KPIs, and a `Detail` tab with a PivotTable. Add a reconciliation row that compares the summary totals to the raw row count. Then write one page of narrative.

```text
Weekly Production Summary — week ending 12 Sep 2026

Headline: 4,812 files delivered (+6% vs prior week), rework rate 2.4% (target < 3%).
1. Texas volume rose 14% on a backlog release; Team B absorbed it without a TAT miss.
2. Rework concentrated in CA scanned deeds (61% of rework items); recommend a stamp cheat
   sheet for the two newest agents.
3. 37 files on HOLD for more than 3 days are all missing images from the client; a list is
   on the Detail tab for escalation.
Data notes: 312 duplicates removed; 18 dates re-parsed from DD/MM; totals reconcile to source.
```

### Document automation: prove the QC, not just the output

For the 50-letter task, the script is the easy part. The differentiator is the checklist that shows you verified the output the way a client would.

```python
from docx import Document
import pandas as pd

rows = pd.read_excel("recipients.xlsx")
for _, r in rows.iterrows():
    doc = Document("letter_template.docx")
    for p in doc.paragraphs:
        for run in p.runs:
            run.text = run.text.replace("{{name}}", r["name"]).replace("{{policy_no}}", str(r["policy_no"]))
    doc.save(f"out/letter_{r['policy_no']}.docx")
print(len(rows), "letters generated")
```

Then the QC checklist: count of files equals row count; no `{{` remains in any output (grep or a python-docx scan); three random letters opened and compared to the sheet; fonts and header unchanged; PDF export tested on one file.

> **Warning:** Do not spend twelve hours on a "two to four hour" take-home. Interviewers notice, and it signals poor scoping. Deliver the core in the time given, list what you would do with more time, and stop.

### The write-up

Keep it to one page: what you were asked, what you assumed, what you found, what you built, how you validated it, what you would do next. Attach the script and the output. Name files clearly (`ali-raza-takehome-summary.pdf`, `clean_production.py`).

### Try It Yourself

```text
Take-home plan (fill in before you start; 2–4 hour budget)

Audience:       Operations manager (internal)
Decision:       Where to add QC attention next week
Constraints:    Excel + Python allowed; deliver as .xlsx + .py + one-page PDF
Assumptions:    Blank Files = 0; duplicates keep first; dates are MM/DD
Time plan:      0:00–0:20 read + clarify | 0:20–1:20 clean + validate
                1:20–2:30 build summary + narrative | 2:30–3:00 QC + package
Validation:     row counts before/after; totals reconcile; spot-check 5 rows
Next steps if more time: Power BI version, automated refresh, agent-level trend
```

### Quiz

1. What should you do before starting a take-home with an ambiguous brief?
- [ ] Guess and hope
- [x] Send one short email with specific questions and your default assumptions
- [ ] Refuse the task
> Clarifying like a professional is part of what is being assessed.

2. What do reviewers open first in a data-cleaning take-home?
- [x] The script or steps, to see how decisions were made
- [ ] The chart colours
- [ ] The file name
> Repeatability and visible decisions matter more than the output alone.

3. How long should you spend on a "2–4 hour" take-home?
- [ ] As long as it takes to make it perfect
- [x] Roughly the stated budget, listing what you would do with more time
- [ ] 30 minutes
> Over-investing signals poor scoping; under-investing signals low interest.

### Exercises

1. **Anomaly log** — Write the anomaly section of a write-up for a file with 312 duplicate IDs, 18 DD/MM dates, states with trailing spaces and 40 blank Files values.
<details><summary>Solution</summary>

"Anomalies found and handling: (1) 312 rows with duplicate file_id, kept the first occurrence, de-duplication key file_id; (2) 18 received_date values in DD/MM/YYYY format, re-parsed explicitly and flagged in a `date_fixed` column; (3) trailing spaces in state for 4 states, trimmed and upper-cased; (4) 40 blank Files values treated as 0 per assumption A1, listed on the Exceptions tab for confirmation. Totals after cleaning reconcile to the raw row count minus duplicates."

</details>

2. **Placeholder scan** — Write the Python that checks no `{{` remains in any generated letter.
<details><summary>Solution</summary>

```python
from pathlib import Path
from docx import Document

bad = []
for f in Path("out").glob("*.docx"):
    d = Document(f)
    text = "\n".join(p.text for p in d.paragraphs)
    text += "\n".join(c.text for t in d.tables for row in t.rows for c in row.cells)
    if "{{" in text:
        bad.append(f.name)
print("unfilled placeholders in:", bad or "none")
```

</details>

### Interview Questions

**Q: Walk us through how you approached the take-home.**
I started by writing down the audience, the decision the report supports and my assumptions, and I emailed two clarifying questions with the defaults I would use if I did not hear back. I then wrote a loading function that validates the expected columns, normalises state and status, coerces numbers and dates, de-duplicates on file_id and prints a reconciliation line, so every decision is visible in code. From the clean data I built a summary tab with the KPIs and a PivotTable for detail, added a reconciliation row against the raw counts, and wrote a one-page narrative with three findings and one recommendation. I stopped at about three and a half hours and listed what I would add with more time, such as an agent-level trend and a Power BI version.

**Q: What did you find in the data that we did not tell you about?**
Three things. About six percent of rows were exact duplicates on file_id, which would have inflated the delivered count if summed naively; I kept the first occurrence and reported the number removed. Eighteen dates were in day-first format, which pandas would have silently misread as months, so I parsed them explicitly and flagged them. And the HOLD items over three days were all the same client-side missing-image issue, which is an operational finding rather than a data one, so I put it in the narrative with the list on a separate tab for escalation.

**Q: How do you make sure a generated batch of documents is correct before delivery?**
I treat it like a QC sample on a production floor. First the mechanical checks: output file count equals input row count, a scan for any remaining placeholder tokens in paragraphs, tables and headers, and a check that fonts and styles match the template by comparing one output to the template in Word. Then a sample: I open three to five documents at random and compare every merged field to the source row. Finally I export one to PDF to confirm nothing shifts. On a 168-field fillable form I did the same with field names and tab order, which is how I caught a mis-mapped field before the client did.

## Portfolio walkthrough: presenting a document pipeline or dashboard

Many final rounds include ten to twenty minutes of "show us something you built". This is the single highest-leverage interview segment for someone with 400+ delivered projects, because you control the content. The mistake is to click through a finished artefact. The winning approach is to present the **problem, the decisions and the measured result**, using the artefact as evidence.

### Choose the right piece

Pick one project that matches the role, has a number attached, and can be shown without breaching client confidentiality (redact names and figures; keep structure).

| Role | Best piece | Number to lead with |
|---|---|---|
| Reporting analyst | Weekly production report or Power BI dashboard | Time saved per week, errors caught, adoption |
| Document automation | 767-page handbook pipeline or the .dotx template suite | Revision cycle, zero broken references, reuse count |
| Forms / PDF specialist | 168-field AcroForm with validation | Fields, first-pass acceptance, browsers tested |
| Operations lead | Daily queue snapshot and QC taxonomy | Target attainment, rework rate |

### The seven-minute structure

```text
0:00  Context (30 s):   who the client was, what they needed, what was broken.
0:30  Constraint (30 s): the hard part: size, deadline, tooling, quality bar.
1:00  Approach (2 min):  the 3–4 design decisions and why; show the artefact here.
3:00  Demo (2 min):      one live path through the pipeline or dashboard; not a tour.
5:00  Result (1 min):    the numbers, how measured, what the client said.
6:00  Lessons (1 min):   what you would change; where it could go next.
```

Seven minutes leaves time for questions, which is where the real evaluation happens.

### Example: the 767-page handbook pipeline

```text
Context:    An HR consultancy maintained a 767-page policy handbook in Word. Every edit
            broke the TOC and cross-references; a revision took three days.
Constraint: Must stay in Word (client edits it), must print correctly, must be finished
            in ten days.
Decisions:  1) Rebuilt on a .dotx with a locked style set (Heading 1–4, Body, Note, Table).
            2) All references become fields: TOC from headings, REF fields for
               cross-references, SEQ for figures and tables, so F9 regenerates everything.
            3) python-docx script to re-map 4,000+ direct-formatted paragraphs to styles
               by matching font/size/bold patterns, with a log of anything ambiguous.
            4) A QC pass: field-update, check for "Error! Reference source not found",
               PDF export, page-count and bookmark check with PyMuPDF.
Demo:       Open the file, insert a heading, update fields, show the TOC and a
            cross-reference adjust; run the QC script and show its output.
Result:     Revision cycle from ~3 days to ~2 hours; zero broken references at delivery;
            the client has since ordered two more manuals on the same template.
Lessons:    Next time I would build the style mapping as a configuration file instead of
            code so the client's team can extend it.
```

### Example: a Power BI production dashboard

Context: a weekly manual Excel summary took three hours. Decisions: star schema (a `Files` fact table, `Date`, `State`, `Agent` dimensions), DAX measures for delivered, rework rate, MTD and YTD, a scheduled refresh from the export folder. Demo: change the date slicer, drill from state to agent, open one measure to show the DAX. Result: Monday reporting from three hours to about ten minutes; two data-quality issues surfaced in the first month that the manual sheet had hidden. Lessons: add row-level security before sharing with client-side users.

```dax
Rework Rate =
DIVIDE(
    CALCULATE(COUNTROWS('Files'), 'Files'[Status] = "REWORK"),
    COUNTROWS('Files')
)
```

Showing one measure is enough; it proves you wrote the model rather than inherited it.

### Demo discipline

- Rehearse the exact click path three times. Nothing should be searched for live.
- Have the artefact open before the call, with a backup PDF or screenshot deck in case screen share fails.
- Zoom the screen (Ctrl and plus in a browser; View → Zoom in Word) so text is readable on a laptop.
- Narrate what the viewer is seeing: "This is the TOC regenerating; note the page numbers changing."
- Redact client names; say "a US HR consultancy" and "an insurance client".

> **Tip:** Interviewers remember decisions and numbers, not features. "I chose REF fields over hyperlinks because they survive PDF export and print" is memorable; "here is the table of contents" is not.

### Handling questions

Expect: "What would break this?" (a user applying direct formatting instead of styles; answered by the QC script and a style guide), "How long did it take?" (honest hours), "What did the client push back on?" (the upfront rebuild time), "Could you do it in Google Docs?" (partially; fields are weaker; you would move automation to Apps Script). Answer each with the same decision-and-trade-off shape.

### Try It Yourself

```text
Portfolio walkthrough script card

Project:      ______________________  Role fit: ______________
One number:   ______________________  (lead with it)
Context 30s:  ______________________
Constraint:   ______________________
Decision 1:   ______ because ______   (show: ______)
Decision 2:   ______ because ______   (show: ______)
Decision 3:   ______ because ______   (show: ______)
Demo path:    open ___ -> click ___ -> show ___ -> run ___
Result:       ______ measured by ______
Lesson:       ______________________
Backup:       PDF/screenshots at ______
```

### Quiz

1. What should a portfolio walkthrough lead with?
- [ ] A feature tour
- [x] The problem, a measurable result and the key decisions
- [ ] The client's name and logo
> Interviewers remember decisions and numbers; features are forgettable.

2. Why show one DAX measure or one script during the demo?
- [x] It proves you built the model rather than inherited it
- [ ] To fill time
- [ ] To show off syntax
> A single piece of real code is strong evidence of authorship.

3. What is the right response to "what would break this?"
- [ ] "Nothing"
- [x] Name a realistic failure mode and the safeguard you built
- [ ] Change the subject
> Knowing your own failure modes is a sign of production experience.

### Exercises

1. **Write your seven-minute script** — Fill the script card for the 168-field fillable form project.
<details><summary>Solution</summary>

Number: 168 fields, accepted first pass. Context: a US client's intake form was a flat PDF re-typed by staff. Constraint: must work in Acrobat Reader, macOS Preview and Chrome; must calculate totals. Decisions: consistent field naming (`section.field`), JavaScript calculation and validation on numeric fields, explicit tab order, required-field highlighting; tested in three viewers; exported a field map spreadsheet for the client. Demo: fill three fields, show a calculation update, tab through a section, show the field map. Result: accepted first pass; repeat client. Lesson: agree the field list in a spreadsheet before building.

</details>

2. **Redaction plan** — List what to hide and what to keep when showing a client dashboard.
<details><summary>Solution</summary>

Hide: client name and logo, real revenue and volume figures (scale them or use sample data), agent names (replace with Agent 01 to 20), any addresses or policy numbers. Keep: the model structure, the measures, the visual layout, the slicers and the refresh setup, because those demonstrate your work. State clearly "figures are scaled sample data" so the interviewer does not think the real numbers are trivial.

</details>

### Interview Questions

**Q: Show us something you are proud of and explain the decisions behind it.**
I will show the pipeline behind a 767-page policy handbook. The client's Word file broke its TOC and cross-references on every edit, so revisions took three days. The constraint was that it had to stay in Word because their team edits it. I made four decisions: rebuild on a .dotx with a locked style set; turn every reference into a field, TOC from headings, REF for cross-references and SEQ for figures, so a single field update regenerates everything; write a python-docx script to re-map thousands of direct-formatted paragraphs to styles with a log of ambiguous cases; and add a QC script that updates fields, scans for broken-reference errors and checks the exported PDF's page count and bookmarks with PyMuPDF. Revisions now take about two hours with zero broken references, and the client has ordered two more manuals on the same template.

**Q: What would you do differently on that project now?**
I would move the style-mapping rules out of the Python script into a configuration file the client's team could edit, because they later asked for two new paragraph types and had to come back to me. I would also add the QC script as a one-click macro in the template so the check runs before every send, rather than relying on me. Both are examples of the same lesson: the pipeline should be operable by the people who own the document, not only by the person who built it.

**Q: How do you present a dashboard to someone who has never seen Power BI?**
I start with the question the dashboard answers, for example "where should QC attention go next week", and show only the visual that answers it. Then I change one slicer so they see the numbers respond, and I drill once from state to agent so they see the hierarchy. I avoid the model view and DAX unless someone technical asks, in which case I show one measure such as the rework rate. The aim is that a manager leaves knowing which button to press on Monday, not how the star schema works.

## Analyst case interviews (KPI design, root-cause, estimation)

Case interviews for analyst roles present a business situation and ask you to think aloud. There is no hidden data set; the interviewer wants to see how you structure a problem, which numbers you ask for, and whether your recommendations follow from the analysis. Three formats dominate: **design the KPIs**, **find the root cause**, and **estimate a number**.

### Format 1: KPI design

**Prompt:** "You join a title-search operations team. Leadership has no dashboard. What would you put on it?"

Start with the purpose, then derive metrics from it, then define each one precisely. Vague metrics ("productivity") lose; defined ones win.

| KPI | Definition | Why it matters | Target / signal |
|---|---|---|---|
| Throughput | Files moved to DONE per day | Capacity and trend | Compare to received per day |
| Backlog | NEW + WIP + QC + REWORK at end of day | Work at risk | Should not grow week over week |
| TAT compliance | % of files delivered within SLA hours | The client promise | > 98% |
| Rework rate | REWORK / (DONE + REWORK) in the period | Quality | < 3% |
| First-pass accuracy | 1 − errors found in QC sample / items sampled | Quality before the client sees it | > 97% |
| Aging | Count of items older than 1, 2, 3 days by status | Early warning | Zero > 3 days |
| Utilisation | Productive hours / paid hours | Staffing | Watch, not maximise |

Then say how each is sourced (system status timestamps, QC log), how often it refreshes (daily), and what one leading indicator you would alert on (aging over two days). Close with what you would deliberately *not* show: raw agent rankings on a leadership dashboard, because they drive gaming rather than quality.

### Format 2: Root-cause analysis

**Prompt:** "Rework rate jumped from 2% to 6% last week. What do you do?"

Use a structure, and say it: **confirm the number, segment it, form hypotheses, test with data, recommend, verify**.

```text
1. Confirm: Is the metric definition unchanged? Did the QC sample rate or sampler change?
   (A new stricter QC checker can "cause" a rework spike without any real change.)
2. Segment: by document type, state, agent tenure, day of week, source batch.
   Ask: "Is the 6% spread evenly or concentrated?"
3. Hypotheses (from experience):
   a) New agents onboarded (tenure < 30 days) -> training gap
   b) A new document type or a client-side scan quality change -> misread stamps
   c) A process/tool change (new viewer, new template) -> systematic error
   d) Volume spike -> speed over accuracy
4. Test: cut rework by segment. If 80% of rework comes from CA scanned deeds handled by
   two agents with < 30 days tenure, hypotheses a and b are confirmed together.
5. Recommend: targeted coaching + a stamp cheat sheet + temporary 100% QC on that segment.
6. Verify: rework on the segment next week; total rate back under 3%.
```

This exact pattern happened at Systems Limited (story 2 in the story bank), which is why the hypotheses come with confidence. Say that: interviewers value "I have seen this" over theory.

### Format 3: Estimation

**Prompt:** "How many title-search files does a 20-agent team process in a month?"

State assumptions out loud, compute in round numbers, then sanity-check.

```text
Assumptions: 20 agents x 22 working days = 440 agent-days
             Average 45 files per agent-day for standard searches (range 30–60 depending
             on document type and QC load)
Estimate:    440 x 45 = 19,800 -> roughly 20,000 files per month
Adjustments: -5% for leave and training -> ~19,000
             If 2 agents are on QC full-time, capacity is 18 processing agents -> ~17,000
Sanity:      That is ~900 files per working day, about 45 per hour across the floor, which
             matches a queue of ~1,000 arriving overnight being cleared in a shift.
```

The number matters less than the structure and the sanity check. If asked "how would you find the real number?", answer: status timestamps in the workflow system, grouped by day and agent.

### Metric traps interviewers plant

- **Rate vs. count.** A rework rate can fall because throughput rose. Always show both.
- **Denominator changes.** TAT compliance looks better if HOLD items are excluded; say which you use and why.
- **Averages hiding tails.** Average TAT of 20 hours can coexist with 5% of files at 72 hours; report the 95th percentile.
- **Correlation stories.** Rework rose the week two new agents joined, but so did CA volume. Segment before you blame.

> **Interview note:** After any case, interviewers ask "what would you do first Monday morning?". Have a one-sentence action: "Pull last week's rework by document type and agent tenure and put the aging list in front of the team lead by 10 am."

### Try It Yourself

```text
Root-cause worksheet

Metric moved:      Rework rate 2% -> 6% (week 37)
Definition check:  Same formula? Same QC sampler? Same sample rate?   [ ] confirmed
Segments to cut:   doc type | state | agent tenure | batch/source | weekday
Hypotheses:        H1 new agents  H2 new doc type/scan quality  H3 tool change  H4 volume spike
Data needed:       QC log with reason codes; roster with start dates; batch manifest
Expected pattern if H1+H2: rework concentrated in one doc type AND agents < 30 days tenure
Recommendation:    targeted coaching + cheat sheet + 100% QC on segment for one week
Verification:      segment rework next week; overall rate < 3%
Monday action:     ________________________________________________
```

### Quiz

1. What is the first step when a KPI suddenly moves?
- [x] Confirm the definition, sample and measurement did not change
- [ ] Reassign agents immediately
- [ ] Report it to the client
> Many "spikes" are measurement changes; confirm before investigating causes.

2. Why report both rework rate and rework count?
- [ ] Interviewers like more numbers
- [x] A rate can fall purely because the denominator rose
- [ ] Counts are easier to compute
> Rates and counts together prevent misreading a volume change as a quality change.

3. What matters most in an estimation question?
- [ ] Getting the exact number
- [x] Stated assumptions, round-number arithmetic and a sanity check
- [ ] Speed
> Interviewers score structure and reasonableness, not precision.

### Exercises

1. **Design three KPIs** — For a document-production freelance business (templates, forms, ebooks), define three KPIs with formula, source and target.
<details><summary>Solution</summary>

On-time delivery rate = orders delivered before the agreed deadline / orders delivered, from the order log, target 98%. First-pass acceptance = orders accepted without a revision request / orders delivered, from the platform's revision data, target 90%. Hours per deliverable type = logged hours / orders, by type (template, form, ebook), from a time log; used to price and to spot which types need more automation.

</details>

2. **Estimate** — How many pages of documents does a freelancer producing 400 projects over five years deliver? State assumptions.
<details><summary>Solution</summary>

Assume 400 projects; 60% small (templates, forms, covers) at about 5 pages, 30% medium (SOPs, reports) at about 40 pages, 10% large (handbooks, ebooks) at about 300 pages. 240 × 5 = 1,200; 120 × 40 = 4,800; 40 × 300 = 12,000. Total about 18,000 pages, or roughly 3,600 pages per year. Sanity check: one 767-page handbook alone is 4% of the total, which seems plausible for the largest single job.

</details>

### Interview Questions

**Q: Our rework rate doubled last month. How would you investigate?**
First I would confirm the metric is comparable: same formula, same QC sample rate, same checkers, because a stricter new checker can double a rework rate with no real change. Then I would segment the rework by document type, state, agent tenure and source batch to see whether it is spread evenly or concentrated. From experience leading a QC function, the usual causes are new agents on a difficult document type or a change in scan quality from the client, and the data shows that quickly: at Systems Limited most rework traced to misread stamps on older scanned deeds handled by newer agents. I would recommend targeted coaching plus temporary full QC on that segment, then verify the segment's rework the following week and report both the rate and the count so a volume change does not mask the result.

**Q: What KPIs would you put on a one-page operations dashboard, and what would you leave off?**
Throughput per day against files received, end-of-day backlog by status, TAT compliance as a percentage with the 95th-percentile TAT beside it, rework rate with its count, first-pass accuracy from the QC sample, and an aging table of items older than one, two and three days. Each would be defined in a footnote with its source and refresh time so nobody argues about what a number means. I would leave off individual agent rankings, because on a leadership page they encourage speed over accuracy; that view belongs to the team lead with context. I would alert on aging over two days because it predicts TAT misses a day before they happen.

**Q: Estimate how many hours a week a 20-agent team spends on rework.**
Assume 20 agents process about 900 files a day, so roughly 4,500 a week. At a 3% rework rate that is about 135 items, and rework typically takes longer than first-pass work, say 20 minutes each including re-QC, which is 45 hours a week, or slightly more than one full-time agent. If the rate rises to 6%, that doubles to about 90 hours, which is why a rework spike is a capacity problem as well as a quality one. To get the actual figure I would use rework timestamps from the workflow system rather than the estimate.

## Whiteboard & live-coding etiquette

Live coding is less about code than about how you behave while writing it. The interviewer is asking: will this person be pleasant and clear to work with when a report is broken at 5 pm? The etiquette below applies to CoderPad, HackerRank, a shared Google Sheet or a physical whiteboard.

### The five-step loop

```text
1. Restate the problem in your own words and confirm.
2. Ask about inputs, edge cases and expected output ("duplicates? empty input? size?").
3. Outline the approach in two or three sentences before writing anything.
4. Write the simplest correct version, narrating decisions.
5. Test on one normal case and one edge case; then improve if time allows.
```

Skipping step 1 is the most common failure. Candidates hear "count files per state" and start typing before learning that duplicates exist and that the interviewer wants the top three only.

### Narrate, do not perform

Say what you are doing and why, in short sentences, while you type: "I will use a dictionary keyed by state so lookups are constant time." "I am handling the empty list first so the loop does not need a special case." Silence for more than twenty seconds makes interviewers uneasy; if you need to think, say "give me a moment to think about the ordering" and then think.

### Handling hints and mistakes

If the interviewer offers a hint, take it gracefully: "Good point, a set would be cleaner." If you notice your own bug, say so and fix it: "That will double count on duplicates; adding a seen set." Interviewers rate recovering from a mistake higher than never making one, because it shows how you will behave on a real bug.

### Writing readable code under pressure

- Meaningful names: `files_by_state`, not `d`.
- Small functions with one job; call them from a tiny main.
- Handle the obvious error early and return.
- Prefer built-ins (`Counter`, `sorted`, `groupby`) and say why: fewer bugs.
- Leave a one-line comment on any non-obvious decision.

```python
from collections import Counter

def top_states(rows, n=3):
    """rows: iterable of (file_id, state, status). Returns [(state, count)] for DONE files."""
    if not rows:
        return []
    seen = set()
    counts = Counter()
    for file_id, state, status in rows:
        if file_id in seen:          # duplicate export rows are common; count once
            continue
        seen.add(file_id)
        if status == "DONE":
            counts[state] += 1
    return counts.most_common(n)

print(top_states([("F1","TX","DONE"),("F1","TX","DONE"),("F2","CA","DONE")]))
# [('TX', 1), ('CA', 1)]
```

Then say the complexity: linear in the number of rows, memory proportional to unique file IDs; for an export of a few hundred thousand rows that is fine, and for a truly large file you would stream it.

### SQL on a whiteboard

Write the query top-down in the order the engine conceptually evaluates it: FROM and JOIN first, then WHERE, then GROUP BY, HAVING, SELECT, ORDER BY. Say the order; it prevents the classic mistake of filtering an aggregate in WHERE.

```sql
SELECT a.team, COUNT(f.file_id) AS done_files
FROM agents a
LEFT JOIN files f
       ON f.agent_id = a.agent_id
      AND f.status = 'DONE'
      AND f.received_date >= date('now', '-7 days')
GROUP BY a.team
HAVING COUNT(f.file_id) >= 1
ORDER BY done_files DESC;
```

If you cannot remember a function name, say so and describe it: "the SQLite date function that subtracts seven days; in SQL Server I would use DATEADD." That is what a colleague would do.

### Excel live tasks

Share your screen, say the target ("a table of files by state and status"), build it with a PivotTable in under two minutes, then add a formula version if asked. Use keyboard shortcuts you know (Ctrl+T for a table, Alt+N+V for PivotTable on Windows) but do not fumble for ones you do not. When a formula errors, read the error aloud (`#N/A` means no match; `#VALUE!` means a type problem) and fix it calmly.

### Whiteboard specifics

- Write large and leave space between lines for corrections.
- Draw the data shape first (a small table with three rows) before the code.
- Do not erase working code to write a better version; write the new version beside it.
- Face the interviewer when explaining, not the board.

> **Warning:** Never argue about a hint or defend a bug. "You are right, let me fix that" costs nothing; "well, it would work if the data were clean" costs the offer.

### Time management

Ask how long you have. Aim to have a working simple version at the halfway mark. If the clock is nearly out, say what you would do next rather than typing frantically: "With five more minutes I would add the date filter and a unit test for the duplicate case."

### Closing the exercise

Summarise in three sentences: what the solution does, its main limitation, and how you would productionise it (tests, logging, a config file). Then ask whether they would like to see any part differently. That closing turns a test into a design conversation.

### Try It Yourself

```python
# Practice drill: solve aloud in 15 minutes, then test both cases printed below.
# Task: given rows of (file_id, state, hours_to_complete), return the 95th-percentile
# hours per state, ignoring duplicate file_ids. Discuss edge cases before coding.
def p95_by_state(rows):
    seen, buckets = set(), {}
    for file_id, state, hours in rows:
        if file_id in seen:
            continue
        seen.add(file_id)
        buckets.setdefault(state, []).append(hours)
    result = {}
    for state, hours in buckets.items():
        hours.sort()
        idx = max(0, int(round(0.95 * len(hours))) - 1)
        result[state] = hours[idx]
    return result

print(p95_by_state([("F1","TX",10),("F2","TX",50),("F3","TX",12),("F3","TX",12),("F4","CA",30)]))
print(p95_by_state([]))
```

### Quiz

1. What should you do before writing any code in a live exercise?
- [x] Restate the problem and ask about edge cases and expected output
- [ ] Start typing immediately to save time
- [ ] Ask for the answer
> Clarifying prevents solving the wrong problem and shows how you work with colleagues.

2. How should you respond to a hint?
- [ ] Explain why your way is better
- [x] Accept it, thank them and apply it
- [ ] Ignore it
> Interviewers rate coachability highly; arguing costs more than the bug.

3. What is the right move when time is nearly up and the code is incomplete?
- [ ] Type as fast as possible
- [x] State clearly what you would do next and why
- [ ] Delete everything
> A clear plan for the remaining work is scored; frantic typing is not.

### Exercises

1. **Narration script** — Write the five sentences you would say before coding `top_states`.
<details><summary>Solution</summary>

"So the input is rows of file ID, state and status, and you want the top three states by completed files, correct? Can there be duplicate file IDs in the export, and should I count them once? Can the input be empty? I will de-duplicate with a set, count with a Counter keyed by state, and return `most_common(3)`. I will handle the empty case first and test with a duplicate row."

</details>

2. **Bug recovery** — Your query put `COUNT(*) > 50` in the WHERE clause and errored. Write what you say and the fix.
<details><summary>Solution</summary>

"Right, aggregates cannot be filtered in WHERE because it runs before grouping; that belongs in HAVING." Fix: move the condition to `HAVING COUNT(*) > 50` after `GROUP BY`. Then re-run and confirm the result set.

</details>

### Interview Questions

**Q: How do you approach a live coding problem?**
I restate the problem to confirm I understood it, then ask about the input shape, edge cases such as duplicates and empty input, and the exact output expected. I outline the approach in a sentence or two, write the simplest correct version while narrating the decisions, for example why I chose a set for de-duplication, and test it on a normal case and an edge case. If there is time I improve it and state the complexity. I treat hints as collaboration rather than criticism, because that is how I would work with the interviewer as a colleague when a report breaks.

**Q: Tell me about a time you made a mistake during a live demo or exercise.**
During a screen-shared Excel task I built a VLOOKUP that returned wrong rates because I had omitted the exact-match argument, and the interviewer noticed the numbers looked off. I said "that is approximate match on unsorted data; my mistake," added `FALSE`, and the values corrected. I then mentioned I normally use INDEX/MATCH or XLOOKUP precisely because they avoid that default, and showed the XLOOKUP version. The interviewer later said the recovery was the strongest part of the session, which taught me that calm ownership of a visible error is worth more than a flawless run.

**Q: What do you do if you cannot remember a function's exact name or syntax?**
I say what the function does and what I would call it in another tool, then write the logic around it and mark the line. For example, "I need the SQLite function that subtracts seven days from today; in SQL Server it is DATEADD; I will write `date('now', '-7 days')` and confirm." Interviewers are checking whether I know the concept and can find the detail, which is what I do daily with documentation. Pretending to remember and writing something wrong is worse than a marked placeholder that I fix on the next pass.

# LEVEL: Expert

## Salary negotiation (PKR vs USD remote, Fiverr rates → salary, benefits)

Negotiation is the highest-paid hour of any job search. A ten-minute conversation can move an offer by ten to twenty percent, and that difference compounds through every future raise. For a candidate in Lahore who can work locally in PKR, remotely in USD, or freelance, the first step is to know your numbers in all three currencies before anyone asks.

### Know your three markets

Figures below are indicative ranges to anchor your own research; verify current numbers on Rozee.pk, Glassdoor, LinkedIn Salary, Levels.fyi (for tech) and Upwork before any conversation, and check the live exchange rate (assume roughly PKR 280 per USD in these examples and adjust).

| Market | Role level | Indicative monthly range | Notes |
|---|---|---|---|
| Lahore, local employer | Reporting / data analyst, 3–7 yrs | PKR 150,000 – 350,000 | Plus medical, provident fund, sometimes fuel |
| Lahore, local employer | Senior analyst / automation specialist | PKR 300,000 – 600,000 | Software houses and banks at the top end |
| Remote, US/UK employer (contractor) | Analyst / automation specialist | USD 1,500 – 3,500 | No benefits; you pay your own tax |
| Remote via EOR (Deel, Remote.com) | Same roles | USD 1,800 – 4,000 | Some benefits, formal payslip |
| Upwork / Fiverr | Document automation, dashboards | USD 25 – 60 per hour | After platform fees of 10–20% |

The same skills are worth very different amounts depending on which market you sell them in. That is the leverage.

### Convert Fiverr earnings into a salary equivalent

Employers ask "what are you earning now?" and freelancers often undersell because they quote gross platform revenue or ignore unpaid time. Do the conversion once, honestly.

```text
Fiverr / Upwork -> salary equivalent (worked example)

Gross platform revenue (last 12 months)          USD 30,000
Less platform fees (Fiverr 20%, Upwork 10%)       -  USD 5,400  (blended)
Net revenue                                       USD 24,600
Hours billed and unbilled (admin, sales, revisions) 1,400 h
Effective hourly rate                             USD 17.6 / h
Equivalent full-time (2,000 h/yr)                 USD 35,200 / yr  ->  ~USD 2,900 / month
In PKR at 280                                     ~PKR 820,000 / month gross, before tax

But: freelance income has no paid leave, no medical, no notice period, no pipeline certainty.
A full-time remote offer at USD 2,500/month with 20 days leave and predictable hours can be
worth as much as USD 3,000+ of freelance revenue in practice.
```

Quote the equivalent salary, not the raw revenue, and say how you calculated it: "My freelance work nets the equivalent of about USD 2,900 a month full-time; I am targeting USD 2,500–3,000 for a role with continuity and benefits."

### The sequence of the money conversation

1. **Recruiter asks for expectations early.** Give a range whose bottom is your real target: "For a remote contractor role I am targeting USD 2,500 to 3,000 per month, depending on the full package." Do not say "flexible" or "as per company policy"; you will be anchored at the bottom of their band.
2. **Ask their band.** "So we do not waste each other's time, what range has been approved for this role?" Many recruiters answer.
3. **Never negotiate before a written offer.** Until the offer exists, you are being screened, not negotiated with.
4. **On receiving the offer:** thank them, ask for it in writing, ask for two to three days.
5. **Counter once, with reasons, on one or two items.** Base salary first; then one non-salary item.
6. **Get the final version in writing** before resigning anywhere or turning down other offers.

### The counter-offer script

```text
Subject: Re: Offer — Reporting Analyst

Hi Sara,
Thank you for the offer; I am genuinely excited about the team and the reporting work.
I would like to accept, and I want to raise one thing before I do.

The base is USD 2,200 per month. Based on the scope we discussed (owning the weekly and
monthly production reporting plus building the automation), the market range for a remote
analyst with title-insurance experience, and my current freelance equivalent of about
USD 2,900, I was hoping for USD 2,700. If you can get to USD 2,600, I am ready to sign today.

Everything else in the offer works for me. Thank you for considering it.
Best regards,
Ali Raza
```

Notice: one number, three reasons (scope, market, current equivalent), a clear closing condition, and warmth. This email has no threats and no ultimatum, which is why it works.

### Negotiating in PKR with a Lahore employer

Local negotiations are more relationship-driven and often verbal. The same rules apply, with local specifics:

- Ask whether the figure is gross or net of tax; ask about provident fund, medical (self only or family), annual increment timing and bonus history.
- Notice-period buyout: if the new employer wants you in two weeks and your notice is a month, ask them to pay the buyout.
- A remote-work or hybrid clause is negotiable and often worth more than PKR 20,000.
- Get the appointment letter with the agreed figure before you resign.

### Non-salary items worth asking for

| Item | Why it matters | How to ask |
|---|---|---|
| Overlap hours in writing | Protects your nights | "Can the contract state 6–11 pm PKT as the required overlap?" |
| Equipment stipend | A headset, second screen, UPS | "Is there a remote equipment allowance?" |
| Learning budget | Certifications (PL-300, SQL) | "Would a USD 500 annual learning budget be possible?" |
| Review at 6 months | Turns a lower start into a fast raise | "Can we put a compensation review at six months in the offer?" |
| Payment method and timing | Wise, Payoneer, bank; monthly vs bi-weekly | "How and when are contractors paid, and who covers transfer fees?" |
| Title | "Senior" on LinkedIn matters for the next job | "Would 'Senior Reporting Analyst' fit the scope?" |

> **Warning:** Do not accept verbally and then negotiate. Do not invent competing offers. Do not negotiate more than twice. Each of these can withdraw an offer, and recruiters talk.

### When they will not move

If the base is fixed, ask for the six-month review in writing, a title, or a learning budget, and accept graciously if the rest is right. Being the person who negotiated professionally and then committed fully is a reputation that pays at the next review.

### Try It Yourself

```text
Your numbers sheet (fill in before any recruiter call)

Freelance net (12 mo)  USD ______   Hours ______   Effective USD/h ______
Full-time equivalent   USD ______ / month   PKR ______ / month
Local market range     PKR ______ – ______ (source: ______, date ______)
Remote market range    USD ______ – ______ (source: ______, date ______)
Walk-away (minimum)    PKR ______   USD ______
Target                 PKR ______   USD ______
Range to state         "PKR ___ to ___" / "USD ___ to ___, depending on the package"
Non-salary asks (2)    1) ______________   2) ______________
```

### Quiz

1. When should you first negotiate an offer?
- [ ] During the recruiter screen
- [x] After receiving the written offer
- [ ] Only after starting
> Before the written offer you are still being screened; negotiate once the offer exists.

2. How should a freelancer state current earnings?
- [ ] Gross platform revenue
- [x] A full-time salary equivalent net of fees and unbilled hours, with the method
- [ ] Refuse to say
> Converting honestly avoids underselling and shows analytical thinking.

3. How many times should you counter?
- [ ] As many as needed
- [x] Once, or at most twice, with reasons
- [ ] Never
> Repeated counters damage trust and can lead to a withdrawn offer.

### Exercises

1. **Compute your equivalent** — Using net freelance revenue of USD 18,000 over 12 months and 1,100 total hours, compute the effective hourly rate and full-time monthly equivalent.
<details><summary>Solution</summary>

Effective rate = 18,000 / 1,100 = USD 16.36 per hour. Full-time equivalent = 16.36 × 2,000 = USD 32,700 per year, about USD 2,730 per month. State a target range of USD 2,500–3,000 and say the method if asked.

</details>

2. **Write a PKR counter** — Offer is PKR 220,000 gross; your target is 260,000. Write the two-sentence verbal counter.
<details><summary>Solution</summary>

"Thank you, I want to join, and I would like to ask for PKR 260,000, because the role includes owning the weekly reporting and building the automation, and that is in line with the market for that scope. If we can reach 250,000 with a review at six months, I can confirm today."

</details>

### Interview Questions

**Q: What are your salary expectations?**
For a remote contractor role I am targeting USD 2,500 to 3,000 per month depending on the full package, which is in line with the market for an analyst with title-insurance experience and roughly matches the full-time equivalent of my freelance work once platform fees and unbilled hours are removed. For a local role in Lahore the equivalent range is PKR 280,000 to 350,000 gross. I am open to discussing structure such as a six-month review, and it would help to know the range approved for this role so we can see quickly whether we are aligned.

**Q: You earn less on your current contract than you are asking. Why should we pay more?**
Because the scope here is larger and the market rate reflects that. My current contract covered maintaining existing reports; this role includes owning weekly and monthly reporting, building the automation and supporting rate-matrix changes across states, which is work I have done and can show. My ask is anchored on the market range for that scope and on my freelance equivalent, not on my last payslip. I would also be glad to structure it with a six-month review so you pay for delivered results rather than a promise.

**Q: Would you accept a lower base with a performance bonus?**
It depends on how the bonus is defined. If the metrics are within my control and measurable, for example reporting delivered on time, rework rate on my deliverables, and automation milestones, and the bonus history for the team is real, I am open to a base a little below my target with a bonus that takes the total above it. I would want the metrics and the payout schedule in writing, and a base that still covers my minimum. What I would avoid is a discretionary bonus with no defined criteria, because as an analyst I know that an undefined KPI is usually not paid.

## Offer evaluation & multiple offers

An offer is a data set, not a number. Two offers with the same headline salary can differ by thirty percent in real value once you count tax treatment, benefits, hours, currency risk and growth. This chapter gives you a scoring method, a decision timeline, and scripts for holding one offer while another finishes.

### Total compensation, not base

| Component | Local Lahore role (PKR) | Remote contractor (USD) | Remote via EOR |
|---|---|---|---|
| Base | Gross; tax deducted at source | Gross; you file and pay tax | Gross; tax often handled |
| Medical | Usually included (self, often family) | None | Sometimes |
| Provident fund / pension | Often 8–10% employer match | None | Rare |
| Paid leave | 14–25 days plus public holidays | Often unpaid | Usually paid |
| Notice / job security | 30 days typical | Often 14 days or none | 30 days typical |
| Equipment | Company laptop | Your own | Sometimes stipend |
| Currency risk | None | PKR depreciation helps you; USD-priced life costs do not | Same |
| Payment friction | None | Wise / Payoneer fees, 1–3% | Usually free |

A USD 2,200 contractor offer with no leave, no medical and fourteen days' notice may be worth less than a USD 1,900 EOR offer with twenty days' leave and medical. Do the arithmetic.

### A weighted scorecard

Score each offer on the criteria that matter to *you*. Weights must sum to 100. Fill in scores from 1 (poor) to 5 (excellent).

```text
Criterion                 Weight   Offer A (Lahore, PKR 320k)   Offer B (Remote, USD 2,400)
Total comp (12-mo value)    30            3                            5
Work content (automation)   20            4                            5
Hours / overlap             15            5 (day shift)                2 (7pm–1am PKT)
Growth / title / learning   15            3                            4
Stability / notice          10            5                            2
Manager quality             10            4                            4
Weighted score             100          3.85                          4.05
```

Offer B wins narrowly on paper, but the hours row is the one you will feel every night. When the scores are within 0.3, choose on the criterion that affects your daily life the most, and say so honestly to yourself.

### Red flags in an offer

- Salary in the offer letter differs from what was discussed.
- "Probation at a reduced salary" without a defined end date or criteria.
- No written overlap hours for a remote role.
- Contractor agreement with an IP clause claiming everything you create, including your Fiverr work. Ask for it to be limited to work done for them.
- Non-compete that would block freelance document work. Negotiate an exclusion for unrelated freelance.
- Unpaid "trial project" longer than a few hours.

### Holding one offer while another finishes

Timelines rarely line up. The script below is normal, and companies expect it.

```text
To the company that has offered (asking for time):

Hi Sara,
Thank you again for the offer; I am seriously considering it and it is my preferred
option on the work content. I am in a final stage elsewhere that concludes on Friday.
Could I have until Tuesday 29 September to give you a definite answer? I will not need
longer than that, and if anything changes sooner I will let you know immediately.
Best regards, Ali

To the company still interviewing (creating urgency, honestly):

Hi Daniel,
I want to be transparent: I have received an offer with a decision deadline of Tuesday.
Your role is my first choice because of the automation scope, so if there is any way to
complete the final stage before then, I would very much appreciate it.
Best regards, Ali
```

Do not invent a deadline that does not exist, and do not tell either company the other's number unless you are prepared for that number to become the ceiling.

### Declining gracefully

The person you decline today may hire you in two years. Two sentences, no reasons that criticise them.

```text
Hi Sara,
Thank you for the offer and for the time your team invested. After careful thought I have
decided to accept another role that is a closer fit for the direction I want to take, so I
must decline. I would be glad to stay in touch, and I hope our paths cross again.
Best regards, Ali
```

### Accepting properly

Reply in writing, restate the agreed terms (salary, currency, start date, overlap hours, title) so any mismatch surfaces now, sign the document, and only then resign or decline elsewhere. Ask for the onboarding plan and the name of your first-week contact.

> **Tip:** Keep a one-page "offer file" per company with the written offer, the emails, the scorecard and the dates. If a term is later disputed, you will have the evidence, which is exactly the habit that makes you a good analyst.

### Reneging

Backing out after signing burns the relationship and the recruiter's network. Do it only for a life-changing difference, do it immediately, by phone, with an apology and no excuses. Then never do it again.

### Try It Yourself

```text
Offer comparison sheet (12-month value, in one currency)

Item                      Offer A (PKR)        Offer B (USD -> PKR @280)
Base x 12                 3,840,000            8,064,000
Medical (est. value)        240,000                    0
Provident fund employer     384,000                    0
Paid leave (days x daily)   270,000                    0
Bonus (documented history)  320,000                    0
Less: tax estimate         -520,000             -900,000 (self-filed; verify)
Less: transfer fees               0             -160,000
Less: equipment/UPS/net           0             -150,000
Net 12-month value        4,534,000            6,854,000
Non-financial: hours, growth, stability -> score on the weighted card
```

### Quiz

1. Which comparison is correct for two offers?
- [ ] Base salary only
- [x] Twelve-month total value in one currency, plus a weighted non-financial score
- [ ] Whichever recruiter was friendlier
> Benefits, tax treatment, leave and fees change the real value materially.

2. What should you do when one offer's deadline arrives before another process finishes?
- [x] Ask the offering company for a short, specific extension and tell the other company honestly
- [ ] Accept and renege later
- [ ] Ignore the deadline
> Both companies expect this; honesty and specific dates keep trust.

3. What is the right order after deciding to accept?
- [ ] Resign first, then sign
- [x] Confirm terms in writing, sign, then resign or decline elsewhere
- [ ] Decline the other offers first
> Never give up a position or an offer before the accepted one is signed.

### Exercises

1. **Score two offers** — Build a weighted scorecard for a PKR 300,000 local role with day hours and a USD 2,000 contractor role with 7pm–1am PKT overlap. Decide.
<details><summary>Solution</summary>

Example weights: comp 30, content 20, hours 15, growth 15, stability 10, manager 10. Local: comp 3, content 3, hours 5, growth 3, stability 5, manager 4 = 3.7. Remote: comp 4, content 5, hours 2, growth 4, stability 2, manager 4 = 3.6. Effectively tied, so decide on the criterion you will feel daily: if night hours are sustainable for a year, take the remote role for content and USD; if not, take the local role and keep freelancing for USD exposure.

</details>

2. **Spot the clause** — A contractor agreement says "all work product created by Contractor during the term belongs to Company". Write the one-sentence change you would request.
<details><summary>Solution</summary>

"Could we limit the IP clause to work product created in the course of services performed for the Company, so that my unrelated freelance document work outside the agreed hours remains mine?" Most companies agree; those that refuse are telling you something.

</details>

### Interview Questions

**Q: You have another offer. Why should we believe you would choose us?**
Because the work content here is closer to what I want to do for the next several years: owning reporting end-to-end and building the automation, rather than maintaining existing reports. I have been transparent about the other offer and its timeline because I would rather you had the full picture than be surprised. What would make the decision straightforward is clarity on overlap hours and a six-month review; with those in writing, this is my first choice.

**Q: How do you evaluate an offer beyond the salary?**
I convert everything to a twelve-month value in one currency: base, medical, provident fund, paid leave, documented bonus history, minus tax treatment, transfer fees and equipment I must provide. Then I score the non-financial items with weights, especially working hours, because a remote role in US hours means 7 pm to 1 am in Lahore and that has to be sustainable. I also read the contract for IP and non-compete clauses that could affect my freelance work. Finally I look at the manager and the team's reporting maturity, because that determines whether I will be building things or firefighting.

**Q: If we cannot give you an answer by your other offer's deadline, what will you do?**
I will ask the other company for a short, specific extension, which they usually grant, and tell you exactly when my hard deadline is. If you genuinely cannot decide by then, I would have to accept the offer in hand, because I do not renege on signed agreements and I would not want to treat you that way either. I am telling you this early precisely so we can avoid that outcome if your process can be accelerated.

## Freelance-to-full-time & client interviews on Upwork/Fiverr

Freelancers interview constantly, just not in rooms. Every Upwork proposal is a cover letter, every Zoom call with a client is a hiring-manager interview, and every Fiverr brief is a job description. This chapter covers both directions: converting freelance experience into a full-time hire, and winning client interviews with the same discipline you use for employers.

### Translating freelance into employer language

Employers worry that freelancers are unreliable, allergic to process, or will leave for the next gig. Answer each worry before it is asked.

| Employer worry | Evidence that answers it |
|---|---|
| "Can they work in a team?" | Team lead of 20 agents; QC collaboration; client revisions handled with stakeholders |
| "Will they follow process?" | Delivered to 400+ briefs with platform rules, deadlines and revision limits |
| "Will they stay?" | "I want continuity so I can automate deeper"; a six-month review you asked for |
| "Can they handle ambiguity?" | Clarifying briefs is daily freelance work; show the clarification email |
| "Do they have real experience or just gigs?" | Named deliverables with numbers: 168 fields, 767 pages, dashboards in use |

Reframe the vocabulary on your resume: "orders" become "projects", "buyers" become "clients", "gigs" become "services", "revisions" become "iterations with stakeholder feedback". Group similar projects into one line with a count so the resume reads as a body of work, not a list of odd jobs.

```text
Before:  Did many Word and PDF gigs on Fiverr.
After:   Delivered 400+ document engineering projects for US, UK and EU clients (4.9+
         rating): fillable PDF forms (up to 168 AcroForm fields), branded Word template
         suites (.dotx), long-form manuals (up to 767 pages, automated TOC/index), EPUB3
         ebooks and Excel/Power BI dashboards; automated recurring work in Python.
```

### The Upwork client interview

Upwork clients typically read your proposal, shortlist three to five people and run a fifteen to thirty-minute video call. They are asking: do you understand my problem, can you start soon, and will you communicate?

```text
Upwork proposal structure (under 200 words, no template smell)

Line 1: Their problem in your words + the outcome they want.
  "You have a 300-page policy manual whose TOC and numbering break on every edit, and you
   need a version your HR team can maintain without calling a designer."
Line 2–4: How you would do it, with 2–3 concrete steps and a tool.
  "I would rebuild it on a styled .dotx template with field-based TOC and cross-references,
   migrate the content with a python-docx script so formatting is consistent, and hand over
   a one-page style guide. I did exactly this on a 767-page handbook last year."
Line 5: Proof + a question.
  "Portfolio sample attached. One question: does the manual need to remain in Word only, or
   should I also deliver a print PDF?"
Line 6: Availability and next step.
  "I can start Monday and deliver a first section within three days for your review."
```

On the call: restate the brief, ask the two questions that change the price (volume, format, deadline), propose milestones, and end with "shall I send a milestone plan today?" Clients hire the person who made the decision easy.

### Fiverr briefs and buyer requests

Fiverr conversations are shorter. Reply within an hour, ask one clarifying question, quote the package that fits, and state the delivery time. Use the platform's "custom offer" with the scope written as a numbered list; the list is your contract and your defence in a dispute.

```text
Custom offer scope (paste into the offer description)

1. Convert supplied DOCX (up to 120 pages) to a print-ready PDF/X-1a, A4, 3 mm bleed.
2. Apply the supplied style guide: fonts embedded, heading hierarchy, running headers.
3. Automated TOC (2 levels) and page numbers.
4. One round of revisions within 7 days of delivery.
Not included: copy editing, cover design, EPUB. Delivery: 3 days from receipt of final text.
```

### Converting a client into a full-time or retainer role

The best full-time offers freelancers get come from existing clients. Signals that a client is ready: repeat orders every month, requests for you to join their Slack, questions about your availability. Propose it yourself.

```text
Retainer proposal (message to a repeat client)

Hi Mark,
Over the last four months we have done seven projects together. Rather than quoting each
one, would a monthly arrangement work better for you? For USD 1,500 per month I would
cover up to 40 hours: template maintenance, the monthly report build, and ad-hoc document
fixes within 24 hours. Anything beyond that we would agree in advance. It gives you
priority turnaround and gives me predictable hours. Happy to trial it for two months.
Best regards, Ali
```

If the client wants full-time, move the relationship to a proper contract or an EOR platform and apply the offer-evaluation scorecard from the previous chapter. Note that Upwork's terms require paying a conversion fee or staying on-platform for two years after first contact unless the client pays the opt-out; factor that into the numbers and do not hide it from the client.

### Interviewing while freelancing

- Be honest about ongoing commitments: "I have two freelance deliveries in the next fortnight; from the start date I will be full-time."
- Ask whether limited freelance outside working hours is acceptable, and get the answer in writing.
- Keep the Fiverr profile live until the first month of full-time work is behind you; then set it to "out of office" rather than deleting 400 reviews of social proof.

> **Interview note:** The strongest freelance-to-full-time candidates present freelancing as a deliberate phase that built specific skills, not as what they did while looking for a job. "I chose freelance to learn scoping and automation across hundreds of clients; I now want depth in one team" is the sentence.

### Try It Yourself

```text
Client-call plan (15 minutes)

0:00 Restate the brief: "You need ___ by ___ so that ___."
2:00 Two price-changing questions: volume/size? format/platform? (and deadline)
5:00 Approach in three steps with one tool each; mention one relevant past project + number.
9:00 Milestones: M1 sample section (day 2), M2 full draft (day 5), M3 final + handover (day 7).
12:00 Risks: what I need from you (source files, style guide, sign-off person).
14:00 Close: "Shall I send the milestone plan and offer today?"
```

### Quiz

1. What is the employer's biggest hidden worry about a freelancer?
- [ ] Their typing speed
- [x] Reliability, teamwork and whether they will stay
- [ ] Their portfolio size
> Address stability, process and collaboration explicitly with evidence.

2. What should an Upwork proposal open with?
- [ ] "Dear Sir/Madam, I am an expert..."
- [x] The client's problem restated in your words
- [ ] A list of every skill you have
> Clients hire the person who understood the problem, not the longest skill list.

3. What turns a Fiverr custom offer into a defensible contract?
- [x] A numbered scope with exclusions and delivery time
- [ ] A low price
- [ ] A long chat history
> Written scope is what platform disputes are decided on.

### Exercises

1. **Rewrite a proposal** — A client posts: "Need 40 letters personalised from Excel, Word format, by Friday." Write a six-line proposal.
<details><summary>Solution</summary>

"You need 40 personalised letters generated from your Excel list in Word, delivered by Friday. I would set up your letter as a template with placeholders, generate the 40 files with a python-docx script so names, addresses and policy numbers map exactly, and run a check that no placeholder remains. I did the same for a 160-letter batch last month with zero corrections. One question: should each letter be a separate DOCX, one combined file, or both plus PDFs? I can start today and send three sample letters within two hours for your approval."

</details>

2. **Answer the stability question** — Write a three-sentence answer to "you have been freelance for years; why would you stay with us?"
<details><summary>Solution</summary>

"Freelance was a deliberate phase to learn scoping, delivery and automation across hundreds of clients, and I got what I wanted from it. What it cannot give me is the chance to own the same reports and templates for years and automate them deeply, which is the work I enjoy most. That is why I asked for a six-month review and clear overlap hours: I am planning to stay, and I want the conditions that make staying work for both of us."

</details>

### Interview Questions

**Q: You have been freelancing for years. How do we know you can work inside a team and a process?**
Before freelancing I led a twenty-agent data-processing team inside a BPO with SLAs, QC sampling and daily targets, so I have worked inside process at scale. Freelancing itself is process-heavy in a different way: more than four hundred briefs, each with platform rules, milestones and revision limits, delivered on time with public ratings. What I am looking for now is the team side that freelancing lacks, which is why I asked about your stand-ups and how reports are reviewed. I would rather join a team with strong process than build one from scratch again.

**Q: How do you handle a client who keeps expanding the scope?**
I stop and write the scope as a numbered list with what is in and what is out, price the difference, and offer a phased delivery so they can have the original scope on the original date. On a template project that grew from one letterhead to a six-document suite, that approach turned a tense chat into a decision the client could approve, and they left a five-star review. Inside a company I would do the same with a change request: document, estimate, get sign-off, then deliver. The habit is the same whether the stakeholder is a Fiverr buyer or an operations manager.

**Q: Would you continue freelancing if we hired you?**
I would keep my profile live but set to out of office during the first months, because four hundred reviews are professional proof I do not want to delete, and I would not take on client work during your hours or in your domain. If limited freelance outside working hours is acceptable to you, I would like that stated in the contract so there is no ambiguity; if it is not, I will respect that. My priority would be the role, and I am asking now so that neither of us is surprised later.

## Mock interview plans (30-day schedule)

Preparation without rehearsal is reading about swimming. A mock interview plan turns the material in this course into reflexes: the introduction that lands in ninety seconds, the story that surfaces in two seconds, the SQL join you write without thinking. This chapter is a 30-day schedule built for someone working full-time, with about one hour on weekdays and three hours on weekends.

### Principles

- **Spaced, not crammed.** Ten minutes daily on stories beats two hours on Sunday.
- **Recorded, then reviewed.** Every spoken answer is recorded on a phone and scored on the self-review sheet.
- **Mixed partners.** A friend for behavioural rounds, a peer with SQL for technical rounds, and an AI assistant or a mirror for daily reps.
- **Real materials.** Practise on your own production-report data, your own rate matrix, your own portfolio.

### The 30-day schedule

```text
WEEK 1 — Foundations (know your material)
Day 1   Parse 3 target JDs; build the requirement-to-evidence table; list gaps.
Day 2   Write the 90-second introduction (two variants); record; cut to 80–95 s.
Day 3   Align resume, LinkedIn, alirazaworks.com; fix numbers and dates.
Day 4   Write story cards 1–8 (STAR + tags + numbers).
Day 5   Write story cards 9–15; record stories 1–3 aloud.
Day 6   (Weekend) SQL: build the SQLite practice schema; write the four core patterns
        10 times each until automatic. Excel: PivotTable from raw export in < 3 min.
Day 7   (Weekend) Behavioural mock #1 with a friend: 6 questions, 40 min; review recording.

WEEK 2 — Technical depth
Day 8   Python: 5 data-shaping tasks in plain Python, narrated aloud.
Day 9   Same 5 tasks in pandas; explain the difference.
Day 10  Excel live drill: SUMIFS/XLOOKUP/Power Query on your rate matrix, screen recorded.
Day 11  SQL live drill: 5 questions with a peer on CoderPad or a shared SQLite; narrate.
Day 12  Write and rehearse the portfolio walkthrough (7-minute script card).
Day 13  (Weekend) Take-home simulation: 3-hour timed data-cleaning task; write-up.
Day 14  (Weekend) Technical mock #1: 45 min SQL + Excel with a peer; review.

WEEK 3 — Cases, communication, polish
Day 15  KPI design case: 20 min aloud; root-cause case: 20 min aloud; record.
Day 16  Estimation drills x3; practise stating assumptions.
Day 17  Questions to ask: 8 written, matched to interviewer types.
Day 18  Gaps / why leaving / freelance-to-full-time scripts; record; < 30 s each.
Day 19  Fluency session: re-record 5 answers; count fillers; target < 3.
Day 20  (Weekend) Full panel mock: intro + 4 behavioural + case + questions, 60 min.
Day 21  (Weekend) Review all recordings; list top 3 weaknesses; plan week 4 around them.

WEEK 4 — Simulation and negotiation
Day 22  Weakness drill #1 (e.g. window functions or story Results).
Day 23  Weakness drill #2 (e.g. pacing, upspeak).
Day 24  Salary numbers sheet; rehearse the expectation answer and the counter email.
Day 25  Offer scorecard practice with two hypothetical offers.
Day 26  Remote setup rehearsal: full tech check, failover drill, confirmation email.
Day 27  (Weekend) Full simulated loop: recruiter screen (20) + technical (45) + panel (45).
Day 28  (Weekend) Review; polish the introduction and portfolio one last time.
Day 29  Light day: read story cards, sleep well.
Day 30  Apply to the three parsed roles with tailored resumes and 4-line cover notes.
```

### How to run a mock so it is useful

Give the partner a script and a scorecard; otherwise the mock drifts into a chat. The scorecard mirrors what real interviewers use.

```text
Mock interviewer pack

Questions (pick 6): tell me about yourself | a time you led under pressure | a conflict |
a failure | a process you improved | why leaving | questions for me
Scorecard (1–4 each): Structure (STAR complete) | Specificity (numbers, tools) |
Communication (pace, signposting, fillers) | Relevance to role | Ownership ("I", not "we")
Probes to use: "What did you personally do?" "How do you know it worked?"
               "What would you do differently?"
Feedback format: 2 strengths, 2 fixes, 1 thing to try next time. 10 minutes, written.
```

### Using an AI assistant as a sparring partner

Paste a job description and ask it to act as the hiring manager, ask one question at a time, and probe each answer twice before moving on. Ask for a scorecard at the end. It is tireless, available at 1 am PKT, and good at spotting missing Results. It is worse than a human at judging tone, so keep the weekly human mock.

### Tracking progress

Keep a simple log: date, activity, minutes, one metric (fillers per minute, seconds for the introduction, SQL questions correct out of five), and one note. Progress is visible within ten days, which is motivating on the days you do not feel like recording yourself again.

| Metric | Day 2 | Day 12 | Day 22 | Target |
|---|---|---|---|---|
| Introduction length (s) | 140 | 96 | 88 | 80–95 |
| Fillers per 90 s | 11 | 5 | 2 | < 3 |
| SQL core patterns correct (of 4) | 2 | 4 | 4 | 4 |
| PivotTable build time (s) | 300 | 150 | 100 | < 180 |
| Stories retrievable in 2 s (of 15) | 4 | 11 | 15 | 15 |

> **Tip:** If you have less than 30 days, run days 1–5, 7, 11, 14, 20 and 24 in that order. That is the minimum viable plan: material, stories, one technical mock, one panel mock, numbers.

### After each real interview

Within an hour, write down every question asked, how you answered, and what you would change. Send the thank-you email the same day with one specific reference to the conversation. Add any new question to your bank. Real interviews are the best mocks; harvest them.

```text
Subject: Thank you — Reporting Analyst interview

Hi Daniel,
Thank you for the conversation today. I enjoyed the discussion about the Monday report
breaking when the export format changes; the Power Query column check with a reconciliation
row that I described is something I would be glad to sketch in more detail if useful.
I remain very interested in the role and look forward to the next step.
Best regards,
Ali Raza
```

### Try It Yourself

```text
Progress log (one line per session)

Date       Activity                     Min   Metric                  Note
2026-09-17 Intro recording x3            25   92 s, 4 fillers         Cut education line
2026-09-18 SQL core patterns             45   4/4 correct              HAVING now automatic
2026-09-19 Story cards 1–8               60   8 written               Story 6 needs a number
2026-09-20 Behavioural mock w/ Hamza     50   Structure 3, Specific 4  Results too vague on Q3
```

### Quiz

1. Why record every practice answer?
- [x] To count fillers, check length and hear structure objectively
- [ ] To share on social media
- [ ] It is not necessary
> Self-review from a recording is the fastest way to fix pacing and fillers.

2. What makes a mock interview useful rather than a chat?
- [ ] A long duration
- [x] A question script, a scorecard and structured written feedback
- [ ] A difficult partner
> Structure turns practice into measurable improvement.

3. What should you do within an hour after a real interview?
- [ ] Nothing until the result arrives
- [x] Log every question and answer, note fixes and send a specific thank-you email
- [ ] Call the recruiter for feedback
> Real interviews are the best practice material; capture them while fresh.

### Exercises

1. **Compress the plan** — You have ten days. List the days you would run and why.
<details><summary>Solution</summary>

Days 1, 2, 4, 5 (material and stories), 6 (SQL and Excel drills), 7 (behavioural mock), 11 (SQL live drill), 14 (technical mock), 20 (panel mock), 24 (numbers). This keeps one pass over material, two technical sessions, two human mocks and the salary preparation, which are the highest-yield items.

</details>

2. **Write a mock pack** — Create a six-question script and scorecard for a technical mock on SQL and Excel.
<details><summary>Solution</summary>

Questions: (1) files completed per state this month; (2) agents with more than 50 rework items; (3) latest file per agent; (4) running total by day; (5) Excel: SUMIFS by state and status from a raw export; (6) Excel: build a PivotTable and explain when Power Query would be better. Scorecard: correctness, narration, edge-case handling, recovery from errors, time management, each 1–4. Probes: "what if there are duplicates?", "what if an agent has no files?".

</details>

### Interview Questions

**Q: How did you prepare for this interview?**
I parsed the job description into a requirement-to-evidence table and found the two areas to strengthen, SQL window functions and the Tableau gap. I built a small SQLite database from my own production-report data and drilled the core query patterns until they were automatic, rebuilt one of my Power BI reports in Tableau Public, and prepared fifteen STAR stories from my team-lead, title-insurance and freelance work. I also ran two mock interviews with a peer, recorded them and fixed my pacing. I prepared this way because it is how I would prepare a report: know the requirement, find the gap, close it, test it.

**Q: What do you do after an interview does not go well?**
I write down every question and where the answer fell short within an hour, while it is fresh, and I add the weak questions to my practice bank. If a technical question exposed a gap, I close it that week and mention it in the thank-you email when appropriate: "I realised my answer on window functions was incomplete; the correct approach is ROW_NUMBER partitioned by agent." Interviewers rarely change a decision on that, but it has led to a second chance more than once, and either way the next interview benefits.

**Q: How do you keep improving at something you already do well?**
I measure it. For interviews I track the length of my introduction, fillers per ninety seconds and how many of my stories I can recall in two seconds, and I keep a log. The same habit applies at work: I timed my report assembly before and after automating it, and I track rework on my own deliverables. Measured practice with a specific weakness to fix each week beats general repetition, and it keeps me honest about whether I am actually improving or just comfortable.

## The 100 most common questions with model answers

This chapter is the reference you read the night before. Every question below appears constantly in analyst, operations and document-automation interviews. Each model answer is written the way a strong candidate would say it, using Ali's real history, and is short enough to adapt on the spot. Questions 1–95 are in the body, grouped by theme; the final five, with fuller answers, are in the Interview Questions section at the end.

Use the answers as patterns, not scripts. Swap in your own numbers, keep the structure, and never let an answer run past ninety seconds unless the interviewer asks for more.

### A. Opening and motivation (1–12)

**1. Tell me about yourself.**
Document Production and Automation Specialist and Reporting Analyst in Lahore; seven years across BPO operations (led a 20-agent data-processing team), US title-insurance production support (weekly status reports, rate calculators, state rate matrices) and 400+ freelance document and dashboard projects automated with Python. Finishing a BS in Software Engineering on top of a BS in Economics. Looking for a role where reporting, automation and domain knowledge all get used.

**2. Why do you want this job?**
The responsibilities read like my last two roles, weekly production reporting, rate matrices and validation, plus the automation line, which is where I add the most value. I also already know the title-insurance domain, so I would be useful in the first month rather than the third.

**3. Why do you want to work for us?**
Name two specific things: "Your team owns reporting for operations rather than just producing it, which means the automation I build would actually be used, and the interviewer mentioned the Monday report problem, which I have solved before."

**4. What do you know about our company?**
Give three facts from their site or news and one implication: "You underwrite in 40-plus states, you moved production support to a remote model last year, and you are hiring three analysts, which suggests reporting is being centralised; that is exactly the environment where a standard report framework pays off."

**5. Why are you leaving your current role?**
Towards, not away: "I want continuity, owning the same reports and templates over time so I can automate deeper. Freelance gave me breadth across four hundred clients; this role gives depth."

**6. Where do you see yourself in five years?**
"Owning the reporting and document-automation function for an operations group: the data model, the report suite and the pipeline that produces client-facing documents from it. I would like to be the person leadership trusts for the number and the document behind it."

**7. Why should we hire you?**
Three points: the domain (title insurance, BPO), the evidence (100 percent daily targets with 20 agents, zero corrections on weekly reports, 400+ five-star deliveries), and the specific match (automation of recurring reports and documents).

**8. What are you looking for in your next role?**
Ownership of reports end-to-end, permission to automate, a manager who measures results, and clear overlap hours for a remote arrangement.

**9. What motivates you?**
"Replacing a manual three-hour task with a ten-minute one and watching it run every Monday. The number going from three hours to ten minutes is my favourite kind of result."

**10. What do you know about this role?**
Restate the JD in your own words and add one question: "Weekly and monthly production reporting, rate matrix maintenance, validation and automation; my question is which of those is most on fire today."

**11. Why did you choose this career?**
"I started as a quality checker and found I cared more about why errors happened than about counting them. That led to error taxonomies, then to reporting, then to automating the documents and reports themselves."

**12. How did you hear about this position?**
Answer plainly, and add a hook: "Through a LinkedIn posting; I follow your operations director because of a post on report standardisation, which is a topic I work on."

### B. Experience and achievements (13–24)

**13. What is your greatest professional achievement?**
Leading a 20-agent team to consistent 100 percent daily target attainment on a title-search project while keeping the QC sample rate, measured from the daily status board, or, for a documents role, the 767-page handbook whose revision cycle went from three days to two hours.

**14. Describe your current responsibilities.**
"Scoping and delivering document and data projects for remote clients: fillable PDF forms, template suites, long manuals, Excel and Power BI dashboards; automating recurring work with Python; managing timelines and revisions with each client."

**15. What did you do at Systems Limited?**
"Quality checker, then team lead of a 20-agent data-processing team on a US title-search project: daily allocation, QC sampling, coaching, and the daily production report."

**16. What did you do at Stewart Title?**
"Production support: built the weekly status reports operations leadership used, maintained rate calculators and multi-state rate matrices, and validated data before every distribution."

**17. Which project are you proudest of and why?**
The 767-page handbook, because it combined diagnosis, document structure and Python automation and produced a measurable result the client still benefits from.

**18. Tell me about a time you exceeded expectations.**
The rework taxonomy: nobody asked for it, it reduced rework within a month and it became standard for the project.

**19. What is the largest data set you have worked with?**
Be honest and specific: production exports of tens of thousands of rows in Excel and pandas; a Power BI model with a fact table of a few hundred thousand rows. Then say how you would scale: push aggregation into SQL.

**20. Describe a report you built from scratch.**
Weekly production status report: data from system exports, reconciliation against source counts, KPIs by state and stage, variance column, one-paragraph narrative; zero corrections after distribution.

**21. What tools are you strongest in?**
Excel (lookups, PivotTables, Power Query), Word at the template and field level, Python for document and data automation (python-docx, PyMuPDF, openpyxl, pandas), Power BI with DAX, SQL at a solid intermediate level.

**22. What have you automated?**
Report assembly with openpyxl, bulk document generation with python-docx, PDF checks with PyMuPDF, TOC and cross-reference regeneration through Word fields, and a Power BI refresh that replaced a three-hour weekly summary.

**23. How many people have you managed?**
Twenty agents directly, plus coordinating with the QC pool and a peer team lead.

**24. What is something you learned recently?**
Name a real thing: window functions in SQL for running totals; docxtpl for Jinja-based templating; DAX time-intelligence functions such as TOTALYTD.

### C. Teamwork, conflict and leadership (25–40)

**25. Describe your leadership style.**
"Numbers plus coaching. Everyone knows the daily target and their own count; when someone is behind I sit with them to find the cause before I judge the person."

**26. Tell me about a time you led a team through a difficult period.**
Story 1: the three-day backlog cleared in two with error rate flat, using re-allocation by measured accuracy, two-hour checkpoints and a noon client update.

**27. How do you motivate people?**
Visible progress and fair credit: a status board updated every two hours, public recognition of QC output as well as processing counts, and a clear path from agent to QC to lead.

**28. How do you handle an underperformer?**
Observe first, find the cause (a slow viewer setting in one case), agree a short plan with daily numbers, escalate with evidence only if it fails.

**29. Tell me about a conflict with a coworker.**
Story 4: shared QC capacity resolved by a written rota proportional to queue size.

**30. Tell me about a disagreement with your manager.**
Phased target increase backed by QC data instead of a flat no.

**31. How do you handle criticism?**
"I ask for the specific example, fix it, and check back. When a client said my status emails were too long, I moved to three lines with the number and next step first and asked if that worked; it did."

**32. Describe a time you had to persuade someone.**
Convincing the fastest processors to take QC duty by explaining the client return risk and counting QC in their review.

**33. Do you prefer working alone or in a team?**
Both have a place: heads-down for report building and scripting, team for defining the KPIs and reviewing the numbers, which is where errors are caught.

**34. How do you build trust with a new team?**
Deliver something small and correct in the first week, publish how you validated it, and ask each person what breaks most often for them.

**35. Tell me about a time you helped a colleague.**
The stamp cheat sheet for a slower agent, which became onboarding material.

**36. How do you handle working with people in different time zones?**
Written updates that stand on their own, a fixed overlap window, and decisions captured in the ticket or email so nobody waits twelve hours for context.

**37. Have you ever had to deliver bad news to a client?**
The late EPUB3 delivery: told the client within the hour with a new ETA and the cause; kept the review at five stars.

**38. How do you give feedback?**
Specific, timely, with the data: "three of your ten sampled items had the stamp misread; here are the three, and here is the pattern."

**39. Describe your ideal manager.**
Sets clear targets, gives room to automate, and wants the honest number even when it is bad.

**40. How would your team describe you?**
"Calm under a backlog, fair about credit, and the one who asks 'how do we know?' before a number goes out."

### D. Failure, pressure and weaknesses (41–52)

**41. Tell me about a time you failed.**
Story 12, the late ebook; the process fix was adding epubcheck to the checklist.

**42. What is your greatest weakness?**
Over-validating; fixed by separating provisional from final deliveries.

**43. Tell me about a mistake you made and how you fixed it.**
The VLOOKUP approximate-match error caught in a live session; fixed on the spot and replaced with XLOOKUP as a standard.

**44. How do you handle pressure?**
Triage by impact, communicate early, automate the repeatable part. Story: the Monday with a leadership report and three deliveries.

**45. Describe a time you missed a deadline.**
Same ebook story, or say honestly that on production reports you have not, and explain the checkpoint system that prevents it.

**46. How do you prioritise when everything is urgent?**
Ask which item feeds someone else's deadline, do that first, negotiate the item with the most slack, and send a status before the day ends.

**47. What would you do if you found an error in a report already sent?**
Correct it immediately with a clear note on what changed and why, then add a check that would have caught it. Never quietly replace a file.

**48. Tell me about a time you had too much work.**
The backlog week; the answer is re-allocation and honest client communication, not overtime alone.

**49. How do you stay organised?**
A single task list with deadlines and effort, a progress log, and templates for the recurring work so nothing is rebuilt from scratch.

**50. What do you do when you disagree with a decision?**
Say so once with data, then commit fully if overruled, and revisit with results later.

**51. Tell me about a time you had to learn something quickly.**
Story 14, pikepdf repair delivered on the original deadline by prototyping on sample files first.

**52. How do you handle boredom or repetitive work?**
"I automate it. Repetition is a signal that a script or template is missing."

### E. Work style, remote and communication (53–64)

**53. How do you work remotely?**
Fixed overlap hours, written daily updates with a number and a next step, a UPS and a 4G backup, and decisions captured in writing.

**54. What hours can you work?**
State the overlap you can sustain: for US Central, 6 pm to 11 pm PKT, with daytime for heads-down work.

**55. How do you communicate progress?**
A short weekly status: done, in progress, blocked, next; plus an immediate message for anything at risk.

**56. How do you handle ambiguity in a request?**
Restate it, ask the two questions that change the outcome, state the default I will use if there is no answer, and proceed.

**57. Describe your process for a new task.**
Clarify, plan in steps, build the simplest correct version, validate against a source, deliver with a note on assumptions.

**58. How do you ensure accuracy?**
Reconciliation rows, before-and-after counts, spot checks on random samples, and a checklist per deliverable type.

**59. How do you explain technical things to non-technical people?**
Impact, cause, fix, in three sentences, with the detail available on request.

**60. How do you handle interruptions?**
Batch them: a question that can wait goes to the next check-in; a client-blocking one is handled immediately and logged.

**61. What software do you use daily?**
Excel, Word, Acrobat, VS Code with Python, Power BI Desktop, a SQLite or Postgres client, Git, and the client's communication stack.

**62. Are you comfortable on video calls with clients?**
Yes; four hundred-plus remote clients and US stakeholders. Tested setup, wired headset, camera at eye level.

**63. How do you document your work?**
A README tab in every workbook, docstrings in scripts, a one-page handover per project, and a change log for templates.

**64. What is your approach to deadlines?**
Set an internal deadline a day early for anything that feeds someone else; tell stakeholders as soon as a risk appears, not when it materialises.

### F. Technical and analytical (65–82)

**65. What is the difference between WHERE and HAVING?**
WHERE filters rows before grouping; HAVING filters groups after aggregation. Filtering an aggregate must use HAVING.

**66. Explain a LEFT JOIN with an example.**
Agents to files: a left join keeps agents with zero files; an inner join drops them and hides idle capacity.

**67. What is a window function?**
A calculation over a set of related rows without collapsing them, such as ROW_NUMBER for latest-per-agent or a running SUM OVER for cumulative throughput.

**68. How do you find duplicates in SQL?**
`SELECT file_id, COUNT(*) FROM files GROUP BY file_id HAVING COUNT(*) > 1`.

**69. VLOOKUP vs INDEX/MATCH vs XLOOKUP?**
VLOOKUP needs the key in the first column and defaults to approximate match; INDEX/MATCH looks in any direction; XLOOKUP does both with a built-in not-found value. I default to XLOOKUP where available.

**70. What is a PivotTable and when would you not use one?**
A drag-and-drop aggregation over a table. I avoid it when the report layout must not change shape or must feed other formulas; then SUMIFS on a fixed grid is safer.

**71. What is Power Query for?**
Repeatable import and cleaning: types, renames, unpivot, merges, recorded as steps and refreshed on each new export.

**72. Explain a star schema.**
A fact table (files, one row per event) surrounded by dimension tables (date, state, agent). It makes DAX measures simple and slicers consistent.

**73. What is DAX and give one measure.**
Power BI's formula language. `Rework Rate = DIVIDE(CALCULATE(COUNTROWS(Files), Files[Status]="REWORK"), COUNTROWS(Files))`.

**74. How do you clean a messy CSV in Python?**
Read as strings, validate expected columns, strip and normalise text, coerce numbers and dates with `errors="coerce"`, de-duplicate on a key, print before-and-after counts.

**75. List vs tuple vs set vs dict?**
List is ordered and mutable; tuple is ordered and immutable; set is unordered with unique members and fast membership tests; dict maps keys to values. I use a set for seen IDs and a Counter for counts.

**76. How do you replace text in a Word document without losing formatting?**
Work at the run level in python-docx or use docxtpl; naive `paragraph.text` assignment destroys run formatting.

**77. How do you generate a TOC that never breaks?**
Heading styles plus a TOC field; cross-references as REF fields; update fields before export; check for "Error! Reference source not found".

**78. How do you validate a fillable PDF form?**
Field naming convention, calculation order, tab order, required flags; test in Acrobat Reader, Preview and Chrome; export a field map to a spreadsheet and compare.

**79. What is PDF/X and why does it matter?**
A print-oriented subset of PDF that requires embedded fonts and defined colour and bleed; printers reject files that fail it.

**80. How would you design the KPI set for an operations team?**
Throughput, backlog by status, TAT compliance with a 95th percentile, rework rate with count, first-pass accuracy, aging; each defined with source and refresh.

**81. A KPI moved sharply. What is step one?**
Check whether the definition, sample or measurement changed before looking for a business cause.

**82. How do you estimate something with no data?**
State assumptions, compute with round numbers, sanity-check against a known figure, then say how you would get the real number.

### G. Domain: title insurance, documents and BPO (83–90)

**83. What is a title search?**
An examination of public records to establish ownership and find liens, easements and defects on a property before a title policy is issued; the data-processing project indexed and abstracted those records.

**84. What is a rate matrix?**
A table of premium rates by state, policy type and coverage band; my job was to keep it consistent with the underwriter's published manual and make it look-up-able for calculators.

**85. What is a rate calculator?**
A form-style workbook that takes coverage amount, state and policy type and returns the premium using the matrix, with explicit rounding rules and protected formulas.

**86. What is TAT and SLA?**
Turnaround time for a work item and the service agreement that promises it; the two numbers behind every production report.

**87. How do you QC processed records?**
Sample by risk (new agents, hard document types), log errors by category, feed the categories into coaching, track first-pass accuracy.

**88. What is the difference between DOCX, PDF and EPUB deliverables?**
DOCX for editable, template-driven content; PDF for fixed layout and print; EPUB3 for reflowable ebooks validated with epubcheck.

**89. What is an AcroForm?**
The standard PDF form technology: fields with names, types, appearance and optional JavaScript for calculation and validation; distinct from XFA, which many viewers do not support.

**90. What is a .dotx and why use one?**
A Word template file that carries styles, page setup and building blocks; every document created from it inherits the branding and structure, which is how a template suite stays consistent.

### H. Closing, logistics and salary (91–95)

**91. Do you have any questions for us?**
Three prepared: first 90 days, what breaks most in reporting, anything to clarify about my background.

**92. What is your notice period and start date?**
State both in one sentence, with the earliest realistic date.

**93. What are your salary expectations?**
A range with a reasoned bottom, in the right currency, and a request for the approved band.

**94. Are you interviewing elsewhere?**
"Yes, at a similar stage with one other company; this role is my preference because of the automation scope. I will keep you informed of any deadlines."

**95. Is there anything else you would like us to know?**
One thing not yet covered: "Only that I am finishing a Software Engineering degree in the evenings, which has fed directly into the automation work, and that I keep a UPS and 4G backup so remote reliability is not a concern."

> **Interview note:** If you can answer all 100 in under ninety seconds each, with a number in most of them, you are prepared for any panel this side of an executive round. The final five below are the ones interviewers ask when they are deciding between two strong candidates.

### Try It Yourself

```text
Rapid-fire drill (do 20 questions per session, 60 seconds each, recorded)

Session 1: A1–A12, B13–B20            Session 4: E53–E64, F65–F72
Session 2: B21–B24, C25–C40           Session 5: F73–F82, G83–G90
Session 3: D41–D52, H91–H95           Session 6: the 20 you found hardest

Score each: number included? (Y/N)  under 90 s? (Y/N)  fillers < 3? (Y/N)
Re-drill any question with two N's until it scores three Y's.
```

### Quiz

1. What is the best framing for "why are you leaving"?
- [x] Towards what the new role offers
- [ ] A list of problems with the old employer
- [ ] "Personal reasons"
> Interviewers hear criticism of a past employer as a preview of criticism of them.

2. When asked about a KPI that moved sharply, what is the first step?
- [ ] Reassign the team
- [x] Confirm the definition and measurement did not change
- [ ] Escalate to the client
> Measurement changes explain many apparent spikes.

3. How should salary expectations be stated?
- [ ] "Negotiable"
- [x] A range with a reasoned bottom and a request for the approved band
- [ ] A single exact number with no context
> A reasoned range anchors the conversation without closing it.

4. What makes an answer memorable to an interviewer?
- [ ] Length
- [x] A specific number and a decision you made
- [ ] Vocabulary
> Numbers and decisions are what get written on scorecards.

### Exercises

1. **Personalise twenty** — Rewrite answers 13–24 and 41–48 with your own most recent numbers and one new project.
<details><summary>Solution</summary>

Keep the structure of each answer and swap the evidence: replace the 767-page handbook with your most recent large deliverable, update the Fiverr count, add the latest automation (for example a report assembly script) and state the measured result for each. Read the rewritten set aloud and time it; any answer over ninety seconds loses one clause.

</details>

2. **Find your five hardest** — Run the rapid-fire drill once and list the five questions that scored worst. Write full STAR answers for them.
<details><summary>Solution</summary>

Most candidates find the hardest are 6 (five years), 30 (disagreement with manager), 41 (failure), 47 (error already sent) and 93 (salary). For each, write Situation, Task, Action, Result with a number, record it, and re-drill until it is under ninety seconds with fewer than three fillers.

</details>

3. **Domain check** — Without looking, define title search, rate matrix, TAT, AcroForm and .dotx in one sentence each.
<details><summary>Solution</summary>

Title search: examination of public records to establish ownership and find defects before a policy is issued. Rate matrix: premium rate table by state, policy type and coverage band. TAT: allowed time from receipt to delivery of a work item. AcroForm: standard PDF form fields with optional JavaScript. .dotx: a Word template carrying styles and page setup that new documents inherit.

</details>

### Interview Questions

**Q: What separates a good analyst from a great one?**
A good analyst produces the right number; a great one produces the right number, knows how it could be wrong, and makes the reader's next decision obvious. In practice that means reconciliation built into every report, a definition footnote for every KPI, both rate and count shown so volume changes do not masquerade as quality changes, and a narrative that says what to do on Monday. On the weekly production report I sent to a title-insurance operations team, the reconciliation row and the one-paragraph narrative were what turned it from a spreadsheet into the standard, and they took twenty minutes a week to maintain.

**Q: If you joined and found the reporting was a mess, what would your first 30, 60 and 90 days look like?**
In the first thirty days I would inventory every report: owner, audience, source, refresh, and how it is validated, and I would fix the two most painful breaks without changing anything else. By sixty days I would have the ingestion of the main exports in Power Query or a script with column checks and reconciliation rows, so the reports stop breaking on format changes. By ninety days I would propose a KPI dictionary, a single weekly report suite with defined metrics, and an automation plan with a measured baseline, for example hours per week currently spent assembling reports, so the value of the work is visible. I did the same sequence informally on the Stewart Title reports and on a freelance dashboard replacing a three-hour manual summary.

**Q: Tell me about a time a number you published turned out to be wrong.**
Early in the Stewart Title work a state count went out fourteen files high because an export had been appended instead of replaced, and I found it the next morning while preparing the following report. I sent a correction within the hour with a clear note on what changed and why, then added a reconciliation row comparing report totals to the source system that turns red on any difference. The correction itself cost some credibility for a week; the reconciliation row earned it back permanently because it caught two more issues before anyone downstream saw them. The lesson I carry is that a visible check is worth more than a perfect record.

**Q: How would you convince a sceptical operations manager to trust an automated report over their manual one?**
Run both in parallel for a month and publish the differences. I would keep their manual report as the reference, produce the automated version alongside it, and reconcile the two every week with a short note explaining any variance, most of which is usually errors in the manual process. Once the automated version has matched or corrected the manual one for four consecutive weeks, the manager has evidence rather than my assurance, and the switch is their decision. That is how I replaced a client's three-hour Excel summary with a Power BI dashboard; the parallel month surfaced two data-quality issues the manual version had been hiding, which did more to build trust than any demo.

**Q: Why should we choose you over a candidate with a stronger pure-data background?**
Because the reports you need are about operations and documents, and I have lived on both sides of that. I have been the team lead whose queue the report describes, the analyst who built the report and the engineer who automated the documents it drives, in the exact domain you work in. A pure-data candidate will need months to learn what a rework spike on scanned deeds means or why a rate matrix has to match a published manual to the cent; I already know, and I can still write the SQL and Python. Where their background is deeper, for example large-warehouse performance tuning, I would say so and learn it, as I have with every tool on my resume.

