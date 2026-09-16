---
id: sdlc
title: Software Engineering & SDLC
icon: 🔄
track: Computer Science
color: #2E4053
runner: none
tagline: How professional software is planned, built, tested and shipped.
description: Software engineering for the BS-SE final year and for interviews: SDLC models, requirements engineering, Agile/Scrum, UML, architecture and design, testing levels, code quality, CI/CD, DevOps basics, project estimation, risk, documentation and maintenance.
---

# LEVEL: Beginner

## What is software engineering

Software engineering is the disciplined application of engineering principles to the design, development, testing, deployment and maintenance of software. The IEEE definition (IEEE 610.12) says it is "the application of a systematic, disciplined, quantifiable approach to the development, operation, and maintenance of software". The key word is *systematic*: a hobbyist writes code until it seems to work; an engineer plans, measures, verifies and keeps evidence, because the software will be used by people who did not write it, changed by people who have never met the original author, and relied on for money, safety or legal compliance.

### Programming versus software engineering

| Programming | Software engineering |
|---|---|
| One person, one problem, one moment | Teams, changing requirements, years of life |
| "Does it run?" | "Does it meet the requirement, can it be verified, maintained, scaled?" |
| Code is the product | Code is one artefact among requirements, designs, tests, documentation, releases |
| Success is a passing demo | Success is measured: defects per KLOC, lead time, uptime, cost |

A rate calculator that one analyst wrote in Excel is programming. The same calculator rebuilt so that filed rate manuals are versioned, every formula has a test against the state's published examples, changes go through review, and a production report proves which version priced which policy: that is software engineering.

### The software crisis and why the discipline exists

The term was coined at the 1968 NATO conference in Garmisch, when projects were routinely late, over budget and unreliable as hardware got cheaper and programs got larger. Frederick Brooks' *The Mythical Man-Month* (1975) captured the central lesson: adding people to a late project makes it later, because communication paths grow as n(n-1)/2. Fifty years on, the Standish CHAOS reports still find that a large share of projects overrun or fail, and the causes are rarely technical: unclear requirements, poor estimation, changing scope and weak communication dominate.

### The layered view

Roger Pressman's textbook describes software engineering as four layers, each resting on the one below:

```text
                 Tools        (IDEs, Git, Jira, CI servers, test frameworks)
              Methods         (requirements analysis, design modelling, testing techniques)
           Process            (SDLC model: what activities, in what order, with what deliverables)
   A quality focus            (the bedrock: the organisation's commitment to quality)
```

Tools support methods, methods are organised by a process, and none of it matters without a genuine focus on quality. Interviewers who ask "what is software engineering" are happy to hear this picture.

### Attributes of good software

Software is judged on more than "it works". Ian Sommerville lists four essential attributes:

1. **Maintainability**: it can be evolved to meet changing needs; the code and documentation allow a new engineer to make a safe change.
2. **Dependability and security**: reliability, availability, safety and resistance to attack; a production report that is wrong 1% of the time is not dependable.
3. **Efficiency**: it does not waste memory, processor time or the user's time.
4. **Acceptability**: it is understandable, usable and compatible with the systems its users already have.

Note that maintainability comes first. Most of the cost of a system over its life is spent after the first release: Sommerville and others estimate 60–80% of total cost is maintenance and evolution.

### The activities every project performs

Whatever the process model, four fundamental activities happen:

```text
Specification   ──▶  what the software must do and its constraints
Development     ──▶  design and implementation
Validation      ──▶  checking it does what the customer wants (testing, review)
Evolution       ──▶  changing it as needs change
```

A one-week Fiverr job to build a fillable PDF form with 168 fields performs all four: the client's brief is the specification, the AcroForm build is development, the client testing each field on their machine is validation, and the revision round is evolution. Recognising the activities is the first step to doing them deliberately.

### Ethics and professional responsibility

The ACM/IEEE-CS Software Engineering Code of Ethics puts the public interest first, then the client and employer, then the product, judgement, management, profession, colleagues and self. Practical meaning: you do not ship a document generator that silently drops rows, you tell the client when their requirement conflicts with data-protection law, and you do not misrepresent progress in a status report. The Therac-25 radiation-therapy accidents (1985–87), the Ariane 5 explosion (1996, an unhandled integer overflow reused from Ariane 4 code) and the Boeing 737 MAX MCAS failures are the standard case studies of what happens when engineering rigour is skipped.

> **Interview note:** When asked "why software engineering and not just coding", answer with the cost-of-change curve: a requirements mistake found in review costs minutes, the same mistake found in production costs orders of magnitude more (Boehm's data suggested 50–200 times for large systems). Process exists to find mistakes early, not to slow you down.

### Try It Yourself

```text
Project charter: Title-insurance rate calculator v2

Specification : Price owner and loan policies for WY, OH, TX from filed rate manuals;
                match published examples to the cent; audit log per quote.
Development   : Python package + Excel front end; rates as versioned CSV.
Validation    : 120 golden-example tests (state-published), reviewer sign-off per state.
Evolution     : Quarterly rate-filing updates via pull request; semantic versioning.
Quality attrs : Maintainability (rates outside code), dependability (tests + audit log),
                efficiency (< 1 s per quote), acceptability (Excel UI the agents already use).
```

### Quiz

1. According to the IEEE definition, software engineering is which kind of approach?
- [ ] Creative and intuitive
- [x] Systematic, disciplined and quantifiable
- [ ] Hardware-focused
> The definition stresses repeatable process and measurement over individual heroics.

2. Which attribute of good software usually accounts for most lifetime cost?
- [ ] Efficiency
- [x] Maintainability (evolution after release)
- [ ] Acceptability
> Estimates put 60–80% of lifetime cost after first release.

3. What did Brooks' Law claim?
- [x] Adding people to a late project makes it later
- [ ] Doubling the team halves the schedule
- [ ] Requirements never change
> Communication overhead grows quadratically with team size.

4. In Pressman's layered model, what is the foundation?
- [ ] Tools
- [ ] Process
- [x] A quality focus
> Process, methods and tools all rest on an organisational commitment to quality.

### Exercises

1. **Classify the activity** — For each item, name the fundamental activity (specification, development, validation, evolution): writing the SRS; running UAT; adding a new state's rates a year later; coding the parser.
<details><summary>Solution</summary>

```text
Writing the SRS            → Specification
Running UAT                → Validation
Adding a state's rates     → Evolution
Coding the parser          → Development
```

</details>

2. **Programming or engineering?** — A one-off script converts one client's CSV to DOCX. Later four clients use it, each with different columns, and errors go unnoticed for weeks. List three practices that would move this from programming to engineering.
<details><summary>Solution</summary>

Version control with a change log; a configuration file per client instead of edited code; automated tests with sample inputs per client and a check that row counts match; logging and an error report emailed on failure; a short README describing how to add a client.

</details>

3. **Ethics case** — A client asks you to generate 500 "customer reviews" for their product page. Which principle of the ACM/IEEE code applies and what do you do?
<details><summary>Solution</summary>

Principle 1 (Public) and Principle 2 (Client and employer: do not knowingly deceive). Decline the fabricated content, explain the legal exposure (consumer-protection law) and offer a legitimate alternative such as a review-collection form.

</details>

### Interview Questions

**Q: What is the difference between software engineering and programming?**
Programming is writing code to solve a problem; software engineering is everything required to deliver software that meets a specified need, can be verified to meet it, and can be maintained by other people over years, within cost and schedule. That adds requirements, design, testing, configuration management, process, measurement and ethics. The distinction matters because most lifetime cost is maintenance and most failures are requirement or communication failures, not coding failures. My rate-calculator project illustrates it: the Excel formulas were the programming; putting rates under version control with golden tests and a review step was the engineering that made it trustworthy for production.

**Q: Why do software projects fail?**
Rarely because of technology. The recurring causes in CHAOS reports and post-mortems are incomplete or changing requirements, unrealistic estimates and schedules, lack of user involvement, poor communication, and weak risk management; Brooks' Law adds that throwing people at lateness backfires. Engineering process counters each: requirements elicitation and reviews, evidence-based estimation with ranges, iterative delivery so users see software early, and a risk register reviewed each iteration. On a document-automation project the classic failure is discovering at hand-over that the client meant a different template; a one-page prototype in week one would have exposed it.

**Q: What makes software "good"?**
Beyond correctness, Sommerville's attributes: maintainable, dependable and secure, efficient and acceptable to users. These conflict, so engineering is choosing trade-offs: a highly optimised report generator may be less maintainable; a very secure system may be less usable. Quality attributes must be stated as requirements with measures (response under one second, 99.9% availability, a new developer can add a state in under a day) so they can be tested rather than hoped for. The attribute I weight most is maintainability, because software lives long and every other attribute must be preserved through change.

## SDLC phases

The **Software Development Life Cycle** is the sequence of phases a software product passes through from idea to retirement. Every process model, from Waterfall to Scrum, is a different arrangement of the same phases; what varies is whether they run once in sequence or repeat in short cycles. Learning the phases and their deliverables lets you read any project plan and know what is missing.

### The phases and their outputs

| Phase | Core question | Typical deliverables |
|---|---|---|
| 1. Planning / feasibility | Should we build this, and can we? | Business case, feasibility study, project charter, rough estimate |
| 2. Requirements analysis | What must it do? | SRS, use cases or user stories, acceptance criteria, prioritised backlog |
| 3. Design | How will it be built? | Architecture document, data model, UI mock-ups, interface specs |
| 4. Implementation | Build it | Source code in version control, unit tests, build scripts |
| 5. Testing | Does it meet requirements? | Test plan, test cases, defect reports, test summary |
| 6. Deployment | Deliver it to users | Release notes, deployment runbook, training material |
| 7. Maintenance | Keep it useful | Change requests, patches, updated documentation, retirement plan |

### Planning and feasibility

Feasibility is examined from four angles, often abbreviated TELOS: **Technical** (can we build it with available skills and platforms?), **Economic** (does the benefit exceed cost; what is the ROI or payback period?), **Legal** (data protection, licensing, regulatory), **Operational** (will users adopt it; does it fit existing workflow?) and **Schedule** (can it be done in time?). The output is a go/no-go decision and a charter naming the sponsor, scope, constraints and success criteria.

### Requirements analysis

Stakeholders are identified and their needs elicited through interviews, workshops, observation, document analysis and prototypes. Requirements are analysed for conflicts, prioritised (MoSCoW: Must, Should, Could, Won't) and written into a **Software Requirements Specification** that is reviewed and signed off. The next two chapters go deep on this because requirement defects are the most expensive kind.

### Design

High-level (architectural) design chooses the structure: components, their responsibilities and how they communicate, plus technology and deployment. Low-level (detailed) design specifies modules, classes, database schemas, interfaces and algorithms. UML diagrams, entity-relationship diagrams and wireframes are the usual notation. Design is where quality attributes are won or lost: a report system that must handle 10 000 policies a night is designed differently from one that handles 50.

### Implementation

Developers write code following the design and agreed coding standards, commit to version control in small increments, write unit tests and go through code review. Modern practice merges implementation with continuous integration so that every commit is built and tested automatically.

### Testing

Testing verifies the software against requirements at multiple levels: unit, integration, system and acceptance. The test plan is written during requirements and design, not after coding, so that every requirement has a test that proves it. Defects are logged, prioritised, fixed and re-tested. Exit criteria (for example zero open critical defects, 95% requirement coverage) decide when testing is done.

### Deployment

The software is packaged, installed in production and handed to users with documentation and training. Deployment strategies range from a single big-bang cutover to phased roll-outs, pilot groups, blue-green switches and canary releases. A rollback plan is mandatory.

### Maintenance

After release, the software is corrected, adapted and enhanced. ISO/IEC 14764 names four types: **corrective** (fix defects), **adaptive** (new OS, new regulation, new rate filing), **perfective** (improve performance or usability), **preventive** (refactor to avoid future problems). Maintenance runs until retirement, when data is migrated and the system is decommissioned.

### Where the effort goes

```text
Typical effort distribution for a traditional project (development only):
  Requirements   10–15%
  Design         15–20%
  Coding         20–30%
  Testing        30–40%
  Deployment      5%
Then maintenance over the product's life: 2–4× the original development cost.
```

Beginners are surprised that coding is a minority of effort and that testing often exceeds it. Professionals plan for it.

> **Tip:** Every phase has an entry criterion (what must exist before it starts) and an exit criterion (what must be true before it ends). Writing those two lines per phase is the fastest way to turn a vague plan into a checkable one, and it is exactly what a BPO quality checker does when auditing a process.

### Try It Yourself

```text
Phase plan: SOP library web app for a 20-agent data-processing team

1 Planning      entry: request from ops manager     exit: charter signed, budget 3 weeks
2 Requirements  entry: charter                       exit: SRS v1.0 reviewed by team lead + 2 agents
3 Design        entry: SRS approved                  exit: architecture doc, DB schema, 6 wireframes
4 Implementation entry: design approved              exit: all stories merged, unit tests green
5 Testing       entry: build in staging              exit: 0 critical defects, UAT sign-off by QA lead
6 Deployment    entry: UAT sign-off                  exit: live, runbook + training done
7 Maintenance   entry: go-live                       exit: retirement or replacement
```

### Quiz

1. Which phase produces the SRS?
- [ ] Design
- [x] Requirements analysis
- [ ] Testing
> The Software Requirements Specification is the signed-off output of requirements work.

2. Which phase typically consumes the largest share of development effort?
- [ ] Coding
- [x] Testing
- [ ] Deployment
> Testing commonly takes 30–40%, more than coding, on traditional projects.

3. Updating a rate calculator because a state filed new rates is which maintenance type?
- [ ] Corrective
- [x] Adaptive
- [ ] Preventive
> Adaptive maintenance responds to changes in the environment, including regulations.

4. What does the "L" in TELOS feasibility stand for?
- [ ] Logistical
- [x] Legal
- [ ] Logical
> Technical, Economic, Legal, Operational, Schedule.

### Exercises

1. **Map deliverables** — For a "fillable PDF onboarding form" project, name one deliverable per SDLC phase.
<details><summary>Solution</summary>

```text
Planning       : one-page proposal with price and 5-day schedule
Requirements   : field list (168 fields, types, validation rules), sample data
Design         : page layout mock-up, field naming convention, tab order plan
Implementation : AcroForm built in Acrobat/pdf-lib, JavaScript validation
Testing        : test with Acrobat Reader, Preview, Chrome; every field filled and exported
Deployment     : final PDF, filling guide, hand-over email
Maintenance    : revision round; version 1.1 when HR adds a field
```

</details>

2. **Classify maintenance** — Label each: fixing a crash on empty CSV; migrating from Python 3.8 to 3.12; adding caching to halve report time; splitting a 2000-line module before adding features.
<details><summary>Solution</summary>

Corrective; adaptive; perfective; preventive.

</details>

3. **Feasibility** — Write two sentences each on economic and operational feasibility for replacing weekly manual Excel status reports with an automated Power BI dashboard.
<details><summary>Solution</summary>

Economic: the analyst spends about 6 hours a week on the manual report, roughly 300 hours a year; a 60-hour build pays back within three months even before counting fewer errors. Operational: managers already open SharePoint daily, so a dashboard link fits the workflow, but the two regional leads without Power BI Pro licences need either licences or a scheduled PDF export.

</details>

### Interview Questions

**Q: Walk me through the phases of the SDLC and what each produces.**
Planning establishes feasibility and produces a charter and business case; requirements analysis elicits and documents what the system must do in an SRS or a backlog with acceptance criteria; design decides the architecture, data model and interfaces; implementation turns design into reviewed, version-controlled code with unit tests; testing verifies the build against requirements at unit, integration, system and acceptance levels; deployment releases it with runbooks and training; and maintenance corrects, adapts and improves it until retirement. In Agile the same phases repeat in every sprint at small scale rather than once in sequence. I always add that testing planning starts in the requirements phase, because a requirement that cannot be tested is not finished.

**Q: Why is maintenance so expensive, and how do you reduce its cost?**
Because software lives for years, and every fix or enhancement must be made by people who did not write the original, under time pressure, against code that has accumulated shortcuts. Reducing it starts in earlier phases: clear requirements with rationale, a modular design so changes are local, coding standards and reviews, automated tests that make change safe, and documentation that explains why decisions were made. Version control history and a change log matter too. On my rate-calculator work, keeping rates in data files rather than in code turned a quarterly regulatory update from a code change into a reviewed data change, which is the kind of design choice that cuts maintenance cost for years.

**Q: What is the difference between verification and validation?**
Verification asks "are we building the product right?": does each phase's output conform to the previous phase's specification, checked by reviews, inspections and tests against the SRS. Validation asks "are we building the right product?": does the software actually meet the user's real need, checked by acceptance testing, demos and user feedback. A rate calculator can pass every test derived from the SRS (verified) and still be rejected because the SRS misunderstood how agents quote simultaneous-issue policies (not validated). Iterative delivery exists largely to get validation feedback early.

## Waterfall vs iterative vs Agile

A **process model** decides how the SDLC phases are arranged in time. The three families you must be able to compare are the sequential **Waterfall**, the **iterative and incremental** models such as Spiral and RUP, and **Agile** methods such as Scrum and XP. Exams ask for definitions and diagrams; interviewers ask which you would choose for a given project and why.

### Waterfall

Winston Royce described the sequential model in 1970 (and, ironically, argued it was risky without iteration). Each phase completes and is signed off before the next begins, with documents as the hand-off.

```text
Requirements ──▶ Design ──▶ Implementation ──▶ Testing ──▶ Deployment ──▶ Maintenance
```

Strengths: simple to manage, clear milestones and documentation, suits fixed-price contracts and regulated domains where the requirements genuinely are stable and known (a payroll rule set, a printed handbook whose content is signed off before layout). Weaknesses: working software appears only at the end, so validation is late; changes are expensive because they ripple back through signed-off documents; testing is compressed at the end when the schedule has already slipped. The **V-model** is Waterfall drawn as a V, pairing each development phase on the left with a test level on the right (requirements with acceptance tests, design with integration tests, code with unit tests) to emphasise that tests are planned early.

### Iterative and incremental

**Incremental** delivery builds the system in slices, each adding usable functionality. **Iterative** development revisits and refines work in repeated cycles. Most modern models are both.

- **Prototyping**: build a throwaway or evolutionary prototype to clarify requirements before committing.
- **Spiral** (Boehm, 1986): repeated loops of objective setting, **risk analysis**, development and planning; each loop grows the system and retires the biggest risk first. Heavy but explicit about risk; used for large, high-stakes systems.
- **RUP** (Rational Unified Process): four phases (Inception, Elaboration, Construction, Transition), each containing iterations across all disciplines; use-case driven and architecture-centric.

```text
Iteration 1: [req → design → build → test]  ──▶ increment 1 (owner policies, WY)
Iteration 2: [req → design → build → test]  ──▶ increment 2 (+ loan policies)
Iteration 3: [req → design → build → test]  ──▶ increment 3 (+ OH, TX, audit log)
```

### Agile

The 2001 **Agile Manifesto** values individuals and interactions over processes and tools, working software over comprehensive documentation, customer collaboration over contract negotiation, and responding to change over following a plan, while noting the items on the right still have value. Its twelve principles include delivering working software frequently (weeks, not months), welcoming changing requirements, daily collaboration between business and developers, and reflecting regularly on how to become more effective. Agile is a family: **Scrum** (roles, sprints, ceremonies), **Extreme Programming** (pair programming, TDD, continuous integration, refactoring), **Kanban** (flow, WIP limits), **Lean** and **Crystal**. Agile is iterative and incremental with very short cycles, empirical process control, and a strong emphasis on people and feedback.

### Comparison

| Aspect | Waterfall | Iterative (Spiral/RUP) | Agile (Scrum/XP) |
|---|---|---|---|
| Requirements | Fixed up front | Refined each loop | Emergent, reprioritised each sprint |
| Working software | At the end | Each iteration (weeks to months) | Every sprint (1–4 weeks) or continuously |
| Change | Expensive, via change control | Planned into loops | Expected and cheap |
| Documentation | Heavy, contractual | Moderate | Just enough, living |
| Customer involvement | Start and end | Milestone reviews | Continuous |
| Risk handling | Late discovery | Explicit (Spiral) | Early feedback, small batches |
| Best fit | Stable, regulated, fixed-price | Large, risky, long | Uncertain, evolving, product teams |
| Weakness | Late validation | Overhead, needs expertise | Needs engaged customer, hard at scale, weak for fixed contracts |

### Choosing a model

Ask: how well understood are the requirements? How costly is a late change? How available is the customer? Is there a regulatory need for phase-gate documentation? How large and distributed is the team? A three-day Fiverr deliverable with a precise brief is effectively Waterfall with one revision round. A new internal reporting product with an engaged manager and unclear scope should be Agile with two-week increments. A safety-critical medical device will follow a V-model with Agile practices inside each phase, which is common in regulated industries and is called a **hybrid**.

> **Warning:** "We do Agile" often means "we have no plan and daily stand-ups". Agile still requires a prioritised backlog, definitions of done, estimation, testing discipline and regular delivery. The manifesto trades heavyweight documents for working software, not for chaos.

### Water-Scrum-Fall and hybrids

Many organisations plan and budget in a Waterfall style, develop in Scrum sprints, and release through a controlled operations gate. Forrester called this Water-Scrum-Fall. It is not a failure; it is what happens when Agile teams sit inside finance and compliance structures. The skill is to keep feedback loops short where uncertainty is highest, and to keep the gates where the law or the contract demands them.

### Try It Yourself

```text
Model selection matrix (score 1–5, higher favours Agile)

Criterion                          Fiverr PDF form   Internal BI product   Payroll rules engine
Requirements uncertainty                 1                  5                      2
Cost of late change                      2                  4                      5
Customer availability                    2                  5                      3
Regulatory documentation need            1                  2                      5
Team size / distribution                 1                  3                      4
Recommendation                     Waterfall+1 rev     Scrum, 2-wk sprints    V-model with Agile inside
```

### Quiz

1. In the V-model, which test level pairs with the requirements phase?
- [ ] Unit testing
- [ ] Integration testing
- [x] Acceptance testing
> Each left-side phase defines the tests on the matching right-side level.

2. What distinguishes the Spiral model?
- [ ] No documentation
- [x] Explicit risk analysis in every loop
- [ ] Fixed two-week sprints
> Boehm's model retires the biggest risk first in each cycle.

3. Which is NOT one of the four Agile Manifesto value pairs?
- [ ] Working software over comprehensive documentation
- [x] Speed over quality
- [ ] Responding to change over following a plan
> The manifesto never trades away quality; XP in particular is built on testing discipline.

4. When is Waterfall a reasonable choice?
- [x] Stable, well-understood requirements with contractual sign-off needs
- [ ] When the customer is unavailable
- [ ] When requirements are expected to change weekly
> Late validation is tolerable only when requirements are genuinely stable.

### Exercises

1. **Draw the V** — List the pairs of development phase and test level in the V-model.
<details><summary>Solution</summary>

```text
Requirements / Business needs  ◀──▶  Acceptance testing (UAT)
System specification           ◀──▶  System testing
Architectural design           ◀──▶  Integration testing
Detailed / module design       ◀──▶  Unit testing
                 Coding (bottom of the V)
```

</details>

2. **Recommend and justify** — A BPO client wants a QA scoring tool for 20 agents but cannot say what the scoring rules are yet. Recommend a model in three sentences.
<details><summary>Solution</summary>

Scrum with one-week sprints: rules are unknown, so a working scorecard after week one lets the QA lead react to real scores rather than speculate. The backlog starts with the five most common error types and grows as rules emerge. A short SRS still captures non-functional needs (Excel export, audit trail, 20 concurrent users) that will not change.

</details>

3. **Spot the anti-pattern** — A team has stand-ups and sprints but delivers to users only at the end of a nine-month project. Which manifesto principle is violated and what is the fix?
<details><summary>Solution</summary>

"Deliver working software frequently" and "working software is the primary measure of progress". Fix: release an increment to a pilot group of users every sprint or at least monthly, even if partial, and use their feedback to reprioritise.

</details>

### Interview Questions

**Q: Compare Waterfall and Agile. Which would you choose and why?**
Waterfall is sequential with sign-off gates and documents between phases; it gives predictability and a paper trail but delays working software and makes change expensive. Agile delivers working increments in short cycles, welcomes change, and relies on close customer collaboration and strong engineering practices; it reduces the risk of building the wrong thing at the cost of less up-front predictability and a need for an available product owner. I choose based on requirements uncertainty and the cost of late change: for a three-state rate calculator with an engaged operations manager I ran two-week increments so agents could validate quotes early; for a printed policy manual whose content was legally reviewed before layout, a phased approach with a single revision round was correct.

**Q: What is the V-model and where is it still used?**
The V-model is Waterfall reshaped to show that each development phase defines a corresponding test level: requirements map to acceptance tests, system specification to system tests, architecture to integration tests and module design to unit tests, with coding at the point of the V. Its value is forcing test design early, which catches untestable requirements. It remains standard in safety-critical and regulated domains such as automotive (ISO 26262), medical devices (IEC 62304) and avionics, where traceability from requirement to test is audited, and in practice teams run Agile iterations inside its phases.

**Q: What problems does Agile not solve?**
Agile does not remove the need for architecture, estimation or documentation; it changes when and how much. It struggles with fixed-price, fixed-scope contracts because scope is meant to flex, with teams whose customer is unavailable, with very large or distributed organisations without a scaling framework, and with regulated environments that require phase-gate evidence. Poorly practised Agile produces technical debt when "working software" is read as "ships now" without refactoring and testing. Scrum's own guide says it is a framework, not a method: it deliberately leaves out engineering practices, which is why XP practices such as TDD and CI must be added for it to work well.

## Requirements (functional/non-functional, SRS)

Requirements engineering is the process of discovering, analysing, documenting, validating and managing what a system must do and the constraints it must satisfy. Studies since the 1980s agree that requirement defects are the most common and most expensive class of defect, because everything downstream is built on them. This chapter teaches how to classify requirements, write them so they can be tested, and organise them in a Software Requirements Specification.

### Functional and non-functional

A **functional requirement** describes a behaviour: an input, a process, an output. A **non-functional requirement** (NFR, also *quality attribute*) describes how well the system does it, or a constraint on it.

| Category | Examples for a title-production reporting system |
|---|---|
| Functional | The system shall import the daily production CSV. The system shall flag files idle more than 48 hours. The system shall export the weekly status report as XLSX and PDF. |
| Performance | The weekly report shall generate in under 60 seconds for 50 000 rows. |
| Reliability / availability | The dashboard shall be available 99.5% of business hours per month. |
| Security | Only users in the Operations group shall view agent-level productivity. |
| Usability | A new agent shall complete a file update in under 2 minutes after 30 minutes of training. |
| Maintainability | Adding a new state's rate table shall require no code change. |
| Portability / compatibility | The export shall open without warnings in Excel 2016 and later. |
| Legal / regulatory | Customer SSNs shall be masked in every report (GLBA). |
| Constraints | Must run on the existing SQL Server 2019 instance; must use company SSO. |

The FURPS+ classification (Functionality, Usability, Reliability, Performance, Supportability, plus design, implementation, interface and physical constraints) and ISO/IEC 25010 (eight product-quality characteristics) are the standard catalogues; use one as a checklist so no NFR category is forgotten.

### Writing a good requirement

Each requirement should be **unambiguous, verifiable, necessary, feasible, consistent, complete, traceable** and **atomic** (one requirement per statement). Use "shall" for mandatory, "should" for desirable, "may" for optional (RFC 2119 style), and give every requirement an identifier.

```text
Bad : The system should be fast and easy to use.
Good: FR-12  The system shall generate the weekly status report for up to 50 000 production rows
             in no more than 60 seconds on the production server (verify: performance test PT-3).
Good: NFR-4  95% of agents shall complete a file status update in under 2 minutes without
             assistance, measured in the UAT usability session with 10 agents.
```

The EARS template (Easy Approach to Requirements Syntax) gives shapes for common cases: *While <state>, when <trigger>, the <system> shall <response>*. Example: "While a file is in Escalated status, when the assigned agent updates it, the system shall notify the team lead within 1 minute."

### Elicitation techniques

Interviews (structured and open), workshops and JAD sessions, observation and job shadowing (watch an agent process a file; they will not mention the workaround they use), questionnaires, document analysis (existing SOPs, forms, reports), prototyping, and analysis of the current system's logs and defect reports. Stakeholder analysis first: users, sponsors, operations, compliance, support and the people whose reports will change all have requirements, and the loudest is not the most important.

### The SRS

IEEE 830 (superseded by ISO/IEC/IEEE 29148 but still the shape most people use) suggests:

```text
1. Introduction        purpose, scope, definitions, references, overview
2. Overall description product perspective, functions, user classes, operating environment,
                       constraints, assumptions and dependencies
3. Specific requirements
   3.1 External interfaces (UI, hardware, software, communications)
   3.2 Functional requirements (grouped by feature or use case)
   3.3 Non-functional requirements (performance, security, quality attributes)
   3.4 Other (database, standards compliance, legal)
Appendices             data dictionary, analysis models, traceability matrix
```

A good SRS is a contract, a test basis and a design input at the same time. It is reviewed by stakeholders, baselined under version control, and changed only through a change-control process so that scope creep is visible.

### Prioritisation and traceability

**MoSCoW** (Must, Should, Could, Won't this time) or a numeric value/risk/cost score decides what ships first. A **requirements traceability matrix** links each requirement to the design element, code module and test case that satisfies it, so you can answer "which tests cover FR-12" and "what breaks if we drop NFR-4".

| ID | Requirement | Design | Test | Status |
|---|---|---|---|---|
| FR-12 | Weekly report in 60 s | ReportBuilder, index on FileDate | PT-3 | Passed |
| NFR-4 | Update in 2 min | UI-7 single-screen form | UAT-2 | Open |

> **Interview note:** The classic question is "give an example of a non-functional requirement and how you would test it". Pick performance or security and give numbers: "Report generation under 60 seconds at 50 000 rows, verified by a timed run in the staging environment with a production-sized data set." Vague NFRs are the sign of a junior.

### Validation

Requirements are validated by reviews and walkthroughs, prototypes, test-case generation (if you cannot write a test, the requirement is not verifiable) and model checking for critical systems. Common defects: ambiguity ("process quickly"), omission (no requirement for what happens on an empty import), conflict (NFR says 60 seconds, FR says full recalculation of 12 states), and gold-plating (features nobody asked for).

### Try It Yourself

```text
SRS extract: Fillable onboarding form (client: HR consultancy)

FR-01  The form shall contain 168 fields as listed in Appendix A, each with the name,
       type (text/date/checkbox/dropdown) and maximum length specified there.
FR-02  When the "Same as mailing address" checkbox is ticked, the form shall copy the
       mailing address fields into the residential address fields.
FR-03  The form shall validate that Date of Birth is at least 18 years before today.
NFR-01 The form shall open and be fillable in Adobe Reader DC, macOS Preview and Chrome
       without warnings (verify: manual test matrix T-1).
NFR-02 Tab order shall follow reading order on every page (verify: keyboard-only walkthrough).
NFR-03 The completed form file size shall not exceed 2 MB with all fields filled.
CON-01 The form shall use the client's letterhead template LH-2024 exactly.
```

### Quiz

1. "Adding a new state's rate table shall require no code change" is which kind of requirement?
- [ ] Functional
- [x] Non-functional (maintainability)
- [ ] Constraint on hardware
> It describes a quality of the design, not a behaviour delivered to users.

2. Which word signals a mandatory requirement in RFC 2119 style?
- [ ] should
- [x] shall
- [ ] may
> "Shall" is mandatory, "should" is recommended, "may" is optional.

3. What does a traceability matrix link?
- [x] Requirements to design elements and tests
- [ ] Developers to tasks
- [ ] Bugs to releases
> It proves coverage and shows the impact of changing or dropping a requirement.

4. Which is a verifiable performance requirement?
- [ ] The system shall be fast
- [x] The report shall generate in under 60 seconds for 50 000 rows on the production server
- [ ] The system should feel responsive
> Verifiable means a test can pass or fail it unambiguously.

### Exercises

1. **Rewrite the vague** — Turn "The dashboard must be secure and quick" into two testable requirements.
<details><summary>Solution</summary>

```text
NFR-S1 Only members of the AD group OPS-Managers shall access agent-level productivity pages;
       all other authenticated users shall receive HTTP 403 (verify: security test ST-2).
NFR-P1 The team overview page shall render in under 2 seconds at the 95th percentile for
       30 concurrent users on the staging environment (verify: load test LT-1).
```

</details>

2. **Classify** — Label each as functional, non-functional or constraint: must run on SQL Server 2019; export PDF; mask SSNs; 99.5% availability; use company SSO.
<details><summary>Solution</summary>

Constraint; functional; non-functional (security/legal); non-functional (availability); constraint (could also be filed under security NFR).

</details>

3. **EARS** — Write an EARS-style requirement for notifying a team lead when a file has been idle 48 hours.
<details><summary>Solution</summary>

```text
While a production file is in any status other than Closed, when the file has had no status
update for 48 hours, the system shall send an email to the assigned team lead within 5 minutes
containing the file number, current status and assigned agent.
```

</details>

### Interview Questions

**Q: What is the difference between functional and non-functional requirements? Give examples.**
Functional requirements state what the system does: given inputs and conditions, it produces specific outputs or behaviour, such as "import the daily CSV" or "flag files idle over 48 hours". Non-functional requirements state how well it must do it or constrain how it is built: performance, availability, security, usability, maintainability, compliance. Both must be verifiable; NFRs especially need numbers and a measurement method, such as "weekly report under 60 seconds at 50 000 rows on the production server". NFRs drive architecture more than functional ones do: the same features with 99.99% availability instead of 99% need redundancy, monitoring and a very different deployment.

**Q: How do you elicit requirements from stakeholders who do not know what they want?**
Start with the problem rather than the solution: interview them about their goals, pains and current workflow, and observe them doing the work, because people omit what they do automatically. Analyse existing artefacts such as SOPs, reports and spreadsheets, which encode real rules. Then make something concrete quickly: a paper sketch, a clickable prototype or a spreadsheet mock-up of the report, because stakeholders react to artefacts far better than to blank pages. Capture what you learn as prioritised user stories or an SRS draft, review it with them, and expect to iterate. On a BPO QA tool I learned the real scoring rules only by shadowing the quality checker for two mornings.

**Q: What makes a requirement "good"?**
Unambiguous so two readers cannot interpret it differently, verifiable so a test can prove it, atomic so one statement carries one requirement, necessary so it traces to a business need, feasible within constraints, consistent with other requirements, and traceable with an identifier. Good requirements also state rationale, because the reason behind "reports must open in Excel 2016" tells a designer whether a newer format is acceptable in two years. I use the EARS templates for shape, "shall" for obligation, and refuse adjectives such as fast, secure and user-friendly unless a measure follows them.

## User stories & use cases

Agile teams capture requirements as **user stories**; more formal projects use **use cases**. They are complementary: a story is a placeholder for a conversation, small enough to build in a sprint; a use case is a structured description of an interaction, including alternatives and failures. Knowing both, and how to attach **acceptance criteria**, lets you work in either style and turn requirements into tests.

### User stories

A user story is a short statement of a need from the perspective of a user role, usually in the Connextra template:

```text
As a <role>, I want <goal> so that <benefit>.

As a team lead, I want to see files idle for more than 48 hours
so that I can reassign them before the client escalates.
```

Ron Jeffries' **three Cs**: the **Card** (the sentence), the **Conversation** (the discussion that fills in detail), and the **Confirmation** (acceptance criteria that prove it is done). A story is deliberately not a specification; it is a promise to talk.

### INVEST

Good stories are **I**ndependent (can be scheduled in any order), **N**egotiable (details are open), **V**aluable (deliver something to a user), **E**stimable (understood well enough to size), **S**mall (fits in a sprint, ideally days), **T**estable (has confirmable criteria). A story that fails INVEST is usually an **epic** to be split.

### Splitting stories

| Technique | Example |
|---|---|
| By workflow step | Import CSV / validate rows / show errors / commit rows |
| By business rule | Flag idle 48h / flag idle 72h with escalation / exclude weekends |
| By data variation | Owner policies / loan policies / simultaneous issue |
| By interface | Web table first / Excel export later / email digest last |
| Happy path first | Successful import; error handling as a follow-up story |
| Spike | A time-boxed research story whose output is knowledge, not a feature |

### Acceptance criteria and Gherkin

Acceptance criteria state the conditions under which the story is accepted. The **Given / When / Then** (Gherkin) form is executable by tools such as Cucumber, Behave and SpecFlow:

```text
Feature: Idle file alerts

  Scenario: File idle beyond the threshold
    Given a production file "WY-0421" in status "Title Search"
    And its last update was 49 hours ago
    When the idle-file report runs
    Then "WY-0421" appears in the report with idle hours 49
    And the assigned team lead receives an email within 5 minutes

  Scenario: Closed files are never flagged
    Given a file in status "Closed" last updated 200 hours ago
    When the idle-file report runs
    Then the file does not appear in the report
```

Each scenario is one test. Writing them during backlog refinement, before coding, is the essence of behaviour-driven development.

### Use cases

A **use case** describes how an **actor** (a user role or external system) uses the system to achieve a goal, as a sequence of steps with alternatives. The UML use-case diagram is the map; the textual use case is the substance.

```text
Use case  UC-07  Reassign idle file
Actor     Team lead
Precondition   Team lead is authenticated; at least one file is idle > 48h
Trigger   Team lead opens the idle-file report

Main success scenario
  1. System lists idle files with agent, status and idle hours.
  2. Team lead selects a file and chooses Reassign.
  3. System shows agents with current workload.
  4. Team lead selects an agent and confirms.
  5. System updates assignment, records audit entry, notifies both agents.
  6. System refreshes the list without the reassigned file.

Extensions
  3a. No agent has capacity: system shows warning; team lead may cancel (return to 1).
  4a. Selected agent is on leave: system rejects and returns to 3.
  5a. Notification fails: assignment is still saved; system queues a retry and logs the failure.

Postcondition   File assigned to new agent; audit log contains the change.
Frequency       10–20 per day
```

Alistair Cockburn's *Writing Effective Use Cases* is the reference. Levels: **summary** (business goal), **user goal** (one sitting, the useful level), **subfunction** (a step reused by several cases). Relationships: **include** (a mandatory shared sub-case such as "Authenticate"), **extend** (optional behaviour inserted at an extension point), and actor **generalisation**.

### Stories versus use cases

| | User story | Use case |
|---|---|---|
| Size | Small, sprint-sized | Complete goal with all paths |
| Detail | Conversation and criteria | Structured steps, extensions |
| Best for | Agile backlogs, evolving products | Contracts, complex workflows, regulated systems |
| Weakness | Loses the big picture without a story map | Heavy; can become pseudo-design |

Many teams write use cases for the workflow and derive stories from their steps. A **story map** (Jeff Patton) arranges stories under the user's activities left to right and by priority top to bottom, restoring the overview a pile of cards loses.

> **Tip:** Write the acceptance criteria before estimating. Teams that estimate first and discover the edge cases later consistently under-size stories. The "Closed files are never flagged" scenario above doubled the size of the idle-file story when it surfaced the weekend-exclusion rule the team lead had never mentioned.

### Definition of Ready and Done

A story is **Ready** when it has a clear description, acceptance criteria, an estimate and no blocking dependencies. It is **Done** when it meets the team's Definition of Done: code reviewed, tests written and passing, documentation updated, deployed to staging, accepted by the product owner. Both definitions are written down and visible on the board.

### Try It Yourself

```text
Story  As a QA checker, I want to score an agent's processed file against the checklist
       so that monthly quality reports are consistent across checkers.

Acceptance criteria (Gherkin)
  Scenario: Score a file
    Given file "TX-1180" processed by agent "A07"
    And the checklist has 12 items each worth 1 point
    When the checker marks 10 items as Pass and 2 as Fail with comments
    Then the file score is 83.3%
    And both failed items require a non-empty comment before Save is enabled

  Scenario: Duplicate scoring is prevented
    Given "TX-1180" has already been scored today by another checker
    When I open it for scoring
    Then I see the existing score and a "Request re-score" option instead of a blank form
```

### Quiz

1. What are the three Cs of a user story?
- [ ] Code, Compile, Commit
- [x] Card, Conversation, Confirmation
- [ ] Customer, Cost, Calendar
> The card is a placeholder; the conversation fills detail; the confirmation is the acceptance test.

2. In INVEST, what does "S" require?
- [ ] Secure
- [x] Small enough to complete within a sprint
- [ ] Sequential
> Large stories are epics and must be split.

3. In UML, which relationship models a mandatory shared sub-case such as "Authenticate"?
- [x] include
- [ ] extend
- [ ] generalisation
> Include is always executed; extend is optional behaviour at an extension point.

4. In Gherkin, which keyword states the precondition?
- [x] Given
- [ ] When
- [ ] Then
> Given sets context, When is the action, Then is the observable outcome.

### Exercises

1. **Split an epic** — "As an operations manager I want a production dashboard" is too large. Split it into four INVEST-compliant stories.
<details><summary>Solution</summary>

```text
1. As an ops manager I want daily files-closed totals per state so that I can spot volume drops.
2. As an ops manager I want files-per-agent for the current week so that I can balance workload.
3. As an ops manager I want a list of files idle > 48h so that I can prevent escalations.
4. As an ops manager I want to export any dashboard table to XLSX so that I can attach it to the client status email.
```

</details>

2. **Write a use case** — Draft UC "Import daily production CSV" with a main scenario and two extensions.
<details><summary>Solution</summary>

```text
UC-02 Import daily production CSV      Actor: Data analyst
Main: 1 Analyst selects file. 2 System validates header. 3 System validates each row.
      4 System shows summary (rows ok / rejected). 5 Analyst confirms. 6 System commits and logs.
Ext:  2a Header mismatch → show expected vs found, abort.
      3a Rows rejected → list row numbers and reasons; analyst may commit valid rows only or abort.
```

</details>

3. **Gherkin for a rule** — Write a scenario asserting that weekends are excluded from idle-hour calculations.
<details><summary>Solution</summary>

```text
Scenario: Weekend hours are excluded
  Given a file last updated Friday 17:00
  And the current time is Monday 09:00
  When the idle-file report runs
  Then the file's idle hours equal 16
```

</details>

### Interview Questions

**Q: What is a user story and how is it different from a requirement?**
A user story is a short, user-centred statement of a need, "as a role I want goal so that benefit", that acts as a placeholder for a conversation and is completed by acceptance criteria. Unlike a traditional requirement it is deliberately incomplete and negotiable until the team refines it, sized to fit a sprint, and focused on value rather than system behaviour. The acceptance criteria are where it becomes as precise as a requirement, ideally in Given/When/Then form so they double as tests. On its own a story loses the system-wide view, so I pair stories with a story map or a set of use cases for the main workflows.

**Q: Explain include versus extend in use-case diagrams.**
Include means the base use case always invokes the included one as a mandatory step; it factors out shared behaviour such as "Authenticate user" or "Write audit entry" so several use cases reuse it. Extend means an extending use case adds optional behaviour to the base at a named extension point under a condition, such as "Apply discount" extending "Quote policy" only when a simultaneous-issue flag is set. The arrow direction differs: include points from base to included; extend points from the extension to the base. Interviewers check that you know include is unconditional and extend is conditional, and that overuse of either turns an analysis model into a design model.

**Q: How do you write acceptance criteria that developers and testers can both use?**
I write them as concrete scenarios with real data in Given/When/Then form: a precondition, one action, and observable outcomes with numbers, never "works correctly". Each scenario covers one rule, so the set includes the happy path, boundary values (exactly 48 hours), and the negative cases (closed files, weekends). We write them in backlog refinement with the product owner, tester and a developer together, which surfaces hidden rules before estimation. Because the format is Gherkin, testers can automate them with Behave or Cucumber, and the same text is the living documentation of the rule after release.

# LEVEL: Intermediate

## Agile & Scrum (roles, ceremonies, artifacts)

**Scrum** is the most widely used Agile framework. The 2020 Scrum Guide (Schwaber and Sutherland) defines it in about thirteen pages: a small team delivers a usable increment every **sprint** of one month or less, inspecting and adapting through five events, three accountabilities and three artefacts, each artefact carrying a commitment. Scrum is built on **empirical process control**: transparency, inspection and adaptation, because in complex work you learn more by doing and measuring than by planning in detail.

### The three accountabilities

| Role | Accountable for | Not |
|---|---|---|
| **Product Owner** | Maximising product value; owning and ordering the Product Backlog; being the one voice on priorities | A committee; a proxy who cannot decide |
| **Scrum Master** | The team's effectiveness; coaching Scrum; removing impediments; protecting focus | A project manager, a secretary, the boss |
| **Developers** | Creating a usable increment each sprint; the Sprint Backlog; quality via the Definition of Done; self-managing daily | Only "coders": testers, designers, writers are Developers too |

A Scrum Team is ten or fewer people, cross-functional (has all skills needed) and self-managing (decides who does what, when and how). There is no team lead role in Scrum; leadership is situational.

### The five events

1. **The Sprint**: a fixed time-box (typically two weeks) containing all other events. No changes that endanger the Sprint Goal; scope may be clarified and renegotiated with the Product Owner. Only the Product Owner can cancel a sprint.
2. **Sprint Planning** (max 8 hours for a one-month sprint): answers *why* (the Sprint Goal), *what* (items pulled from the Product Backlog) and *how* (the plan, often a task breakdown). Output: the Sprint Backlog.
3. **Daily Scrum** (15 minutes, same time and place, for Developers): inspect progress toward the Sprint Goal and adapt the plan for the next 24 hours. The three questions (did / will / blocked) are optional since 2020; the purpose is planning, not status reporting to a manager.
4. **Sprint Review** (max 4 hours): the team and stakeholders inspect the increment and adapt the Product Backlog. A working demo, not slides; feedback becomes backlog items.
5. **Sprint Retrospective** (max 3 hours): the team inspects itself, people, process, tools, Definition of Done, and commits to improvements for the next sprint.

**Backlog refinement** is an ongoing activity, not an event: adding detail, estimates and order to items so the top of the backlog is Ready for planning.

### The three artefacts and their commitments

| Artefact | What it is | Commitment |
|---|---|---|
| **Product Backlog** | Ordered, emergent list of everything that might be needed; owned by the PO | **Product Goal**: the long-term objective |
| **Sprint Backlog** | Selected backlog items plus the plan to deliver them; owned by Developers | **Sprint Goal**: the single objective for the sprint |
| **Increment** | A concrete, usable step toward the Product Goal; must meet the Definition of Done | **Definition of Done**: the quality bar; undone work does not ship |

```text
Sprint 14 (2 weeks)   Sprint Goal: Team leads can act on idle files without asking the analyst.

Sprint Backlog
  [ ] ST-41 Idle-file report (48h rule, weekends excluded)        5 pts
        - SQL view for last update per file
        - Report page with filters
        - Gherkin scenarios automated
  [ ] ST-42 Reassign file from the report                         3 pts
  [ ] ST-45 Email digest to team leads at 08:00                   3 pts
  [ ] BUG-88 Weekly XLSX export drops the last row                1 pt
Capacity: 12 pts (last three sprints: 11, 13, 12)
```

### Tracking

A **burndown chart** plots remaining work (points or hours) against sprint days; a **burnup** shows completed work rising toward a total scope line and reveals scope changes, which the burndown hides. **Velocity** is the average points completed per sprint over recent sprints; it is a planning tool for the team, not a productivity metric to compare teams or to push upward.

### Scrum values

Commitment, focus, openness, respect and courage. They are in the Guide because the mechanics do not work without them: a Daily Scrum where nobody admits being stuck, or a Review where the PO hides bad news from stakeholders, breaks inspection and adaptation.

> **Warning:** Common Scrum failures are all violations of the framework, not of Agile: sprints with no goal, a Product Owner who is a committee, a Scrum Master who assigns tasks, retrospectives that produce no actions, "hardening sprints" because the Definition of Done is too weak, and velocity used as a target. When an interviewer asks about your Scrum experience, naming one such failure and how the team fixed it is worth more than reciting the events.

### Scaling and alternatives

When several teams work on one product: **Nexus** (Scrum.org, 3–9 teams sharing one backlog with an integration team), **LeSS** (Large-Scale Scrum, one PO and backlog, sprint events partly shared), **SAFe** (Scaled Agile Framework: Agile Release Trains, Program Increments, many roles; comprehensive and heavyweight), and **Scrum@Scale**. Extreme Programming supplies the engineering practices Scrum omits: TDD, pair programming, continuous integration, refactoring, collective ownership, sustainable pace.

### Try It Yourself

```text
Sprint calendar (2-week sprint, 5-person team, Mon 1 – Fri 12)

Mon 1   09:00–11:00  Sprint Planning       → Sprint Goal + Sprint Backlog
Daily   09:15–09:30  Daily Scrum           → plan for next 24h, impediments to SM
Wed 3   14:00–15:00  Backlog refinement    → next sprint's top items Ready
Wed 10  14:00–15:00  Backlog refinement
Fri 12  10:00–11:30  Sprint Review         → demo increment, stakeholder feedback → backlog
Fri 12  13:00–14:00  Sprint Retrospective  → 1–2 improvement actions added to next Sprint Backlog

Definition of Done: code reviewed · unit + Gherkin tests green in CI · deployed to staging ·
                    docs/SOP updated · PO accepted against acceptance criteria
```

### Quiz

1. Who owns the order of the Product Backlog?
- [ ] The Scrum Master
- [x] The Product Owner
- [ ] The stakeholders by vote
> The PO is the single accountable person for backlog content and order.

2. What is the maximum length of a sprint per the Scrum Guide?
- [ ] Two weeks
- [x] One month
- [ ] One quarter
> Shorter sprints limit risk; a month is the ceiling.

3. Which artefact carries the Definition of Done as its commitment?
- [ ] Product Backlog
- [ ] Sprint Backlog
- [x] Increment
> Product Goal, Sprint Goal and Definition of Done map to the three artefacts respectively.

4. What is the purpose of the Daily Scrum?
- [ ] Status report to management
- [x] Developers inspect progress toward the Sprint Goal and plan the next 24 hours
- [ ] Assign tasks for the day
> It is a planning event for the Developers, time-boxed to 15 minutes.

### Exercises

1. **Diagnose** — A team's retrospectives list the same three complaints every sprint. What is wrong and what would you change?
<details><summary>Solution</summary>

Inspection without adaptation: no improvement items are entering the Sprint Backlog. Pick one improvement per retrospective, make it a visible backlog item with an owner and a measure, and review it at the next retrospective before raising new topics.

</details>

2. **Write a Sprint Goal** — The backlog items are: idle-file report, reassign action, email digest, export fix. Write one goal and explain why the export fix may still be included.
<details><summary>Solution</summary>

Goal: "Team leads can find and reassign idle files themselves." The export bug does not serve the goal but small items may be included as capacity allows; the goal states the *why*, not the full list, and gives the team a basis for dropping scope if needed.

</details>

3. **Velocity planning** — Velocities for the last five sprints were 9, 14, 11, 12, 13. The backlog to the release has 71 points. Estimate the sprints needed with a range.
<details><summary>Solution</summary>

Average ≈ 11.8 → 6 sprints; using the worst three-sprint average (≈ 11.3) and best (≈ 13) gives 6–7 sprints. Report "6 to 7 sprints, most likely 6" and re-forecast every sprint.

</details>

### Interview Questions

**Q: Describe the Scrum framework: roles, events and artefacts.**
Scrum has three accountabilities: the Product Owner who owns and orders the Product Backlog and maximises value, the Scrum Master who is accountable for the team's effectiveness and the correct use of Scrum, and the Developers who deliver a usable increment each sprint. Five events: the Sprint container of one month or less, Sprint Planning producing a Sprint Goal and Sprint Backlog, the 15-minute Daily Scrum for the Developers to replan, the Sprint Review where stakeholders inspect the increment and the backlog is adapted, and the Retrospective where the team improves itself. Three artefacts with commitments: Product Backlog with the Product Goal, Sprint Backlog with the Sprint Goal, and the Increment with the Definition of Done. It all rests on transparency, inspection and adaptation.

**Q: What does a Scrum Master do all day if they do not manage the team?**
They make the team more effective: coaching the Product Owner on backlog management and goal setting, facilitating events so they stay focused and time-boxed, removing impediments the team cannot remove itself such as a blocked test environment or an absent stakeholder, shielding the team from mid-sprint disruption, and coaching the organisation on how to work with a Scrum team. They track flow problems, help the team improve its Definition of Done, and often pair with developers on engineering practices. A Scrum Master who assigns tasks or reports status upward has become a project manager and the team has lost self-management, which is the most common failure I have seen.

**Q: How would you handle a stakeholder who keeps adding work mid-sprint?**
Route it through the Product Owner, who alone changes the backlog; the Developers protect the Sprint Goal. If the new work is genuinely more valuable than something in the sprint, the PO can negotiate a swap of equal size with the Developers, and if it invalidates the goal the PO can cancel the sprint, which is rare and visible. Otherwise the item goes on the Product Backlog for the next planning. I would also ask why the pattern exists: sprints may be too long for the stakeholder's needs, in which case one-week sprints or a Kanban flow with an expedite lane may fit better than fighting the request each time.

## Kanban & Jira basics

**Kanban** is a method for managing flow of work: visualise it, limit work in progress, measure and improve. It comes from Toyota's production system and was adapted to knowledge work by David Anderson (2010). Unlike Scrum it prescribes no roles, sprints or events; you start with your current process and evolve it. **Jira** (Atlassian) is the most common tool for both Scrum and Kanban boards, so this chapter covers the practices and the tool together.

### The Kanban practices

1. **Visualise the workflow**: a board with columns for each state work passes through, and a card per work item.
2. **Limit work in progress (WIP)**: a maximum number of cards per column. When a column is full, nobody starts new work; they help finish existing work. This is the practice that changes behaviour.
3. **Manage flow**: measure how long items take and where they wait; act on bottlenecks.
4. **Make policies explicit**: what "Ready for review" requires, how classes of service are handled.
5. **Implement feedback loops**: daily stand-up at the board, replenishment meetings, delivery and operations reviews.
6. **Improve collaboratively, evolve experimentally**: change one thing, measure, keep or revert.

```text
| Backlog | Ready (5) | In progress (3) | Review (2) | Test (2) | Done |
|---------|-----------|-----------------|------------|----------|------|
| ST-61   | ST-52     | ST-47  (Ali)    | ST-45      | ST-41    | ST-38|
| ST-62   | ST-53     | ST-49  (Sara)   | BUG-88     |          | ST-40|
| ST-63   | ST-55     |                 |            |          | ...  |
| ...     |           |                 |            |          |      |
```

The numbers in headings are WIP limits. Review is full: before starting ST-53, a developer should review ST-45 or BUG-88. Columns are often split into *doing* and *done* sub-columns so a "pull" is explicit.

### Flow metrics

| Metric | Definition | Use |
|---|---|---|
| **Lead time** | From request (card created) to delivery | What the customer experiences |
| **Cycle time** | From work started to finished | What the team controls |
| **Throughput** | Items finished per unit time | Forecasting: 71 items at 6/week ≈ 12 weeks |
| **WIP** | Items in progress | Little's Law: cycle time = WIP ÷ throughput |
| **Flow efficiency** | Active time ÷ total time | Often 15–25%; waiting dominates |

**Little's Law** is the argument for WIP limits: with throughput fixed by capacity, halving WIP halves cycle time. A **cumulative flow diagram** (CFD) stacks the count of items in each state over time; a widening band is a bottleneck, and the horizontal distance between the arrival and departure lines is average lead time. A **cycle-time scatterplot** with percentile lines ("85% of items finish within 9 days") gives a service-level expectation without estimating each item.

### Classes of service

Not all work is equal. Typical classes: **expedite** (one at a time, jumps every queue, for production incidents), **fixed date** (regulatory rate filing effective 1 July), **standard**, and **intangible** (refactoring, documentation). Each has an explicit policy on how it is pulled.

### Scrum versus Kanban

| | Scrum | Kanban |
|---|---|---|
| Cadence | Fixed sprints | Continuous flow; optional cadences |
| Roles | PO, SM, Developers | None prescribed |
| Change | Not mid-sprint | Any time, subject to WIP |
| Metrics | Velocity, burndown | Lead/cycle time, throughput, CFD |
| Fits | Product development with planning horizons | Support, operations, maintenance, unpredictable arrivals |

**Scrumban** combines sprints and events from Scrum with WIP limits and flow metrics from Kanban. A BPO data-processing team handling arriving files is a natural Kanban system; the development team building their tools may run Scrum.

### Jira essentials

Jira organises work into **projects** containing **issues** of configurable **types** (Epic, Story, Task, Bug, Sub-task). Each issue has a key (`OPS-142`), summary, description, assignee, reporter, priority, status, labels, components, fix version, story points, sprint and custom fields. A **workflow** defines statuses and transitions; a **board** (Scrum or Kanban) shows issues by status with **swimlanes** (by epic, assignee or query) and optional column limits. **Team-managed** projects are simple and owned by the team; **company-managed** projects share schemes administered centrally.

**JQL** (Jira Query Language) filters issues:

```text
project = OPS AND type = Bug AND status != Done ORDER BY priority DESC, created ASC
assignee = currentUser() AND sprint in openSprints()
project = OPS AND resolved >= startOfWeek() AND resolution = Fixed
"Epic Link" = OPS-100 AND status changed to "In Review" after -7d
```

Saved filters feed dashboards (gadgets such as Sprint Burndown, Created vs Resolved, Filter Results) and boards. Keyboard shortcuts: `c` creates an issue, `.` opens the operations dialog, `/` focuses search.

### Linking and traceability

Commits and branches that mention an issue key (`OPS-142`) are linked automatically when Jira is connected to GitHub or Bitbucket; a PR titled `OPS-142 Add idle-file report` appears in the issue's Development panel and can transition the issue on merge. Confluence pages link requirements to epics, giving a lightweight traceability chain from page to epic to story to PR.

> **Tip:** Limit issue types and custom fields ruthlessly. Boards with fourteen statuses and forty fields are where Jira gets its bad reputation. A workflow with Backlog, Selected, In Progress, In Review, Done, plus WIP limits on the middle three, covers most teams.

### Try It Yourself

```text
Board: OPS – Support & Maintenance (Kanban)
Columns / WIP:  Backlog | Selected (6) | In progress (3) | In review (2) | Done
Swimlanes:      Expedite (WIP 1) | Fixed date | Standard | Intangible
Explicit policy: "In review" requires PR opened + acceptance criteria ticked in the issue

JQL for the weekly ops report
  project = OPS AND resolved >= -7d ORDER BY resolutiondate DESC
Cycle-time check (85th percentile target ≤ 7 days)
  project = OPS AND status changed from "In progress" AND resolved >= -30d
```

### Quiz

1. What is the practice in Kanban that most directly reduces cycle time?
- [ ] Daily stand-ups
- [x] Limiting work in progress
- [ ] Story point estimation
> By Little's Law, with fixed throughput, lower WIP means shorter cycle time.

2. What does a widening band on a cumulative flow diagram indicate?
- [ ] Higher throughput
- [x] A bottleneck: work accumulating in that state
- [ ] Reduced lead time
> Band width is the number of items in that state; growth means arrivals exceed departures.

3. Which is a valid JQL query for your open issues in the current sprint?
- [ ] `SELECT * FROM issues WHERE mine`
- [x] `assignee = currentUser() AND sprint in openSprints() AND status != Done`
- [ ] `owner:me sprint:current`
> JQL uses field = value clauses combined with AND/OR and functions like `currentUser()`.

4. What distinguishes Scrumban?
- [x] Scrum's events and roles with Kanban's WIP limits and flow metrics
- [ ] Kanban without a board
- [ ] Scrum with month-long sprints
> It is a hybrid, common in teams mixing feature work and support.

### Exercises

1. **Apply Little's Law** — A team finishes 8 items a week and has 24 items in progress. What is the average cycle time, and what happens if WIP drops to 12?
<details><summary>Solution</summary>

Cycle time = WIP ÷ throughput = 24 ÷ 8 = 3 weeks. With WIP 12 and the same throughput, cycle time falls to 1.5 weeks; the items still get done, they just wait less.

</details>

2. **Design a board** — Design columns, WIP limits and one explicit policy for a two-person Fiverr document-production queue.
<details><summary>Solution</summary>

```text
Requested | Brief confirmed (4) | In production (2) | Client review (3) | Revisions (2) | Delivered
Policy: an order enters "Brief confirmed" only when the source file, brand assets and page count are received.
```

</details>

3. **Write JQL** — Bugs of priority High or Highest created in the last 14 days that are still unassigned.
<details><summary>Solution</summary>

```text
project = OPS AND type = Bug AND priority in (High, Highest) AND created >= -14d AND assignee is EMPTY ORDER BY created DESC
```

</details>

### Interview Questions

**Q: When would you choose Kanban over Scrum?**
When work arrives unpredictably and must be handled as it comes, such as support, operations, maintenance or a document-production queue, where a fixed sprint commitment would be broken daily. Kanban's continuous flow, WIP limits and classes of service handle expedites and fixed dates explicitly, and its metrics (cycle time percentiles, throughput) forecast without per-item estimation. Scrum fits better when a team builds a product toward goals and benefits from a planning cadence and a stable scope for a couple of weeks. Many teams need both, running Scrumban: sprints for planned features, an expedite lane with a WIP limit of one for incidents.

**Q: Explain lead time, cycle time and throughput, and how you use them.**
Lead time is the elapsed time from a request being made to its delivery, which is what the customer feels; cycle time is from when work actually starts to when it finishes, which is what the team controls; throughput is the number of items completed per period. They connect through Little's Law: average cycle time equals average WIP divided by throughput. I use throughput to forecast ("about 6 items a week, so 70 items is roughly 12 weeks"), cycle-time percentiles as a service-level expectation ("85% of bugs closed within 7 days"), and the gap between lead and cycle time to show how long items sit in queues, which is usually the biggest improvement opportunity.

**Q: How do you keep Jira useful rather than a burden?**
Model only the workflow the team really uses with five or six statuses, put WIP limits on the in-progress columns, and keep required fields to summary, type, priority and acceptance criteria. Let integrations do the bookkeeping: branch names and PR titles carry the issue key so transitions happen on merge. Use JQL filters and a dashboard for the questions people actually ask each week rather than asking people to update fields for reports nobody reads. Review the board layout in retrospectives, and delete statuses, fields and automation rules that no longer earn their place; every extra field is a tax on every issue.

## UML (use case, class, sequence, activity)

The **Unified Modeling Language** is the standard notation for drawing software structure and behaviour. You will not model everything, and nobody should, but four diagrams cover most conversations, exam questions and interview whiteboards: **use case** (who does what with the system), **class** (the structure of the code and data), **sequence** (how objects interact over time for one scenario) and **activity** (the flow of a process). This chapter teaches the notation with one running example: the production-file tracking system.

### Use case diagram

Actors (stick figures) outside a system boundary (rectangle) connect to use cases (ellipses). Relationships: association (line), `<<include>>` (dashed arrow from base to included), `<<extend>>` (dashed arrow from extension to base), and generalisation (hollow triangle) between actors or use cases.

```text
            ┌───────────────── File Tracking System ─────────────────┐
  Agent ────│── (Update file status) ──<<include>>──▶ (Authenticate)  │
            │                                                          │
  Team lead │── (Reassign idle file) ──<<include>>──▶ (Authenticate)  │
     ▲      │        ▲                                                 │
     │      │        └──<<extend>>── (Notify client of delay)          │
  QA lead ──│── (Score processed file)                                 │
            └──────────────────────────────────────────────────────────┘
```

Use case diagrams show scope and actors; the behaviour lives in the textual use cases from the previous level. Do not draw arrows between use cases to mean "then"; that is what activity diagrams are for.

### Class diagram

A class box has three compartments: name, attributes, operations. Visibility: `+` public, `-` private, `#` protected, `~` package. Static members are underlined; abstract classes and operations are italic (or marked `{abstract}`).

```text
┌──────────────────────────┐        1      *  ┌──────────────────────────┐
│ Agent                    │─────────────────▶│ ProductionFile           │
├──────────────────────────┤  assigned to     ├──────────────────────────┤
│ - id: int                │                  │ - fileNo: str            │
│ - name: str              │                  │ - state: str             │
│ - team: Team             │                  │ - status: Status         │
├──────────────────────────┤                  │ - lastUpdate: datetime   │
│ + workload(): int        │                  ├──────────────────────────┤
└──────────────────────────┘                  │ + idleHours(now): float  │
                                              │ + reassign(a: Agent)     │
                                              └──────────────────────────┘
                                                        │ 1
                                                        │ composition
                                                        ▼ *
                                              ┌──────────────────────────┐
                                              │ AuditEntry               │
                                              └──────────────────────────┘
```

Relationship notation:

| Relationship | Line | Meaning |
|---|---|---|
| Association | plain line, optional arrow, multiplicities (`1`, `*`, `0..1`, `1..*`) | Objects know each other |
| Aggregation | hollow diamond at the whole | Whole–part, parts can exist independently (Team ◇— Agent) |
| Composition | filled diamond at the whole | Whole owns parts; parts die with the whole (File ◆— AuditEntry) |
| Generalisation | hollow triangle at the parent | Inheritance (OwnerPolicy ▷ Policy) |
| Realisation | dashed line, hollow triangle | Class implements an interface |
| Dependency | dashed arrow | Uses temporarily (parameter, local) |

Class diagrams appear at two levels: **analysis** (domain concepts, few operations) and **design** (types, visibility, interfaces, patterns).

### Sequence diagram

Lifelines (objects or actors) run down the page; time flows downward; messages are horizontal arrows. Solid arrowheads are synchronous calls, open arrowheads asynchronous, dashed lines returns. Activation bars show when an object is executing. Combined fragments frame conditional and repeated behaviour: `alt` (if/else), `opt` (if), `loop`, `par`, `ref`.

```text
Team lead        :ReportPage       :FileService       :Notifier
    |                 |                  |                 |
    |--reassign(f,a)->|                  |                 |
    |                 |--reassign(f,a)-->|                 |
    |                 |                  |--[alt a.onLeave]|
    |                 |                  |   raise Error   |
    |                 |                  |--[else]---------|
    |                 |                  |  save(f)        |
    |                 |                  |--notify(f,a)--->|
    |                 |                  |<- - - - - - - - |
    |                 |<- - - ok - - - - |                 |
    |<- - refresh - - |                  |                 |
```

Sequence diagrams are the best tool for explaining one scenario in a design review or an interview: "walk me through what happens when the user clicks Reassign" is a sequence diagram spoken aloud.

### Activity diagram

Activity diagrams are flowcharts with UML semantics: a filled circle starts, a bull's-eye ends, rounded rectangles are actions, diamonds are decisions or merges, thick bars are forks and joins for parallel flows, and **swimlanes** (partitions) show who performs each action.

```text
[Agent]                 [System]                       [Team lead]
  ●
  │
  ▼
(Update status)──────▶(Record timestamp)
                            │
                            ▼
                     ◇ idle > 48h? ◇──no──▶ ◉
                            │yes
                            ▼
                     (Add to idle report)──────▶(Review report)
                                                     │
                                                     ▼
                                              ◇ reassign? ◇──no──▶ ◉
                                                     │yes
                                                     ▼
                                              (Select agent)──▶(Update assignment)──▶ ◉
```

Use activity diagrams for business processes, SOPs and algorithms with branching; they are the UML equivalent of the process maps a BPO team already draws.

### Other diagrams worth recognising

**State machine** (states, transitions with `event [guard] / action`) for objects with lifecycle, such as a file moving Open → Title Search → Escalated → Closed. **Component** and **deployment** diagrams for architecture: which modules exist and which servers run them. **Object** diagrams as snapshots of instances. UML 2.5 defines fourteen diagram types; you will draw four regularly.

> **Interview note:** Whiteboard interviews rarely ask for perfect notation. They ask you to draw the classes for a domain (a library, a parking lot, a policy quote), or to sequence a request through a system. Say the notation out loud as you draw ("composition here, because audit entries cannot exist without the file"), keep multiplicities honest, and be ready to change the diagram when the interviewer adds a requirement.

### Tools

Draw.io / diagrams.net (free, exports to PNG and SVG), PlantUML and Mermaid (text-based, diffable, render in GitHub Markdown), Lucidchart, Visual Paradigm, StarUML and Enterprise Architect for full modelling. Mermaid is what you want in a README:

```text
classDiagram
    Agent "1" --> "*" ProductionFile : assigned to
    ProductionFile *-- AuditEntry
    class ProductionFile {
        -fileNo: str
        -status: Status
        +idleHours(now) float
        +reassign(a: Agent)
    }
```

### Try It Yourself

```text
sequenceDiagram
    actor TL as Team lead
    participant RP as ReportPage
    participant FS as FileService
    participant N as Notifier
    TL->>RP: reassign(file, agent)
    RP->>FS: reassign(file, agent)
    alt agent on leave
        FS-->>RP: error "agent unavailable"
    else available
        FS->>FS: save(file); audit(file)
        FS->>N: notify(file, agent)
        N-->>FS: queued
        FS-->>RP: ok
    end
    RP-->>TL: refresh list
```

### Quiz

1. Which diagram shows object interactions ordered in time for one scenario?
- [ ] Class diagram
- [x] Sequence diagram
- [ ] Use case diagram
> Lifelines and time-ordered messages are the sequence diagram's purpose.

2. A filled diamond at the "whole" end of an association means what?
- [ ] Aggregation
- [x] Composition
- [ ] Generalisation
> Composition is strong ownership; the parts cannot outlive the whole.

3. Which symbol represents parallel flows in an activity diagram?
- [ ] Diamond
- [x] Thick bar (fork/join)
- [ ] Bull's-eye
> Diamonds are decisions/merges; the bull's-eye is the final node.

4. In a use case diagram, which direction does the `<<extend>>` arrow point?
- [ ] From base to extension
- [x] From the extending use case to the base
- [ ] Either way
> Include points base → included; extend points extension → base.

### Exercises

1. **Class diagram** — Model Policy (abstract) with subclasses OwnerPolicy and LoanPolicy, a Quote that holds one or two policies, and a RateTable the Quote depends on. State the relationship types.
<details><summary>Solution</summary>

```text
Policy {abstract} ◁── OwnerPolicy, LoanPolicy      (generalisation)
Quote ◆── 1..2 Policy                               (composition: policies belong to the quote)
Quote - - -▶ RateTable                              (dependency: used during price())
Quote: + price(): Money    Policy: + coverage: Money, + premium(rt: RateTable): Money {abstract}
```

</details>

2. **State machine** — Draw the states and transitions for a production file: Open, TitleSearch, Escalated, Closed, with events assign, escalate, resolve, close.
<details><summary>Solution</summary>

```text
● → Open --assign--> TitleSearch --escalate--> Escalated --resolve--> TitleSearch
      TitleSearch --close [all checks passed]--> Closed → ◉
      Escalated --close [manager override] / log override--> Closed
```

</details>

3. **Activity with swimlanes** — Model the QA scoring process: checker samples a file, scores it, if below 80% the team lead coaches the agent, otherwise the score is filed.
<details><summary>Solution</summary>

```text
[QA checker]            [System]                 [Team lead]
● → (Sample file) → (Score against checklist) → ◇ score < 80%? ◇
                                                  yes → (Schedule coaching) → (Coach agent) → ◉
                                                  no  → (File score) → ◉
```

</details>

### Interview Questions

**Q: What is the difference between aggregation and composition?**
Both are whole–part associations. Aggregation (hollow diamond) is a loose grouping where parts exist independently and can be shared: a Team aggregates Agents, and an Agent survives if the Team is dissolved. Composition (filled diamond) is exclusive ownership with coincident lifetimes: a ProductionFile composes its AuditEntries, which are created and deleted with the file and belong to no other file. In code, composition usually means the whole creates the parts and cascades deletion, while aggregation holds references it did not create. When unsure, I ask "can this part exist without that whole, and can two wholes share it?"; if yes to either, it is aggregation.

**Q: Which UML diagrams do you actually use and when?**
Class diagrams at the domain level to agree vocabulary with stakeholders and at the design level to review structure before coding a module. Sequence diagrams for any non-trivial interaction across components, especially integrations and error paths, because they expose missing calls and unclear ownership. Activity diagrams with swimlanes for business processes and SOPs, which non-technical staff can read and correct. Use case diagrams only as a scope map at the start. I keep them as Mermaid or PlantUML text in the repository so they are versioned and reviewed with the code, and I delete diagrams that are no longer maintained rather than let them lie.

**Q: Draw the class diagram for a library system.**
I would start with Member, Book, Copy and Loan: a Book is the bibliographic record (ISBN, title, author) and a Copy is a physical item, so Book has a one-to-many composition to Copy. Loan is an association class between Member and Copy carrying the loan date, due date and return date, with a Member having zero-to-many Loans and a Copy zero-to-many over time but at most one active. Librarian and Member may specialise a User base class for authentication. Fine is composed by Loan with an amount and paid flag. I would state invariants aloud, such as a Copy cannot have two open Loans, and ask whether reservations are in scope before adding a Reservation class.

## Software design principles (cohesion, coupling, DRY, KISS)

Design principles are the rules of thumb that make code easy to understand, change and test. They are technology-independent, which is why interviewers ask about them regardless of language. This chapter covers the classic pair **cohesion and coupling**, the acronyms **DRY, KISS, YAGNI**, the **SOLID** principles, and how to recognise their violations as **code smells**.

### Cohesion and coupling

**Cohesion** measures how strongly the elements inside a module belong together. **Coupling** measures how much a module depends on other modules. Good design is **high cohesion, low coupling**: each module does one thing well and knows little about the others.

| Cohesion (worst → best) | Example |
|---|---|
| Coincidental | A `utils.py` with date parsing, PDF export and an email sender |
| Logical | `handle(kind)` doing different unrelated things based on a flag |
| Temporal | `startup()` that loads config, warms caches and sends a Slack message |
| Procedural | Steps grouped because they run in order |
| Communicational | Functions grouped because they use the same data |
| Sequential | Output of one part is input of the next |
| Functional | One well-defined task: `calculate_premium(policy, rate_table)` |

| Coupling (worst → best) | Example |
|---|---|
| Content | Module reaches into another's private data |
| Common | Modules share global variables |
| Control | Passing a flag that tells the callee what to do |
| Stamp | Passing a whole record when one field is needed |
| Data | Passing only the needed simple values |
| Message | Communicating only via well-defined messages or interfaces |

```python
# Tight coupling: report knows how rates are stored and where files live
class WeeklyReport:
    def build(self):
        rows = csv.reader(open("C:/rates/WY.csv"))      # hard-coded path, format, I/O
        ...

# Loose coupling: dependency passed in, abstracted behind an interface
class WeeklyReport:
    def __init__(self, rate_source: RateSource):
        self.rates = rate_source                          # any RateSource: CSV, DB, in-memory for tests
    def build(self):
        rows = self.rates.rows_for("WY")
```

The second version can be tested with a fake `RateSource`, can switch to a database without touching the report, and does not care about paths.

### DRY, KISS, YAGNI

- **DRY (Don't Repeat Yourself)**: every piece of knowledge has a single, authoritative representation. Duplicated logic drifts: three copies of the rounding rule will eventually round three ways. DRY is about knowledge, not text; two similar-looking functions serving different business rules should stay separate.
- **KISS (Keep It Simple, Stupid)**: prefer the simplest design that meets the requirement. Simplicity is measured by how quickly a new reader understands it, not by line count.
- **YAGNI (You Aren't Gonna Need It)**: do not build for hypothetical future requirements. The plug-in architecture for "other document formats we might support" is cost today for value that may never arrive.
- **Separation of concerns**: keep unrelated responsibilities (UI, business rules, persistence) in separate modules; the basis of layered architecture.
- **Principle of least astonishment**: a function called `save()` should not also send an email.

### SOLID

| Principle | Statement | Violation smell |
|---|---|---|
| **S**ingle Responsibility | A class should have one reason to change | `ReportBuilder` that queries the DB, computes totals, formats XLSX and emails it |
| **O**pen/Closed | Open for extension, closed for modification | A growing `if state == "WY" ... elif state == "OH"` chain in the pricing code |
| **L**iskov Substitution | Subtypes must be usable wherever the base type is | A `ReadOnlyRateTable` subclass whose `update()` throws |
| **I**nterface Segregation | Many small interfaces beat one fat one | Every exporter must implement `to_pdf`, `to_xlsx`, `to_epub` even if it supports one |
| **D**ependency Inversion | Depend on abstractions, not concretions; high-level policy should not depend on low-level detail | Business rules importing `pyodbc` directly |

```python
from abc import ABC, abstractmethod

class RateSource(ABC):                       # abstraction owned by the business layer
    @abstractmethod
    def rows_for(self, state: str) -> list[dict]: ...

class CsvRateSource(RateSource):             # detail, swappable
    def __init__(self, folder): self.folder = folder
    def rows_for(self, state):
        with open(f"{self.folder}/{state}.csv", newline="") as f:
            return list(csv.DictReader(f))

class InMemoryRateSource(RateSource):        # for tests
    def __init__(self, rows): self._rows = rows
    def rows_for(self, state): return [r for r in self._rows if r["state"] == state]
```

Adding a `SqlRateSource` is an extension (Open/Closed); the premium calculator depends on `RateSource` (Dependency Inversion); each source does one thing (Single Responsibility).

### Code smells and refactoring

Martin Fowler's catalogue names the symptoms: **long method**, **large class**, **long parameter list**, **duplicated code**, **feature envy** (a method more interested in another class's data), **shotgun surgery** (one change touches many classes), **divergent change** (one class changes for many reasons), **primitive obsession** (money as float, state as str), **magic numbers**. Each maps to refactorings: extract method, extract class, introduce parameter object, move method, replace conditional with polymorphism, replace magic number with constant. Refactoring is behaviour-preserving and safe only with tests.

> **Tip:** Principles conflict. DRY pushes toward abstraction; KISS and YAGNI push against it. A good engineer states the tension: "I duplicated this three-line rounding helper in two modules rather than create a shared package, because the modules are deployed separately and the rule is stable." The reasoning, not the rule, is what a senior reviewer wants to hear.

### Design by contract and defensive programming

Preconditions, postconditions and invariants make a module's obligations explicit; in Python, docstrings plus assertions or a validation library serve the role. Fail fast at boundaries (validate the CSV on import), trust inside (do not re-validate at every function), and never swallow exceptions silently.

### Try It Yourself

```python
# Before: low cohesion, tight coupling, magic numbers
def process(path):
    rows = list(csv.DictReader(open(path)))
    total = 0
    for r in rows:
        if float(r["amount"]) > 150000:
            total += float(r["amount"]) * 0.0055
        else:
            total += float(r["amount"]) * 0.006
    open("out.txt", "w").write(str(round(total)))

# After: single responsibilities, injected I/O, named rule
HIGH_TIER_THRESHOLD = 150_000
RATE_HIGH, RATE_LOW = 0.0055, 0.006

def premium(amount: float) -> float:
    return amount * (RATE_HIGH if amount > HIGH_TIER_THRESHOLD else RATE_LOW)

def total_premium(rows) -> float:
    return sum(premium(float(r["amount"])) for r in rows)

def run(read_rows, write_out):
    write_out(str(round(total_premium(read_rows()))))
```

### Quiz

1. Which combination describes good modular design?
- [ ] High coupling, high cohesion
- [x] Low coupling, high cohesion
- [ ] Low coupling, low cohesion
> Modules should be internally focused and externally independent.

2. Passing a flag that tells a function which of several behaviours to perform is which coupling type?
- [ ] Data coupling
- [x] Control coupling
- [ ] Common coupling
> The caller controls the callee's internal logic; split into separate functions instead.

3. A growing chain of `elif state == ...` in pricing code violates which SOLID principle most directly?
- [ ] Liskov Substitution
- [x] Open/Closed
- [ ] Interface Segregation
> Each new state requires modifying existing code rather than adding a new extension.

4. DRY is primarily about avoiding duplication of what?
- [ ] Lines of text
- [x] Knowledge or business rules
- [ ] Test cases
> Two identical-looking snippets serving different rules may legitimately stay separate.

### Exercises

1. **Name the smell** — A `Document` class has 42 methods covering parsing, rendering, emailing and logging. Name the smell, the violated principle and the refactoring.
<details><summary>Solution</summary>

Large class / divergent change; Single Responsibility; extract classes (`DocumentParser`, `DocumentRenderer`, `Mailer`) and have `Document` hold data only, or a thin facade coordinating them.

</details>

2. **Apply Dependency Inversion** — A `QualityReport` class calls `smtplib` directly to email results. Refactor the design in words or code.
<details><summary>Solution</summary>

```python
class Notifier(ABC):
    @abstractmethod
    def send(self, to: str, subject: str, body: str): ...

class SmtpNotifier(Notifier): ...      # wraps smtplib
class RecordingNotifier(Notifier):     # for tests: stores calls in a list
    ...

class QualityReport:
    def __init__(self, notifier: Notifier): self.notifier = notifier
```

`QualityReport` depends on the abstraction; production injects `SmtpNotifier`, tests inject `RecordingNotifier`.

</details>

3. **Liskov check** — `Square` extends `Rectangle` with `set_width` and `set_height` that both change both sides. Why is this a violation, and what is the fix?
<details><summary>Solution</summary>

Code written for `Rectangle` that sets width 4 and height 5 expects area 20; a `Square` gives 25, so the subtype breaks the base contract. Fix: do not make Square a subtype of a mutable Rectangle; use immutable shapes with an `area()` method, or a common `Shape` interface.

</details>

### Interview Questions

**Q: Explain cohesion and coupling with an example.**
Cohesion is how focused a module is on one purpose; coupling is how dependent it is on other modules. We want high cohesion so each module is understandable and testable alone, and low coupling so changes do not ripple. Example from a reporting tool: a `WeeklyReport` class that opened CSV files at hard-coded paths, computed totals and wrote XLSX was low-cohesion and tightly coupled to the file system, so it could not be unit tested and broke when rates moved to SQL Server. Splitting it into a `RateSource` abstraction, a pure `Totals` calculator and an `XlsxWriter`, with the report orchestrating them through interfaces, made each piece testable and let us swap the source in one line.

**Q: What is SOLID and which principle do you find most valuable?**
SOLID is five object-oriented design principles: Single Responsibility (one reason to change), Open/Closed (extend without modifying), Liskov Substitution (subtypes honour base contracts), Interface Segregation (small client-specific interfaces) and Dependency Inversion (depend on abstractions, and let high-level policy own them). I get the most daily value from Dependency Inversion because it is what makes code testable: injecting a `RateSource` or `Notifier` interface means business rules run in tests with fakes and in production with real adapters. Open/Closed is the one I apply most carefully, because premature extension points violate YAGNI; I add them at the second or third variation, not the first.

**Q: When is duplication acceptable?**
When the two pieces of code represent different knowledge that happens to look alike today and will change for different reasons, because merging them couples two business rules through a shared abstraction. Also when the cost of sharing is high: separately deployed services, or a helper so small that a shared package adds more overhead than a three-line copy. Sandi Metz's phrase "duplication is far cheaper than the wrong abstraction" captures it. My rule is to tolerate a second copy, and on the third occurrence, when I can see what genuinely varies, extract the abstraction with that variation as a parameter.

## Architecture styles (layered, client-server, MVC, microservices)

**Software architecture** is the set of structural decisions that are expensive to change: how the system is divided into components, how they communicate, where data lives and how the system is deployed. An architectural **style** is a reusable pattern of such decisions with known strengths and weaknesses. Interviewers expect you to describe the common styles, choose one for a scenario, and defend the trade-offs.

### Layered (n-tier)

Components are organised into horizontal layers, each using only the layer below. The classic three: **presentation** (UI or API), **business logic** (domain rules), **data access** (persistence), with an optional **database** tier.

```text
┌──────────────────────┐
│ Presentation         │  Excel add-in / web UI / REST API
├──────────────────────┤
│ Business logic       │  premium(), idleFiles(), scoreFile()
├──────────────────────┤
│ Data access          │  RateRepository, FileRepository
├──────────────────────┤
│ Database             │  SQL Server
└──────────────────────┘
```

Strengths: separation of concerns, easy to understand, each layer testable and replaceable. Weaknesses: changes that cut across layers (a new field in UI, logic and DB) touch everything; performance overhead from pass-through layers; "sinkhole" anti-pattern where layers do nothing but forward. **Hexagonal / ports-and-adapters** and **clean architecture** invert the dependency so business logic is in the centre and UI and database are adapters plugged into ports; the domain then depends on nothing.

### Client-server and multi-tier

A **client** requests services from a **server** over a network. Thick clients hold logic locally (a desktop rate calculator talking to a database); thin clients (browsers) leave logic on the server. Three-tier separates presentation (client), application server and database server onto different machines, which allows independent scaling and centralised business rules. Trade-offs: the server is a single point of failure and a scaling bottleneck unless replicated; network latency shapes the design.

### MVC and its relatives

**Model-View-Controller** separates data and rules (Model), presentation (View) and input handling (Controller). Web frameworks are MVC or a variant: Django calls it MTV (Model, Template, View), ASP.NET MVC and Rails are MVC, front-end frameworks use MVVM (Model-View-ViewModel with data binding) or unidirectional flows. The point is the same: the model knows nothing about the screen, so the same model serves a web page, an Excel export and an API.

```text
Request → Controller (validates, calls model) → Model (rules, data) → View (renders) → Response
```

### Monolith versus microservices

A **monolith** is one deployable unit. A **modular monolith** keeps strict module boundaries inside it. **Microservices** split the system into small, independently deployable services, each owning its data, communicating over HTTP/REST, gRPC or messages.

| | Monolith | Microservices |
|---|---|---|
| Deployment | One unit; simple | Many units; needs automation (CI/CD, containers, orchestration) |
| Data | One database, transactions easy | Database per service; eventual consistency, sagas |
| Scaling | Whole app | Per service, where it is needed |
| Team structure | One codebase, shared | Team per service, autonomous (Conway's Law) |
| Failure | One crash takes all | Isolation, but partial failures and network faults everywhere |
| Debugging | Stack trace | Distributed tracing, correlation IDs, centralised logs |
| Best for | Small teams, early products, unclear boundaries | Large organisations, independent scaling and release needs |

Martin Fowler's advice: "monolith first". Extract services when a boundary is proven and the pain of the monolith is real, not because microservices are fashionable. A five-person team running twelve services spends its life on infrastructure.

### Event-driven and message-based

Components communicate by publishing events to a broker (RabbitMQ, Kafka, Azure Service Bus) that others subscribe to. Producers do not know consumers, so coupling is minimal and new consumers can be added without changing producers; the cost is harder reasoning about order, duplicates and failures. A file-status change publishing `FileStatusChanged` that a notifier, an audit logger and a dashboard cache each consume is the natural fit.

### Other styles you should recognise

**Pipe-and-filter** (each stage transforms a stream; document pipelines such as Markdown → pandoc → DOCX → PDF are exactly this), **repository / blackboard** (components share a central data store), **serverless** (functions triggered by events, billed per invocation), **peer-to-peer**, and **service-oriented architecture (SOA)**, the enterprise predecessor of microservices with an enterprise service bus.

### Cross-cutting decisions

Every style still needs decisions on: **API style** (REST, GraphQL, gRPC), **authentication** (SSO, OAuth 2, JWT), **caching**, **data consistency** (ACID vs BASE, CAP trade-offs), **observability**, and **deployment** (VMs, containers, Kubernetes, PaaS). Architects document these as **Architecture Decision Records**: a short file per decision with context, options, decision and consequences, kept in the repository.

```text
ADR-004  Use a modular monolith for the production-tracking system
Context   Team of 3; one SQL Server; features share the ProductionFile aggregate.
Options   (a) Layered monolith  (b) Modular monolith  (c) Microservices per domain
Decision  (b): enforce module boundaries (files, quality, reporting) via packages and
          an internal API; single deployable; single database with per-module schemas.
Consequences  Fast delivery and simple ops now; clear seams if reporting must scale
          separately later; requires discipline to prevent cross-module imports (lint rule).
```

> **Interview note:** "Design a system for X" questions want a structure, not a style name: identify the actors and the main data, choose a style and say why, draw the components and the flow of one request, state where data lives, then discuss scaling, failure and security. Finishing with "if load grew 100×, I would first split off the reporting read model" shows you know where the seams are.

### Try It Yourself

```text
System sketch: Title-production tracking (modular monolith, layered inside)

Clients        Browser (React)          Excel add-in            Power BI (read replica)
                    │                       │                           │
API layer      FastAPI /files  /quality  /reports        (JWT via company SSO)
                    │
Modules        files ─────▶ quality ─────▶ reporting     (internal interfaces only)
                    │           │              │
Data           SQL Server: files.*  quality.*  reporting.* (schema per module)
Events         FileStatusChanged → notifier (email), audit log, dashboard cache
Ops            Docker image, GitHub Actions CI/CD, Azure App Service, App Insights
```

### Quiz

1. In a strict layered architecture, which layer may the business logic call?
- [ ] Presentation
- [x] Data access (the layer directly below)
- [ ] Any layer
> Each layer depends only on the one beneath it; hexagonal architecture inverts the data dependency.

2. Which is a core characteristic of microservices?
- [ ] Shared database across services
- [x] Independently deployable services each owning their data
- [ ] Single deployable unit
> Independent deployment and data ownership are what distinguish them from a modular monolith.

3. In MVC, which component contains the business rules?
- [x] Model
- [ ] View
- [ ] Controller
> The view renders and the controller routes input; rules live in the model.

4. What is an Architecture Decision Record?
- [ ] A UML deployment diagram
- [x] A short document capturing a decision, its context, options and consequences
- [ ] A Jira epic
> ADRs give future maintainers the "why" behind structural choices.

### Exercises

1. **Choose a style** — A three-person team must deliver a document-generation service used by two internal apps within six weeks. Recommend an architecture and justify it in four sentences.
<details><summary>Solution</summary>

A single deployable service (modular monolith) with a layered structure: REST API, generation module, template storage. It ships fastest, is simple to operate, and the team is too small to run many services. Keep templates and rates as data, and put the generation module behind an internal interface so it could become a separate service if load from the two apps diverges. Record the decision as an ADR with the extraction trigger stated.

</details>

2. **Identify the style** — Markdown files → pandoc → DOCX → LibreOffice → PDF → pikepdf stamping. Which style, and what are its strengths?
<details><summary>Solution</summary>

Pipe-and-filter. Each stage is independent and replaceable, stages can be tested alone with sample input, and new stages (for example EPUB output) can be added without changing others. Weakness: error handling and shared context across stages need care.

</details>

3. **Write an ADR** — Record the decision to use an event (FileStatusChanged) rather than direct calls for notifications.
<details><summary>Solution</summary>

```text
ADR-007  Publish FileStatusChanged event for downstream reactions
Context   Notifier, audit log and dashboard cache all react to status changes; direct calls
          couple the files module to each and slow the request.
Options   (a) direct calls (b) in-process event bus (c) message broker
Decision  (b) in-process event bus now; interface allows (c) later.
Consequences  Files module unaware of consumers; adding consumers is additive; handlers
          must be idempotent; failures in handlers logged, not propagated to the user.
```

</details>

### Interview Questions

**Q: Monolith or microservices for a new product?**
Monolith first, structured as a modular monolith with explicit module boundaries and a single deployable, because early on the domain boundaries are unknown and the team is small; microservices multiply operational cost (deployment, networking, observability, data consistency) before the benefits of independent scaling and team autonomy exist. I would keep modules communicating through internal interfaces and events so that a module can be extracted into a service when there is evidence: divergent scaling needs, a team that must release independently, or a component with different technology needs. Fowler's "monolith first" and the many public stories of teams consolidating services back support this.

**Q: Explain the layered architecture and its main weakness.**
Layered architecture organises code into presentation, business logic and data access (plus the database), each layer calling only the one below, which gives separation of concerns, testability per layer and the ability to replace a layer. Its main weakness is that most feature changes cut vertically through all layers, so a new field touches UI, rules, repository and schema together, and the strict layering can degrade into pass-through "sinkhole" code. It also lets the domain depend on the database layer. Hexagonal or clean architecture addresses that by putting the domain at the centre with ports, and organising code by feature (vertical slices) reduces the cross-layer churn.

**Q: How would you design a system that generates thousands of branded documents per night?**
A pipeline style: a scheduler enqueues jobs, worker processes pull from a queue and run the stages (data fetch, template merge, DOCX build, PDF conversion, stamping, upload), writing results and status to a job table and publishing a completion event. Workers are stateless so they scale horizontally; the queue provides retries and back-pressure; each stage is idempotent so a crashed job can be rerun. Templates and rate data are versioned in Git and referenced by version in each job for auditability. Observability is per-job logs with a correlation ID and a dashboard of throughput and failure rate; I would start with one worker and a database-backed queue and move to a broker only if throughput demands it.

# LEVEL: Advanced

## Testing levels & strategies (unit/integration/system/UAT, TDD)

Testing is how engineering earns the right to say "it works". Professional testing is organised by **level** (how much of the system is under test), by **type** (what quality is being checked) and by **strategy** (how tests are designed, who writes them and when). This chapter covers the four classic levels, the test pyramid, black-box and white-box design techniques, and test-driven development.

### The four levels

| Level | Scope | Who | Basis | Tools (Python / JS) |
|---|---|---|---|---|
| **Unit** | One function or class in isolation; dependencies faked | Developers | Detailed design, code | pytest, unittest / Jest, Vitest |
| **Integration** | Interaction between modules or with real dependencies (DB, API, file system) | Developers, SDETs | Architecture, interfaces | pytest with a test DB, Testcontainers |
| **System** | The whole deployed system end to end against requirements | QA / test team | SRS, use cases | Playwright, Selenium, Postman, Cypress |
| **Acceptance (UAT)** | Does it meet business needs; ready to release? | Users, product owner | Acceptance criteria, business process | Manual scripts, Gherkin/Behave, pilot runs |

The V-model pairs each level with a development phase; Agile runs all four inside every sprint. **Regression** testing (re-running existing tests after a change) and **smoke** testing (a quick check that the build is not broken) cut across levels.

### The test pyramid

Mike Cohn's pyramid says: many fast unit tests at the base, fewer integration tests, few slow end-to-end UI tests at the top. Unit tests run in milliseconds and pinpoint failures; UI tests take seconds to minutes, are brittle and fail for many reasons. The **ice-cream cone** anti-pattern inverts it: hundreds of manual and UI tests, few unit tests, slow feedback. A reasonable target for a service: 70% unit, 20% integration, 10% end-to-end by count.

### Test types

**Functional** (does it do the right thing), **performance** (load, stress, soak, spike), **security** (penetration, dependency scanning), **usability**, **compatibility** (browsers, Excel versions, PDF readers), **accessibility** (WCAG; a fillable PDF with a wrong tab order fails), **installation/deployment**, and **exploratory** testing, where a skilled tester probes without a script and finds what scripted tests miss.

### Black-box design techniques

- **Equivalence partitioning**: divide inputs into classes that should behave alike; test one from each. Policy amounts 0–100 000, 100 001–150 000, over 150 000 are three partitions.
- **Boundary value analysis**: defects cluster at edges. Test 100 000, 100 001, 150 000, 150 001.
- **Decision tables**: for combinations of conditions, enumerate rules so every combination has an expected result.
- **State transition**: test each valid transition and each invalid one (Closed → Escalated must be rejected).
- **Error guessing**: empty file, header only, 10 000 rows, Unicode agent names, dates in wrong format.

### White-box techniques and coverage

**Statement**, **branch** (decision) and **path** coverage measure how much code the tests execute; branch coverage is the useful minimum. Coverage tools: `coverage.py`, `pytest-cov`, Istanbul/nyc. 100% coverage proves only that lines ran, not that assertions were meaningful; a test with no assertions has full coverage of what it calls. Use coverage to find untested areas, not as a target.

### Test-driven development

TDD is a design discipline: write a failing test (**red**), write the minimum code to pass (**green**), then **refactor** with the test as a safety net. Cycles are minutes long.

```python
# test_premium.py  (written first)
from rates import premium

def test_low_tier_uses_low_rate():
    assert premium(100_000) == 600.00           # 100k * 0.006

def test_boundary_just_above_threshold_uses_high_rate():
    assert premium(150_001) == 825.01           # rounds to cents

def test_negative_amount_rejected():
    import pytest
    with pytest.raises(ValueError):
        premium(-1)
```

```python
# rates.py  (minimum to pass, then refactored)
THRESHOLD, RATE_LOW, RATE_HIGH = 150_000, 0.006, 0.0055

def premium(amount: float) -> float:
    if amount < 0:
        raise ValueError("amount must be non-negative")
    rate = RATE_HIGH if amount > THRESHOLD else RATE_LOW
    return round(amount * rate, 2)
```

Benefits: tests exist for everything, design is driven by usage (hard-to-test code gets simplified), and refactoring is safe. Costs: slower at first, awkward for exploratory or UI-heavy work. **BDD** extends TDD outward with Gherkin scenarios agreed with the business, automated with Behave, Cucumber or SpecFlow.

### Test doubles

Gerard Meszaros' terms: a **dummy** is passed but never used, a **stub** returns canned answers, a **spy** records calls, a **mock** asserts on expected calls, a **fake** is a working lightweight implementation (in-memory repository). Python's `unittest.mock` and `pytest-mock` create them; over-mocking couples tests to implementation, so prefer fakes at architectural boundaries and real objects inside.

### Test plan and exit criteria

An IEEE 829-style test plan states scope, levels, types, techniques, environments, data, roles, schedule, entry and exit criteria, and risks. Exit criteria are numeric: all Must requirements have passing tests, no open Critical or High defects, branch coverage at least 80% for business modules, performance targets met on production-sized data.

> **Warning:** A flaky test (passes and fails without code change) is worse than no test: the team learns to ignore red. Quarantine it immediately, fix the root cause (timing, shared state, order dependence, real network) and never add a blind retry as the permanent fix.

### Try It Yourself

```python
import pytest
from idle import idle_hours   # business-hours idle calculation, weekends excluded

@pytest.mark.parametrize("last,now,expected", [
    ("2026-09-14 09:00", "2026-09-14 17:00", 8),     # same weekday
    ("2026-09-11 17:00", "2026-09-14 09:00", 16),    # Friday evening to Monday morning
    ("2026-09-12 10:00", "2026-09-13 10:00", 0),     # Saturday to Sunday
])
def test_idle_hours_excludes_weekends(last, now, expected):
    assert idle_hours(last, now) == expected

def test_threshold_boundary():
    assert idle_hours("2026-09-08 09:00", "2026-09-10 09:00") == 48
```

### Quiz

1. Which level tests interaction between modules or with a real database?
- [ ] Unit
- [x] Integration
- [ ] Acceptance
> Unit tests isolate; integration tests check that pieces work together.

2. Which technique focuses on values at the edges of input ranges?
- [ ] Equivalence partitioning
- [x] Boundary value analysis
- [ ] Error guessing
> Defects cluster at boundaries such as 150 000 versus 150 001.

3. In TDD, what is the correct order?
- [ ] Code, test, refactor
- [x] Failing test, minimal code, refactor
- [ ] Refactor, test, code
> Red, green, refactor; the failing test proves the test can fail.

4. What does 100% statement coverage guarantee?
- [ ] The code is correct
- [x] Every statement executed at least once during tests
- [ ] Every branch was tested
> Coverage measures execution, not correctness of assertions or branch combinations.

### Exercises

1. **Design tests** — Amount tiers are 0–100 000 (0.6%), 100 001–150 000 (0.58%), above 150 000 (0.55%). List the partitions and boundary values to test.
<details><summary>Solution</summary>

Partitions: negative (invalid), 0–100 000, 100 001–150 000, > 150 000. Boundaries: -1, 0, 1, 100 000, 100 001, 150 000, 150 001, and a very large value such as 10 000 000. Also non-numeric input and None.

</details>

2. **Decision table** — Build the table for "send idle alert": conditions are idle > 48h, status is not Closed, agent not on leave.
<details><summary>Solution</summary>

```text
Rule            R1   R2   R3   R4
idle > 48h       Y    Y    Y    N
status != Closed Y    Y    N    -
agent not leave  Y    N    -    -
Action: alert    Y    N*   N    N
* R2: alert the team lead instead of the agent
```

Each rule becomes one test case.

</details>

3. **Write the pyramid** — For a FastAPI service that prices policies from a SQL rate table, state what you would test at each level with rough counts.
<details><summary>Solution</summary>

Unit (about 60): pricing functions, rounding, validation, per-state rules with an in-memory RateSource. Integration (about 15): repository against a test SQL Server in Docker, API endpoint with the real app and test DB. End-to-end (about 5): full quote via HTTP on staging, one per state plus one error path. Plus performance: 1 000 quotes under 60 s.

</details>

### Interview Questions

**Q: Explain the difference between unit, integration, system and acceptance testing.**
Unit tests check a single function or class in isolation with dependencies replaced by doubles; they are fast, numerous and written by developers, and they localise failures. Integration tests check that units work together and with real infrastructure such as a database or an external API, catching contract and configuration errors. System tests exercise the whole deployed application end to end against the requirements, usually by a test team through the UI or API. Acceptance testing asks whether the system meets the business need and is done by or with users against acceptance criteria before release. I structure them as a pyramid, and for a pricing service that meant sixty unit tests, fifteen integration tests against a Dockerised SQL Server and five end-to-end scenarios.

**Q: What is TDD and what are its benefits and drawbacks?**
TDD is writing a small failing test first, the minimal code to pass it, then refactoring, in cycles of a few minutes. The benefits are complete test coverage as a by-product, designs that are decoupled because they had to be testable, immediate feedback, and the confidence to refactor. Drawbacks are a slower start, the temptation to test implementation details, and poor fit for exploratory work, UI layout or code you plan to throw away. I use it strictly for business rules such as rate calculations, where the examples come from a published manual and each becomes a test, and more loosely for glue code, where I write tests after a spike but before merging.

**Q: How do you decide what to mock?**
I mock at architectural boundaries where the real thing is slow, non-deterministic or has side effects: network calls, email, clocks, file systems, third-party APIs. Inside the boundary I use real objects, because mocking collaborators couples the test to the implementation and makes refactoring break tests that should still pass. I prefer fakes with real behaviour, such as an in-memory repository, over mocks that assert call sequences, and I keep one integration test per boundary to prove the fake matches reality. A test that needs five mocks usually reveals a design with too many dependencies, which is a signal to refactor rather than to mock harder.

## Code review & quality metrics

Code review is the most effective defect-finding practice per hour that we have evidence for, and it is also how teams share knowledge and keep a consistent style. Quality metrics turn "this code is bad" into numbers that can be tracked and gated. This chapter covers how to run reviews that help, what static analysis and metrics can and cannot tell you, and the coding standards that make both easier.

### Why review

Fagan's inspection studies at IBM (1976) and later work at Microsoft and Google show reviews find 60–90% of defects when done well, cheaper than testing finds them, and that the secondary benefits, knowledge spread, mentoring and shared ownership, are why teams keep doing it. Modern review is asynchronous on pull requests rather than in meetings, and small changes are reviewed in minutes.

### What to review, in order

1. **Intent**: does the change do what the issue asks, and only that?
2. **Correctness**: logic, edge cases, error handling, concurrency, off-by-one, rounding, time zones.
3. **Tests**: do they exist, do they test behaviour, would they fail if the logic broke?
4. **Design**: responsibilities, coupling, naming, duplication, fit with existing patterns.
5. **Security and data**: injection, secrets, PII in logs, permissions.
6. **Readability**: will the next maintainer understand it without the author?
7. **Style**: leave to the formatter and linter; do not spend human attention on it.

Google's engineering practices guide sets the bar as "the change improves the overall code health, even if not perfect", and asks reviewers to respond within one business day. Comment prefixes such as *nit:*, *question:*, *suggestion:* and *blocking:* signal severity so authors know what must change.

### Author responsibilities

Small changes (under 400 lines), a description with the why and how to test, a self-review of the diff before requesting review, a green CI, and responsive follow-up. **Pair programming** and **mob programming** are review in real time and can replace asynchronous review for high-risk work.

### Static analysis and linters

Tools read the code without running it and flag errors, smells, style and security issues on every commit:

| Purpose | Python | JavaScript / TypeScript | Multi-language |
|---|---|---|---|
| Formatting | Black, Ruff format | Prettier | EditorConfig |
| Linting | Ruff, Flake8, Pylint | ESLint | |
| Type checking | mypy, Pyright | TypeScript compiler | |
| Security | Bandit, pip-audit | npm audit, eslint-plugin-security | Semgrep, CodeQL, Snyk |
| Quality platform | | | SonarQube / SonarCloud, Codacy |

Run them in a pre-commit hook for speed and in CI as the gate. A formatter removes style debates entirely; a type checker catches whole classes of bugs before tests run.

### Metrics that mean something

| Metric | What it measures | Rule of thumb |
|---|---|---|
| **Cyclomatic complexity** (McCabe) | Number of independent paths through a function: decisions + 1 | Under 10 per function; above 20 needs splitting |
| **Cognitive complexity** (Sonar) | How hard code is to read: nesting weighted | Under 15 |
| **Lines per function / class** | Size | Functions under ~40 lines; classes under ~500 |
| **Coupling metrics** (afferent/efferent, instability) | Dependencies in and out of a module | Stable core, unstable edges |
| **Test coverage** | Executed lines/branches | Track trend; gate new code at 80% branch |
| **Duplication** | Copy-pasted blocks | Under 3% |
| **Defect density** | Defects per KLOC or per module | Find hot spots |
| **Code churn** | Lines changed per file over time | Churn × complexity = risk |
| **Technical debt ratio** | Estimated remediation effort ÷ development effort (Sonar) | Under 5% rated A |

```python
# cyclomatic complexity 6: each if/elif/and/or/for adds a path
def classify(file):
    if file.status == "Closed":            # +1
        return "done"
    if file.idle_hours > 72 and file.priority == "High":   # +2 (if, and)
        return "critical"
    elif file.idle_hours > 48:             # +1
        return "warning"
    for note in file.notes:                # +1
        if "client" in note.lower():       # +1
            return "client-waiting"
    return "ok"
```

Tools: `radon cc -s src/` for Python, ESLint's `complexity` rule, SonarQube for everything. The classic finding (Nagappan, Microsoft) is that no single metric predicts defects well, but complexity combined with churn and organisational factors does.

### Coding standards

A written standard covers naming, layout (delegated to the formatter), error handling, logging, comments and docstrings, dependency rules and commit conventions. PEP 8 for Python, the Google or Airbnb style guides for JavaScript, and the Microsoft guidelines for C# are starting points; adopt one and automate it. Standards belong in the repository with the linter config, not in a wiki nobody reads.

> **Tip:** Review the tests first. If the tests are good, the implementation is probably fine and you can skim it; if the tests are weak or missing, the implementation needs the closest reading. This single habit doubles the effectiveness of a review hour.

### Review anti-patterns

Rubber-stamp approvals ("LGTM" on a 900-line PR in two minutes), nitpicking style while missing logic, reviews that sit for days, authors defending instead of discussing, drive-by rewrites disguised as review, and using review to gate people rather than code. Track review turnaround and PR size as team metrics; both predict delivery speed.

### Try It Yourself

```yaml
# .pre-commit-config.yaml — run formatter, linter, type checker and secret scan before every commit
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.9
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.11.2
    hooks:
      - id: mypy
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks:
      - id: gitleaks
```

### Quiz

1. What is the cyclomatic complexity of a function with three independent `if` statements and no loops?
- [ ] 3
- [x] 4
- [ ] 8
> Complexity is decisions + 1; three decisions give four paths.

2. Which should human reviewers spend the least time on?
- [ ] Correctness
- [x] Formatting and style
- [ ] Tests
> Formatters and linters handle style automatically and consistently.

3. What is the research-backed limit for an effective review?
- [ ] 2000 lines in one sitting
- [x] Roughly 400 lines and under an hour
- [ ] 50 lines per day
> Defect-finding rates drop sharply beyond about 400 lines or 60 minutes.

4. Which combination best predicts defect-prone modules?
- [ ] Line count alone
- [x] Complexity combined with churn
- [ ] Number of comments
> Frequently changed, complex code is where defects concentrate.

### Exercises

1. **Reduce complexity** — Refactor a function with nested `if`s for state, policy type and simultaneous-issue flag (complexity 14) so no function exceeds 5.
<details><summary>Solution</summary>

Extract each concern: `base_rate(state, policy_type)` using a dictionary lookup instead of branches, `simultaneous_discount(flag, amount)` as a separate function, and a top-level `premium()` that composes them with guard clauses instead of nesting. Table-driven lookups remove most branches entirely.

</details>

2. **Write review comments** — A PR adds `total = sum(float(r["amt"]) for r in rows)` for money totals. Write two review comments with severity prefixes.
<details><summary>Solution</summary>

```text
blocking: float accumulates rounding error on money; use Decimal (quantize to cents) or integer cents.
question: what happens when "amt" is empty or missing for a row? Should we reject the file or skip the row and log it?
```

</details>

3. **Set quality gates** — Propose a SonarQube quality gate for new code on a financial calculation service.
<details><summary>Solution</summary>

```text
New code: coverage ≥ 85% · duplicated lines ≤ 3% · 0 bugs · 0 vulnerabilities ·
security hotspots reviewed 100% · maintainability rating A · cognitive complexity per function ≤ 15
```

</details>

### Interview Questions

**Q: How do you conduct a code review?**
I read the description and the linked issue to know the intent, then the tests to see what behaviour is claimed, then the implementation, asking whether it does only what was asked, handles edge cases and errors, and fits the existing design. I leave style to the linter and mark each comment with a severity so the author knows what blocks approval. I try to respond within hours, keep comments about the code rather than the person, and offer a suggestion when I ask for a change. If the PR is too large to review well I ask for a split rather than skim it. On approval I check that CI is green and that the change is squash-merged with a clear title.

**Q: What code quality metrics do you track and how do you use them?**
Cyclomatic or cognitive complexity per function to find code that needs splitting, test coverage on new code as a gate rather than a target, duplication percentage, and churn per file to spot hot spots where complexity and frequent change coincide. At team level I watch PR size and review turnaround, because they predict delivery speed and defect rates better than most code metrics. I use SonarQube's quality gate on new code so the codebase improves incrementally without demanding a rewrite of legacy modules. What I avoid is ranking developers by metrics, which changes behaviour for the worse without improving the code.

**Q: What is cyclomatic complexity and why does it matter?**
It is McCabe's count of linearly independent paths through a function, computed as the number of decision points plus one; every `if`, `elif`, loop, `case`, `and` and `or` adds one. It matters because it approximates both how hard the code is to understand and the minimum number of test cases needed to cover every branch. Functions above ten are hard to test thoroughly and are where defects cluster; above twenty they should be split. The usual fixes are guard clauses, table-driven lookups instead of branch chains, extracting functions, and polymorphism for type-based conditionals.

## CI/CD pipelines

**Continuous integration** is the practice of merging every developer's work into the shared mainline at least daily, with each merge verified by an automated build and test run. **Continuous delivery** extends that so every change that passes the pipeline is releasable, with a manual decision to release. **Continuous deployment** removes the manual step: every green change goes to production. The pipeline is the automated path a change takes from commit to production, and it is where quality gates actually get enforced.

### Pipeline stages

```text
commit ─▶ build ─▶ static checks ─▶ unit tests ─▶ package ─▶ integration tests ─▶ deploy staging
       ─▶ e2e / performance / security tests ─▶ (approval) ─▶ deploy production ─▶ verify / monitor
```

Each stage is a gate: failure stops the pipeline and notifies the author. Fast stages run first so most failures are reported in minutes. The build artefact (wheel, container image, DOCX build) is created **once** and promoted through environments unchanged, which guarantees that what was tested is what ships.

### CI practices

- Trunk-based or short-lived branches, merged at least daily.
- Every commit triggers the pipeline; the pipeline is the only way to build and deploy.
- Under ten minutes for the commit stage; longer suites run in parallel or in a later stage.
- A red mainline is the team's top priority; nobody merges onto a broken build.
- Tests are deterministic; flaky tests are quarantined and fixed.
- The pipeline definition lives in the repository as code (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `azure-pipelines.yml`).

### A full pipeline

```yaml
# .github/workflows/pipeline.yml
name: Pipeline
on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12", cache: pip }
      - run: pip install -r requirements-dev.txt
      - run: ruff check . && ruff format --check .
      - run: mypy src
      - run: pytest tests/unit -q --cov=src --cov-fail-under=80

  integration:
    needs: check
    runs-on: ubuntu-latest
    services:
      db:
        image: postgres:16
        env: { POSTGRES_PASSWORD: test }
        ports: ["5432:5432"]
        options: --health-cmd pg_isready --health-interval 5s --health-retries 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12", cache: pip }
      - run: pip install -r requirements-dev.txt
      - run: pytest tests/integration -q
        env: { DATABASE_URL: "postgresql://postgres:test@localhost:5432/postgres" }

  package:
    needs: integration
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: "${{ github.actor }}", password: "${{ secrets.GITHUB_TOKEN }}" }
      - uses: docker/build-push-action@v6
        with: { push: true, tags: "ghcr.io/${{ github.repository }}:${{ github.sha }}" }

  deploy-staging:
    needs: package
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: ./deploy.sh staging "${{ github.sha }}"
      - run: ./smoke-test.sh https://staging.example.internal

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production        # requires reviewer approval in repo settings
    steps:
      - run: ./deploy.sh production "${{ github.sha }}"
```

The `production` environment is configured with required reviewers, which is the manual gate of continuous delivery; remove it and you have continuous deployment.

### Environments and promotion

Typical chain: **dev** (per developer or per branch preview), **test/QA**, **staging** (production-like, production-sized data, same infrastructure), **production**. Environment differences are the classic source of "works on my machine"; containers and infrastructure-as-code (Terraform, Bicep, Pulumi) make them identical. Configuration and secrets are injected per environment, never baked into the artefact (the Twelve-Factor App's config principle).

### Deployment strategies

| Strategy | How | Rollback | Use |
|---|---|---|---|
| Recreate | Stop old, start new | Redeploy old | Internal tools with downtime windows |
| Rolling | Replace instances gradually | Roll back remaining | Stateless services |
| Blue-green | Two identical environments; switch traffic | Switch back | Instant rollback, needs double capacity |
| Canary | Route 1–5% of traffic to new version, watch metrics, ramp | Route to old | Risky changes; needs good monitoring |
| Feature flags | Deploy dark, enable per user segment | Flip flag | Decouples deploy from release |

Database changes need special care: **expand and contract** (add the new column, migrate, switch code, drop the old column in a later release) keeps every step backward compatible so rollback is possible.

### Measuring the pipeline

The DORA four keys: **deployment frequency**, **lead time for changes** (commit to production), **change failure rate**, and **time to restore service**. Elite teams deploy on demand with lead times under a day and restore in under an hour. These are outcome metrics a pipeline should improve; if a "CI/CD" project does not move them, it is automation without delivery.

> **Interview note:** Be ready to draw your pipeline on a whiteboard and to explain one decision in it: why the integration tests use a real database in a container, why the artefact is built once, or why production has a manual gate. Interviewers use CI/CD questions to see whether you have operated a pipeline or only read about one.

### Try It Yourself

```yaml
# Minimal CI for a document-build repository: lint Markdown, build the DOCX and PDF, keep the artefacts
name: Build docs
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g markdownlint-cli && markdownlint "docs/**/*.md"
      - run: sudo apt-get update && sudo apt-get install -y pandoc libreoffice-writer
      - run: pandoc docs/*.md --reference-doc=templates/letterhead.dotx -o build/handbook.docx
      - run: soffice --headless --convert-to pdf --outdir build build/handbook.docx
      - uses: actions/upload-artifact@v4
        with: { name: handbook, path: build/, retention-days: 30 }
```

### Quiz

1. What distinguishes continuous delivery from continuous deployment?
- [x] Delivery has a manual release decision; deployment releases every green change automatically
- [ ] Delivery is for libraries, deployment for web apps
- [ ] They are synonyms
> Both require an always-releasable mainline; the difference is the final human gate.

2. Why build the artefact once and promote it through environments?
- [ ] To save disk space
- [x] So the exact thing tested is the exact thing deployed
- [ ] Because containers cannot be rebuilt
> Rebuilding per environment risks subtle differences between what was tested and what ships.

3. Which deployment strategy sends a small percentage of real traffic to the new version first?
- [ ] Blue-green
- [x] Canary
- [ ] Recreate
> Canary releases limit blast radius while metrics are compared.

4. Which is one of the DORA four key metrics?
- [ ] Lines of code per developer
- [x] Lead time for changes
- [ ] Number of pipelines
> The four are deployment frequency, lead time, change failure rate and time to restore.

### Exercises

1. **Order the stages** — Arrange: e2e tests, lint, unit tests, deploy staging, build image, integration tests, deploy production, manual approval. Justify the position of lint.
<details><summary>Solution</summary>

Lint → unit tests → build image → integration tests → deploy staging → e2e tests → manual approval → deploy production. Lint runs first because it is the fastest check and fails most cheaply; anything failing lint should not consume test minutes.

</details>

2. **Safe schema change** — You must rename column `agent_code` to `agent_id` without downtime. Write the expand-and-contract steps.
<details><summary>Solution</summary>

```text
Release 1: add agent_id column; code writes both, reads agent_code.
Migration: backfill agent_id from agent_code.
Release 2: code reads agent_id, still writes both.
Release 3: code stops writing agent_code.
Release 4: drop agent_code.
Each step is backward compatible with the previous release, so rollback is always possible.
```

</details>

3. **Add a gate** — Modify the chapter's pipeline so production deploys only on tags matching `v*` and after the staging smoke test passes.
<details><summary>Solution</summary>

```yaml
  deploy-production:
    needs: deploy-staging
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh production "${{ github.ref_name }}"
```

Change the `on:` block to include `push: tags: ["v*"]` so tag pushes trigger the workflow.

</details>

### Interview Questions

**Q: Explain CI, CD and the pipeline you would build for a new service.**
Continuous integration means every developer merges to the mainline at least daily and each merge is verified by an automated build and tests, keeping integration problems small. Continuous delivery keeps the mainline always releasable through a pipeline that builds an artefact once, runs progressively slower and broader checks, deploys to a production-like staging environment and leaves a manual release decision; continuous deployment removes that decision. For a new service I would build: lint and type check, unit tests with coverage gate, container build pushed to a registry tagged with the commit SHA, integration tests against a database service container, deploy to staging with a smoke test, then a protected production environment with a canary rollout and automatic rollback on error-rate alerts.

**Q: How do you handle database migrations in a zero-downtime deployment?**
By making every schema change backward compatible with the currently running code using expand-and-contract: add new structures first, deploy code that writes to both old and new, backfill data, deploy code that reads from the new, stop writing the old, and only then drop the old structure in a later release. Migrations run as a pipeline step before the application deploy, are versioned with a tool such as Alembic, Flyway or EF Migrations, and are tested against a copy of production data in staging. I never combine a destructive migration with the code change that depends on it, because that makes rollback impossible.

**Q: What makes a pipeline slow and how do you fix it?**
Common causes are running everything sequentially, re-installing dependencies on every run, long end-to-end suites in the commit stage, and building artefacts repeatedly. Fixes: cache dependencies and Docker layers, parallelise independent jobs and shard test suites, move slow suites to a later stage that runs after a fast commit stage gives feedback, build the artefact once, and run only tests affected by the change where tooling supports it. I also track pipeline duration as a metric with a target under ten minutes for the commit stage, because slow pipelines push developers to batch changes, which increases risk and defeats the purpose of CI.

## Configuration & release management

**Software configuration management** (SCM) is the discipline of identifying, controlling, tracking and auditing everything that makes up a software product: code, build scripts, dependencies, configuration, documentation and the environments they run in. **Release management** is the planning, scheduling and controlling of moving that product into environments and to users. Between them they answer the questions auditors, clients and your future self ask: what exactly is running, what changed, who approved it and can we reproduce it.

### The four SCM functions

| Function | Meaning | Practice |
|---|---|---|
| **Identification** | Name and version every configuration item (CI) | Repos, tags, semantic versions, artefact IDs, environment definitions |
| **Control** | Changes go through an agreed process | Pull requests, change requests, approvals, change advisory board for production |
| **Status accounting** | Know the state of every item at any time | Release notes, deployment records, changelog, tickets linked to commits |
| **Audit** | Verify the delivered product matches its documented configuration | Reproducible builds, checksums, environment drift checks |

A **baseline** is a formally reviewed and agreed set of configuration items that serves as the basis for further development and can be changed only through change control; in practice, a tagged commit plus its pinned dependencies and configuration.

### Versioning

**Semantic Versioning 2.0** (`MAJOR.MINOR.PATCH`): increment MAJOR for incompatible changes, MINOR for backward-compatible features, PATCH for backward-compatible fixes, with optional pre-release (`2.1.0-rc.1`) and build metadata (`+build.45`). **Calendar versioning** (`2026.09`) suits products released on a schedule. Every deployable artefact carries its version and the Git SHA it was built from, exposed at runtime (`/version` endpoint, `--version` flag, document metadata) so anyone can trace a running system to its source.

### Dependency management

Applications pin exact versions through a lockfile (`package-lock.json`, `uv.lock`, `poetry.lock`, `requirements.txt` with hashes) so builds are reproducible; libraries declare ranges so consumers can resolve. Dependencies are scanned for known vulnerabilities (Dependabot, pip-audit, npm audit, Snyk) and updated through reviewed PRs. A **software bill of materials** (SBOM, in CycloneDX or SPDX format) lists every component in a release; regulated customers increasingly require it.

### Environments and configuration

Configuration that varies by environment (connection strings, feature flags, API endpoints, log levels) is separated from code and injected at deploy time via environment variables, mounted files or a configuration service; secrets come from a vault (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault, GitHub Environments). **Infrastructure as code** defines environments in versioned files (Terraform, Bicep, CloudFormation, Ansible) so staging and production are provably the same shape and drift is detectable. Immutable container images built once are the strongest guarantee.

```yaml
# config/production.yaml — checked in; no secrets, only references
database:
  host: sql-prod.internal
  name: production
  password_ref: keyvault://prod-kv/sql-password
features:
  idle_alerts: true
  new_pricing_engine: false       # dark launch; flipped by release manager
logging:
  level: INFO
```

### Release planning

A **release plan** states scope (which stories and fixes), version, target date, environments and promotion criteria, risks, rollback plan, communication plan and owners. Release **types**: major (new capability, possibly breaking), minor, patch/hotfix, and emergency. **Release trains** depart on a fixed cadence (every two weeks) with whatever is ready, which removes the temptation to hold the train for one more feature. **Feature freeze** and **code freeze** mark when scope and code stop changing before a release.

### Release notes and changelog

A `CHANGELOG.md` in Keep a Changelog format groups entries under Added, Changed, Deprecated, Removed, Fixed and Security per version, newest first. Customer-facing release notes translate it into impact: what users can now do, what they must change, known issues. Both are generated from merged PR titles where the team uses Conventional Commits, then edited.

```text
## [2.1.0] - 2026-09-15
### Added
- Idle-file report with weekend-aware thresholds (#41)
- Email digest for team leads at 08:00 local (#45)
### Fixed
- Weekly XLSX export dropped the final row (#88)
### Security
- Bumped openpyxl to 3.1.5 (CVE-2024-... )
```

### Change control and the CAB

In ITIL-style organisations, production changes are logged as change requests with risk classification: **standard** (pre-approved, low risk, such as a rate-table update through the tested pipeline), **normal** (assessed by a change advisory board), and **emergency**. The goal of DevOps is to make almost every change a standard change by proving the pipeline's controls, so the CAB reviews the process, not each deployment.

> **Tip:** Treat documents and data the same way as code. A filed rate manual, a letterhead template and a policy handbook each get a version, a changelog and a tag. When a client asks "which version of the handbook did the March print run use", `git show v3.2.0:CHANGELOG.md` is a better answer than a search through email.

### Rollback and hotfix procedure

Every release has a tested rollback: redeploy the previous artefact (blue-green switch, previous image tag) and, if the schema changed, the expand-contract discipline ensures the previous code still runs. A hotfix branches from the release tag, gets the minimal fix and tests, is released as a PATCH version, and is merged back to `main` so it is not lost in the next release.

### Try It Yourself

```text
Release checklist  v2.1.0  (owner: Ali, release manager)

[ ] Scope frozen: milestone 2.1.0 has 0 open issues or they are moved to 2.2.0
[ ] CHANGELOG.md updated; version bumped in pyproject.toml; git tag -a v2.1.0
[ ] Pipeline green on the tag; artefact ghcr.io/ops/tracker:2.1.0 (sha 3f4e5d6) recorded
[ ] Staging deploy + smoke + UAT sign-off by QA lead (ticket OPS-210)
[ ] Migration 0007 reviewed as backward compatible; rollback = redeploy 2.0.3
[ ] Change request CR-1188 approved as standard change
[ ] Release notes sent to team leads; runbook updated; monitoring dashboard opened
[ ] Production deploy 06:00 PKT; canary 10% for 30 min; full rollout; verify /version = 2.1.0
```

### Quiz

1. Which SCM function ensures the delivered product matches its documented configuration?
- [ ] Identification
- [ ] Control
- [x] Audit
> Audit verifies; identification names; control governs change; status accounting reports.

2. In SemVer, a backward-compatible new feature increments which part?
- [ ] MAJOR
- [x] MINOR
- [ ] PATCH
> PATCH is for fixes; MAJOR is for incompatible changes.

3. Where should a production database password live?
- [ ] In `config/production.yaml` in the repository
- [x] In a secrets vault, referenced by the configuration
- [ ] In the Docker image
> Secrets are injected at deploy time and never committed or baked into artefacts.

4. What is the purpose of a release train?
- [x] Ship on a fixed cadence with whatever is ready instead of waiting for features
- [ ] Deploy all services at once
- [ ] Replace version numbers with dates
> Fixed cadence removes schedule pressure to hold releases for one more feature.

### Exercises

1. **Version it** — After v2.1.0, you fix a rounding bug, then add an Ohio rate table (compatible), then change the CSV import format so old files fail. Give the three versions.
<details><summary>Solution</summary>

2.1.1 (fix), 2.2.0 (feature), 3.0.0 (breaking change to the input contract).

</details>

2. **Write a rollback plan** — For a release that adds a column and a new report page.
<details><summary>Solution</summary>

```text
Trigger: error rate > 2% or report page failing smoke test within 30 minutes of deploy.
Action: redeploy image tag 2.0.3 via pipeline "rollback" job (blue-green switch, ~2 min).
Schema: new column is additive and nullable; 2.0.3 ignores it; no migration reversal needed.
Verify: /version shows 2.0.3; smoke test passes; notify team leads; open incident ticket.
```

</details>

3. **Classify changes** — Rate-table CSV update through the tested pipeline; new authentication provider; emergency fix for a crash in production. Assign ITIL change types.
<details><summary>Solution</summary>

Standard (pre-approved, low risk, repeatable); normal (needs assessment by the CAB, security impact); emergency (expedited approval, reviewed afterwards).

</details>

### Interview Questions

**Q: What is configuration management and why does it matter?**
Configuration management is the identification, control, status accounting and audit of every item that makes up a system: source, dependencies, build scripts, configuration, infrastructure definitions and documentation. It matters because without it you cannot answer what is running in production, reproduce a build from six months ago, or prove to an auditor which approved change introduced a behaviour. In practice it means everything in version control, artefacts built once and versioned with the commit SHA, lockfiles for dependencies, infrastructure as code, and secrets in a vault. On a title-production reporting tool this let us trace a disputed quote to the exact rate-table version and code build that produced it.

**Q: How do you manage configuration across environments without leaking secrets?**
Separate configuration from code and from the artefact: the same image runs in every environment and receives its settings through environment variables or mounted files at deploy time. Non-secret settings are versioned per environment in the repository so changes are reviewed; secrets are stored in a vault or the CI platform's environment-scoped secret store and referenced by name, never by value, in configuration. Pipelines get short-lived credentials via OIDC rather than stored keys. A pre-commit secret scanner and push protection catch mistakes, and infrastructure as code plus drift detection make sure staging really matches production.

**Q: Describe your release process from code freeze to production.**
Scope is frozen by moving anything unfinished to the next milestone; the changelog and version are updated and an annotated tag is created, which triggers the pipeline to build the release artefact. The artefact is deployed to staging, where smoke tests, the regression suite and UAT sign-off run against production-sized data; migrations are reviewed as backward compatible and the rollback is rehearsed. A change record is raised, classified as standard when the pipeline's controls apply, and release notes go to stakeholders. Production deploys as a canary with monitoring watched for thirty minutes, then full rollout, verification of the version endpoint, and a short post-release review; hotfixes branch from the tag and merge back to main.

## Estimation (story points, function points) & scheduling

Estimation answers "how big is this and how long will it take", and scheduling turns that into a plan with dates and dependencies. Estimates are uncertain by nature, so professional estimation is about calibrated ranges, evidence and re-forecasting rather than a single number defended to the end. This chapter covers relative estimation with story points, algorithmic estimation with function points and COCOMO, expert techniques such as three-point and Wideband Delphi, and scheduling with work breakdown structures, Gantt charts and the critical path.

### Why estimates go wrong

The **cone of uncertainty** (Boehm, McConnell) shows that at project inception estimates are off by a factor of four in either direction and narrow only as requirements and design firm up. Add optimism bias, the **planning fallacy**, pressure to give the number the sponsor wants, and forgetting non-development work (testing, deployment, meetings, support), and single-point estimates are almost always low. Give ranges, state assumptions, and re-estimate as you learn.

### Story points and relative estimation

Agile teams estimate **size** in story points, a unit-less relative measure of effort, complexity and risk, and let measured **velocity** convert size into time. Reference stories anchor the scale: "the XLSX export was a 3". The modified Fibonacci scale (1, 2, 3, 5, 8, 13, 20, 40, 100) reflects growing uncertainty. **Planning poker**: each estimator privately chooses a card, all reveal at once, the high and low explain, repeat until consensus. The conversation is the point; the number is a by-product. Alternatives: **T-shirt sizes** for epics, **affinity estimation** (sort stories on a wall by relative size) for a large backlog in an hour, and **#NoEstimates** flow forecasting using throughput and cycle-time percentiles.

```text
Velocity: last 6 sprints = 11, 13, 12, 9, 14, 12  → mean 11.8, range 9–14
Remaining backlog to release: 71 points
Forecast: 71 / 14 ≈ 5.1 (best), 71 / 11.8 ≈ 6.0 (likely), 71 / 9 ≈ 7.9 (worst)
Report: "6 sprints likely, 5–8 range; re-forecast every sprint"
```

Story points are for the team's own forecasting. Comparing velocities across teams or targeting velocity increases inflates points and destroys the measure.

### Function points

**Function point analysis** (Albrecht, IFPUG) measures functional size from the user's view, independent of technology, and is used for contracts, benchmarking and early estimates when there is no team velocity. Count five component types, weight each by complexity, sum to unadjusted function points, then adjust for 14 general system characteristics.

| Component | Low | Average | High | Example |
|---|---|---|---|---|
| External inputs (EI) | 3 | 4 | 6 | Import CSV screen, reassign form |
| External outputs (EO) | 4 | 5 | 7 | Weekly XLSX report, idle-file email |
| External inquiries (EQ) | 3 | 4 | 6 | File status lookup |
| Internal logical files (ILF) | 7 | 10 | 15 | ProductionFile table group, Agent table |
| External interface files (EIF) | 5 | 7 | 10 | HR system's agent list (read only) |

```text
Idle-file feature:  2 EI (avg) = 8,  2 EO (avg) = 10,  1 EQ (low) = 3,  1 ILF (avg) = 10,  1 EIF (low) = 5
Unadjusted FP = 36;  VAF = 0.65 + 0.01 × Σ(GSC ratings, say 35) = 1.00  →  36 FP
Productivity from history: 12 FP per person-month  →  3 person-months
```

**COCOMO II** (Boehm) then converts size (in function points converted to lines, or lines directly) into effort with `Effort = A × Size^E × Π(effort multipliers)`, where the exponent reflects scale factors such as precedentedness and team cohesion, and multipliers cover reliability, complexity, tool use and staff capability. Use it for order-of-magnitude checks and to show sponsors why halving the schedule more than doubles cost.

### Expert and statistical techniques

- **Three-point (PERT)**: expected = (optimistic + 4 × most likely + pessimistic) ÷ 6, standard deviation ≈ (P − O) ÷ 6. Sum expected values and add variances to get a project-level range.
- **Wideband Delphi**: anonymous estimates from several experts, discussion of the spread, repeated rounds; reduces anchoring.
- **Analogy**: compare with completed work of similar size, adjusted for differences; the most accurate method when history exists.
- **Bottom-up**: estimate each WBS task and sum; accurate late, expensive early.
- **Monte Carlo simulation**: sample throughput from history thousands of times to produce "85% chance of finishing by 14 November".

### Scheduling

A **work breakdown structure** decomposes the project into deliverables and tasks small enough to estimate (the 8/80 rule: 8 to 80 hours). A **network diagram** links tasks by dependency (finish-to-start most often). The **critical path** is the longest chain of dependent tasks; its length is the minimum project duration and any delay on it delays the project, while other tasks have **float**. A **Gantt chart** shows tasks on a calendar with dependencies and milestones and is what sponsors expect to see.

```text
Task                         Dur  Depends   ES  EF  LS  LF  Float
A Requirements workshop       3   -          0   3   0   3   0   *
B Data model                  4   A          3   7   3   7   0   *
C Report UI mock-ups          3   A          3   6   5   8   2
D Import + validation         5   B          7  12   7  12   0   *
E Report pages                6   B, C       7  13   8  14   1
F Integration + UAT           4   D, E      13  17  14  18   1  (E path) / 0 via D? → recompute: F ES = max(12,13)=13
G Deploy + training           2   F         17  19  17  19   0   *
Critical path: A → B → D → F → G?  No: A-B-E-F-G = 3+4+6+4+2 = 19 days is longest; E is critical, D has 1 day float.
```

Working through the numbers by hand, as above, is exactly what exam questions ask; tools (MS Project, Jira Advanced Roadmaps, Smartsheet) do it for real projects. Resource levelling then adjusts the schedule so no person is over-allocated, usually lengthening it.

> **Warning:** Brooks' Law applies to schedules: compressing a schedule by adding people raises communication overhead and ramp-up cost, so effort rises and the schedule may not shrink at all. When a sponsor wants a date moved, the honest levers are scope, quality risk, or a later date, and the estimate should show the trade-off with numbers.

### Tracking

Compare plan to actuals every sprint or week: burnup charts for scope and progress, **earned value** (planned value, earned value, actual cost; schedule and cost performance indices) for formal projects, and re-forecast the end date from measured throughput rather than the original plan. Report early when the forecast slips; a late surprise is the sin, not the slip.

### Try It Yourself

```python
# Monte Carlo forecast from historical sprint throughput (points per sprint)
import random
history = [11, 13, 12, 9, 14, 12, 10, 13]
remaining = 71
runs = 10_000
results = []
for _ in range(runs):
    done, sprints = 0, 0
    while done < remaining:
        done += random.choice(history)
        sprints += 1
    results.append(sprints)
results.sort()
for p in (50, 85, 95):
    print(f"{p}% confidence: {results[int(runs * p / 100) - 1]} sprints")
```

### Quiz

1. What do story points measure?
- [ ] Hours of work
- [x] Relative size in effort, complexity and risk
- [ ] Business value
> Velocity converts points into time; points themselves are unit-less.

2. Which method measures size from the user's functional view, independent of technology?
- [ ] COCOMO
- [x] Function point analysis
- [ ] Planning poker
> FPA counts inputs, outputs, inquiries and files; COCOMO converts size to effort.

3. What is the PERT expected duration for O = 4, M = 6, P = 14 days?
- [ ] 6
- [x] 7
- [ ] 8
> (4 + 4 × 6 + 14) ÷ 6 = 42 ÷ 6 = 7 days.

4. A task with zero float lies on what?
- [x] The critical path
- [ ] The baseline
- [ ] The WBS root
> Any delay to a zero-float task delays the whole project.

### Exercises

1. **Planning poker outcome** — Estimates for a story are 3, 5, 5, 13. What happens next, and what might the 13 indicate?
<details><summary>Solution</summary>

The 3 and 13 explain their reasoning; the 13 often reveals an unconsidered risk (an unknown data source, a missing rule). The team either converges after discussion, splits the story, or creates a spike to remove the uncertainty before estimating.

</details>

2. **Function points** — Count FPs for "Score a file": one input form (average), one output monthly report (high), one inquiry to view a score (low), one internal file (average). Compute unadjusted FP.
<details><summary>Solution</summary>

EI avg 4 + EO high 7 + EQ low 3 + ILF avg 10 = 24 unadjusted function points.

</details>

3. **Critical path** — Tasks: A(2) → B(4) → D(3); A → C(6) → D. Find the critical path and C's float, and B's float.
<details><summary>Solution</summary>

Paths: A-B-D = 9, A-C-D = 11. Critical path A-C-D, duration 11. C has zero float; B has 11 − 9 = 2 days of float.

</details>

### Interview Questions

**Q: How do you estimate a project you have never done before?**
I start with a range, not a number, and say where in the cone of uncertainty we are. I decompose into a work breakdown structure to the level where each task resembles something the team has done, then estimate by analogy and with three-point estimates so the range is explicit, and I sum expected values and variances rather than best cases. Where no history exists I use function points and published productivity rates as a sanity check. I include testing, deployment, documentation and support explicitly, add a spike for the riskiest unknown, and commit to re-forecasting every two weeks from measured throughput. The first estimate is a hypothesis; the honest deliverable is the updated forecast.

**Q: Why should velocity not be used to compare teams or as a performance target?**
Because story points are a relative scale calibrated within one team against its own reference stories, so a 5 for one team is not a 5 for another; comparing velocities compares rulers, not output. Making velocity a target invites inflation: the team simply assigns more points, which destroys the only purpose points have, forecasting from the team's own history. Meaningful cross-team measures are outcome-based: lead time, deployment frequency, defect rates, customer outcomes. Within the team, velocity is a planning input with natural variation, and a drop is a prompt to ask what changed, not a judgement.

**Q: Explain the critical path and how you use it.**
The critical path is the longest sequence of dependent tasks from project start to finish; its total duration is the minimum time the project can take, and every task on it has zero float, so any delay on it delays delivery. I compute it with a forward pass for earliest start and finish and a backward pass for latest, and the tasks whose earliest and latest times coincide are critical. In practice I use it to decide where to add resources or reduce scope, to know which delays matter and which tasks can slip without consequence, and to explain to sponsors why adding people to a non-critical task will not bring the date forward. It changes as work progresses, so I recompute it whenever actuals diverge from plan.

# LEVEL: Expert

## Risk management & quality standards (ISO/CMMI)

Every project carries uncertainty: a key developer may leave, a client may change the spec, a third-party API may be deprecated. **Risk management** is the discipline of finding those uncertainties early, sizing them, and deciding what to do before they become incidents. **Quality standards** such as ISO 9001, ISO/IEC 25010, ISO/IEC 12207 and CMMI are the frameworks that organisations use to show that risk, process and quality are managed systematically rather than by heroics. Final-year vivas and BPO client audits both ask about them.

### Risk identification

A risk is a future event with a probability and an impact; an issue is a risk that has already happened. Identify risks at project start and at every phase gate using:

- **Checklists** by category: technical (unfamiliar stack, integration), schedule (optimistic estimates), resource (single points of knowledge), external (vendor, regulation), requirements (volatility, ambiguity).
- **Assumption analysis**: every "we assume the client will provide sample files by week 2" is a risk.
- **Lessons learned** from previous projects and post-mortems.

### The risk register

```text
ID   Risk                                      P   I   Score  Owner    Response    Trigger / status
R1   Client rate-card PDFs arrive late         4   3   12     PM       Mitigate    Not received by 10 Apr -> escalate
R2   Only one dev knows the DOCX generator     3   5   15     Lead     Mitigate    Pairing + docs by sprint 3
R3   openpyxl drops support for .xls source    1   4    4     Dev      Accept      Watch changelog
R4   Client changes report layout after UAT    3   3    9     PM       Transfer    Change request with cost in contract
R5   Pyodide runtime too slow for 700-page job 2   5   10     Dev      Avoid       Spike in sprint 1; fall back to server
```

Probability and impact are scored 1–5, the product ranks the register, and each risk has an owner and a **response**: avoid (change the plan), mitigate (reduce P or I), transfer (insurance, contract clause, vendor), or accept (monitor with a trigger). The register is reviewed at every sprint review or phase gate, not filed once.

### Quantifying: exposure and EMV

Risk exposure = probability × cost. If R2's key developer leaving has a 30% chance and would cost 6 weeks of rework (≈ PKR 1.2M), exposure is PKR 360k, which justifies spending two weeks of pairing time on mitigation. The **expected monetary value** of a decision tree sums the exposures of the branches; it is how you argue for a mitigation budget in numbers a sponsor accepts.

### Quality standards

| Standard | What it is | What it asks of you |
|---|---|---|
| ISO 9001:2015 | Quality management system (any industry) | Documented processes, records, corrective action, management review, continual improvement |
| ISO/IEC 12207 | Software life-cycle processes | Defined processes for acquisition, development, operation, maintenance |
| ISO/IEC 25010 | Product quality model | Eight characteristics: functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, portability |
| ISO/IEC 27001 | Information security management | Risk assessment, controls (Annex A), audits; common in BPO client contracts |
| CMMI v2.0/v3.0 | Capability Maturity Model Integration | Five maturity levels; practices grouped by capability areas |

**CMMI maturity levels**: 1 Initial (ad hoc, success depends on individuals), 2 Managed (projects planned, tracked, requirements managed), 3 Defined (organisation-wide standard processes, tailored per project), 4 Quantitatively Managed (process performance measured statistically), 5 Optimizing (continuous, data-driven improvement). Most BPO and outsourcing firms in Pakistan advertise CMMI Level 3; the difference between 2 and 3 is whether the good process is per-project or organisational.

### Quality assurance vs quality control

QA is process-oriented and preventive: standards, reviews, audits, training. QC is product-oriented and detective: testing, inspection, sampling. A QA checker in a data-processing team doing 10% sampling against a checklist is doing QC; the team lead who writes the checklist, trains agents on it and tracks error trends is doing QA. ISO 9001's "corrective action" clause is the RCA loop: find the cause, fix it, verify, record.

### Cost of quality

```text
Prevention   training, standards, design reviews, static analysis        cheapest
Appraisal    testing, inspection, QA sampling, audits
Internal failure   rework, re-testing, scrap before delivery
External failure   client-found defects, SLA penalties, reputation     most expensive
```

The argument for every quality practice is the same: money spent on prevention and appraisal reduces failure cost by more than it costs. A defect found in requirements costs roughly 1 unit to fix; the same defect found in production costs 30 to 100 units, which is the number to quote in a viva.

> **Interview note:** Examiners ask "what is the difference between ISO 9001 and CMMI?". ISO 9001 is a pass/fail certification of a quality management system for any industry; CMMI is a software-and-services maturity model with five staged levels and a benchmark appraisal. A company can hold both.

### Try It Yourself

```python
risks = [
    ("R1", "Client rate-card PDFs arrive late", 4, 3, "mitigate"),
    ("R2", "Only one dev knows the DOCX generator", 3, 5, "mitigate"),
    ("R3", "openpyxl drops .xls support", 1, 4, "accept"),
    ("R4", "Client changes report layout after UAT", 3, 3, "transfer"),
    ("R5", "Pyodide too slow for 700-page job", 2, 5, "avoid"),
]
ranked = sorted(risks, key=lambda r: r[2] * r[3], reverse=True)
print(f"{'ID':4}{'Risk':44}{'P':>3}{'I':>3}{'Score':>7}  Response")
for rid, name, p, i, resp in ranked:
    band = "HIGH" if p * i >= 12 else ("MED" if p * i >= 6 else "LOW")
    print(f"{rid:4}{name:44}{p:>3}{i:>3}{p*i:>7}  {resp:9}{band}")
# exposure in weeks: probability as fraction x rework weeks
print("\nR2 exposure:", 0.30 * 6, "weeks -> justifies ~2 weeks of pairing")
```

### Quiz

1. Which response changes the plan so the risk cannot occur?
- [ ] Mitigate
- [x] Avoid
- [ ] Accept
> Avoidance removes the cause; mitigation reduces probability or impact.

2. What distinguishes CMMI Level 3 from Level 2?
- [ ] Level 3 requires automated testing
- [x] Processes are standardised organisation-wide, not just per project
- [ ] Level 3 requires ISO 9001
> Level 2 is "managed" per project; Level 3 is "defined" across the organisation.

3. A QA checker sampling 10% of files against a checklist is doing:
- [ ] Quality assurance
- [x] Quality control
- [ ] Risk transfer
> QC inspects the product; QA improves the process that makes it.

4. Which cost-of-quality category is most expensive?
- [ ] Prevention
- [ ] Appraisal
- [x] External failure
> Client-found defects carry rework, penalties and reputation cost.

### Exercises

1. **Register** — Write three risks for a Fiverr project delivering a 168-field fillable PDF form, each with P, I, response and trigger.
<details><summary>Solution</summary>

```text
R1  Client's field list changes after layout is done   P4 I3  Mitigate: freeze field list in writing at milestone 1; changes billed as revision
R2  Adobe Reader renders calculated fields differently  P3 I4  Mitigate: test in Reader, Preview and Chrome before delivery; trigger: any calc field fails
R3  Client's source PDF is a scan with no text layer    P2 I3  Avoid: confirm text layer on day 1; if scan, quote OCR as a separate item
```

</details>

2. **EMV** — A vendor API has a 20% chance of a breaking change costing 3 weeks; a wrapper layer costs 4 days to build. Should you build it?
<details><summary>Solution</summary>

Exposure = 0.2 × 15 working days = 3 days. The wrapper costs 4 days, so on pure EMV it is not justified. However, if the impact would land at delivery time when 3 weeks means missing a contractual date with penalties, the impact is larger than 15 days and the wrapper is justified; state the assumption either way.

</details>

3. **ISO 25010** — Map three non-functional requirements of a rate-calculator app to 25010 characteristics.
<details><summary>Solution</summary>

"Premium computed in under 200 ms" → performance efficiency (time behaviour). "Wrong rate table version cannot be selected" → reliability (fault tolerance) and functional suitability (correctness). "New state can be added by editing a CSV, no code change" → maintainability (modifiability).

</details>

### Interview Questions

**Q: How do you manage risk on a software project?**
I keep a living risk register from day one: each risk has a probability and impact score, an owner, a response of avoid, mitigate, transfer or accept, and a trigger that says when the response fires. I identify risks from category checklists, from every assumption in the plan, and from past post-mortems, and I review the register at each sprint review, retiring risks that passed and adding new ones. For the top few I quantify exposure as probability times cost so mitigation spending can be justified in numbers. On a report-automation project the highest risk was one developer holding all knowledge of the DOCX generator; two weeks of pairing and a runbook cut the impact, and when that developer did leave, delivery slipped three days rather than six weeks.

**Q: Explain the CMMI levels and what Level 3 means in practice.**
Level 1 is ad hoc, success depends on individuals; Level 2 is managed, meaning each project plans, tracks and controls requirements, configuration and quality; Level 3 is defined, meaning the organisation has standard processes with tailoring guidelines and every project uses them, with training and organisational process assets; Level 4 adds quantitative management, using statistical process control on process performance; Level 5 is optimising, with continuous data-driven improvement. In practice Level 3 means a new project does not invent its own way of doing estimation, reviews or release management; it tailors the organisational one, which is why outsourcing clients ask for it. It says nothing directly about product quality, which is why I would also ask what their defect rates are.

**Q: What is the difference between quality assurance and quality control?**
QA is about the process and is preventive: standards, checklists, training, reviews, audits and the corrective-action loop. QC is about the product and is detective: testing, inspection, sampling against acceptance criteria. When I was a quality checker on a data-processing team, sampling 10% of records against the checklist was QC; when I led the team and rewrote the checklist, tracked error types weekly and retrained on the top two, that was QA. Both are needed, and the cost-of-quality model says money moved from failure to prevention pays back several times, since a defect found in requirements costs a fraction of one found by the client.

**Q: How does ISO 9001 apply to a software or BPO team?**
ISO 9001 certifies that a quality management system exists: documented processes, records that show they were followed, defined responsibilities, measurement of quality objectives, corrective action on nonconformities, internal audits and management review. For a software team that maps to a defined SDLC with gate reviews, version control and change records, defect tracking with root-cause analysis, and KPIs reviewed by management; for a BPO team it is SOPs, QA sampling records, error trend reviews and client-audit evidence. It does not prescribe how to build software; Agile teams pass ISO 9001 audits by showing that their sprint reviews, retrospectives and definition of done are the documented process and that the records exist.

## Maintenance & technical debt

Most of a system's life and most of its cost is maintenance: studies since Lientz and Swanson in the 1980s put it at 60–80% of total lifecycle cost. **Technical debt**, Ward Cunningham's metaphor, is the future cost created by choosing a quicker solution now; like financial debt it carries interest, which is the extra effort every later change costs until it is repaid. Managing both is what separates a system that lasts ten years from one that is rewritten every three.

### The four kinds of maintenance

| Type | Trigger | Example | Share (typical) |
|---|---|---|---|
| Corrective | A defect | The weekly XLSX export drops the last row | ~20% |
| Adaptive | Environment change | Python 3.13 removes a module; new Excel file format; client moves to SharePoint | ~25% |
| Perfective | New or improved functionality | Add a per-county view to the report | ~50% |
| Preventive | Reduce future failure | Refactor the 900-line report script into stages | ~5% |

The surprise for most students is that perfective work dominates; a live system attracts requests. The tragedy is that preventive work is starved, which is how debt compounds.

### Lehman's laws

Two of Lehman's laws of software evolution explain most maintenance pain: **continuing change** (a system in use must change or become progressively less useful) and **increasing complexity** (as it changes, its structure degrades unless work is done to maintain it). The second law is the interest on technical debt stated as a law.

### Kinds of technical debt

Martin Fowler's quadrant separates debt by intent and by care:

```text
                 Reckless                          Prudent
Deliberate   "No time for design"          "Ship now, refactor the parser next sprint"
Inadvertent  "What is layering?"           "Now we know how we should have done it"
```

Prudent-deliberate debt is a legitimate tool: the DOCX generator shipped with a hard-coded template path to meet a client date, with a ticket to fix it. Reckless debt is the kind nobody tracked. Beyond code, debt lives in tests (missing coverage), architecture (a report script that is also the database layer), documentation (a runbook that no longer matches), and dependencies (pinned versions three majors behind).

### Measuring it

- **Code smells** and complexity: cyclomatic complexity per function, file length, duplication; `radon`, SonarQube, `pylint`.
- **Change hotspots**: files that change most often and are largest are where debt costs most; `git log --format= --name-only | sort | uniq -c | sort -rn | head`.
- **Lead time for a change** in a module compared with the rest of the system.
- **Dependency age**: `pip list --outdated`, Dependabot alerts.
- **Debt register**: a ticket per known item with the interest (hours per month it costs) and the principal (hours to fix).

```text
DEBT-12  build_report.py is 900 lines, no tests    interest ~6 h/month (every change needs manual re-run)
         principal ~3 days (split into stages + tests)   payback ~4 months   priority HIGH
DEBT-15  openpyxl pinned at 3.0.x                  interest ~0 now; risk at Python 3.13 upgrade
         principal ~2 h                                  priority MEDIUM (do with next Python bump)
```

### Paying it down

- **Boy Scout rule**: leave every file you touch a little cleaner; small, continuous repayment.
- **Debt budget**: reserve 10–20% of each sprint for items from the debt register, chosen by interest-to-principal ratio.
- **Strangler fig**: for large legacy pieces, build the replacement beside the old one and route work to it piece by piece rather than a big-bang rewrite.
- **Refactor under test**: characterisation tests first (capture current behaviour, including the bugs), then restructure, then fix behaviour deliberately.
- **Retire**: some debt should be written off; a report nobody reads is deleted, not refactored.

### Making maintenance cheap

Maintainability is designed in: small modules with one reason to change, dependency injection so the extract stage can be swapped for a test double, configuration outside code, structured logs, runbooks, and semantic versioning with a changelog so operators know what changed. The best measure of maintainability is how long a new team member takes to make a safe change; if it is more than a day for a one-line fix, the system is telling you something.

> **Warning:** "We will rewrite it from scratch" is almost always the most expensive option. The old system encodes years of fixed edge cases that nobody remembers; a rewrite reintroduces them one client complaint at a time. Prefer strangling it piece by piece.

### Try It Yourself

```python
# A tiny debt register with payback ranking: interest is hours/month the debt costs,
# principal is hours to repay. Lower payback months = fix first.
debts = [
    ("DEBT-12", "build_report.py 900 lines, no tests", 6.0, 24),
    ("DEBT-15", "openpyxl pinned at 3.0.x", 0.5, 2),
    ("DEBT-18", "Rate table hard-coded in two places", 3.0, 8),
    ("DEBT-21", "Runbook outdated (3 wrong steps)", 2.0, 3),
]
for did, name, interest, principal in sorted(debts, key=lambda d: d[3] / d[2]):
    print(f"{did}  {name:40} interest {interest:4.1f} h/mo  principal {principal:3} h  payback {principal/interest:5.1f} mo")
```

### Quiz

1. Which maintenance type usually takes the largest share of effort?
- [ ] Corrective
- [x] Perfective
- [ ] Preventive
> Live systems attract enhancement requests; perfective work is typically about half.

2. "Ship now with a hard-coded path, ticket raised to fix next sprint" is which kind of debt?
- [x] Prudent, deliberate
- [ ] Reckless, deliberate
- [ ] Reckless, inadvertent
> A conscious trade-off with a plan to repay is prudent deliberate debt.

3. What is the strangler fig pattern?
- [ ] Deleting the legacy system on a fixed date
- [x] Building the replacement alongside and routing functionality to it incrementally
- [ ] Freezing the legacy system
> Incremental replacement avoids the big-bang rewrite risk.

4. Which metric best identifies where debt costs the most?
- [ ] Total lines of code
- [x] Files that are both large and frequently changed
- [ ] Number of contributors
> Hotspots combine complexity with change frequency; debt in never-touched code is cheap.

### Exercises

1. **Classify** — Label each as corrective, adaptive, perfective or preventive: (a) update the SharePoint connector after a Microsoft API change; (b) add a per-agent tab to the dashboard; (c) fix the TOC page numbers in the handbook generator; (d) split the monolith script into modules.
<details><summary>Solution</summary>

(a) adaptive, (b) perfective, (c) corrective, (d) preventive.

</details>

2. **Payback** — A debt item costs 6 hours a month and takes 24 hours to fix. Another costs 1 hour a month and takes 2 hours. Which first, and why might you still do the second one immediately?
<details><summary>Solution</summary>

Payback: 24/6 = 4 months versus 2/1 = 2 months, so the second pays back faster and goes first by the ratio. But the first has a much larger absolute interest, so it should be scheduled soon regardless; and the second is small enough to do under the Boy Scout rule the next time that file is touched, without needing a sprint slot.

</details>

3. **Characterisation test** — Describe how you would safely refactor a 900-line report script with no tests.
<details><summary>Solution</summary>

Freeze an input dataset and capture the script's current outputs (the workbook contents as CSV, the printed log) as golden files. Write a test that runs the script and diffs against the golden files, so any change in behaviour is detected. Then extract one stage at a time (extract, validate, transform, write) into functions, running the golden test after each step. Only after the structure is clean, fix known bugs deliberately, updating the golden files with an explanation in the commit.

</details>

### Interview Questions

**Q: What is technical debt and how do you manage it?**
Technical debt is the future cost of a shortcut taken now; the interest is the extra effort every later change costs until the shortcut is fixed. Some is prudent and deliberate, taken to meet a date with a ticket to repay it; the dangerous kind is untracked. I manage it with a debt register where each item records the interest in hours per month and the principal in hours to fix, and I rank by payback; the team reserves a share of each sprint for the top items and applies the Boy Scout rule for small ones. I watch hotspots, the files that are large and change often, because that is where interest is paid. On a reporting codebase, a 900-line script with no tests cost about six hours a month in manual re-runs; three days splitting it into tested stages paid back in four months and made the next three feature requests trivial.

**Q: Why is maintenance the majority of software cost, and what reduces it?**
Because a useful system lives for years and must keep changing: defects are found, environments change, users ask for more, and each change on a degrading structure costs more than the last, which Lehman's laws describe. What reduces it is designing for change: small modules with one reason to change, dependencies injected so pieces can be swapped and tested, configuration outside code, automated tests that make change safe, clear logs and runbooks so incidents are short, and continuous small refactoring so complexity does not accumulate. The measure I use is how long a new person needs to make a safe one-line change; when it exceeds a day, maintenance cost is about to climb.

**Q: A stakeholder wants to rewrite a legacy system from scratch. What do you say?**
I ask what problem the rewrite solves and whether it can be solved incrementally, because a full rewrite is usually the most expensive and riskiest option: it takes longer than estimated, the old system keeps changing meanwhile, and years of fixed edge cases are lost and rediscovered by users. I propose the strangler fig approach: put a facade in front, build the replacement for the most painful module first, route that traffic to it, and retire the old module; repeat. It delivers value early, keeps the old system as a fallback, and lets us stop if priorities change. The exceptions are when the platform itself is dead, such as an unsupported language runtime, or when the system is small enough that the rewrite is days rather than months.

**Q: How do you decide whether to fix a bug or refactor the code around it?**
By the cost of the next change. If the fix is one line in a module that is otherwise healthy, I fix it and add a test. If the bug is a symptom of structure, such as the third fix in the same tangled function this quarter, I add a characterisation test, refactor under it, then make the fix, because the fourth bug is coming. I keep the two commits separate so the refactor is reviewable as behaviour-preserving and the fix is reviewable as a behaviour change. The judgement is recorded in the debt register either way, so that the decision to defer is visible rather than forgotten.

## Security in the SDLC

Security is not a phase you bolt on before release; it is a concern woven through every phase of the software development life cycle. The industry name for this is "shifting left" — moving security work earlier, where defects are cheaper to fix. A vulnerability found in design costs a fraction of the same vulnerability found in production after a breach.

### Security in each phase

| SDLC phase | Security activity |
|---|---|
| Requirements | Security and privacy requirements; abuse cases alongside use cases |
| Design | Threat modelling (STRIDE); least-privilege architecture; secure defaults |
| Implementation | Secure coding standards; input validation; no secrets in code |
| Testing | SAST, DAST, dependency scanning, penetration testing |
| Deployment | Hardened config, secrets management, least-privilege infrastructure |
| Maintenance | Patching, vulnerability monitoring, incident response |

### Threat modelling with STRIDE

In design, ask what can go wrong systematically. STRIDE is a checklist of threat categories:

```text
S - Spoofing        : can someone impersonate a user/service?      -> authentication
T - Tampering       : can data be modified in transit/at rest?     -> integrity, signing
R - Repudiation     : can someone deny an action?                  -> audit logging
I - Info disclosure : can data leak?                               -> encryption, access control
D - Denial of service: can it be overwhelmed?                      -> rate limits, quotas
E - Elevation of priv: can a user gain more access than allowed?   -> authorization, least priv
```

### The OWASP Top 10 as a coding checklist

The OWASP Top 10 lists the most common web-application risks — injection, broken authentication, broken access control, security misconfiguration, and so on. Treated as a checklist during implementation and review, it catches the majority of real-world vulnerabilities. Injection (SQL, command) and broken access control are perennially near the top, and both are prevented by disciplined input handling and authorization checks.

### Automated security testing

- **SAST** (static analysis) scans source code for vulnerable patterns before it runs.
- **DAST** (dynamic analysis) attacks the running application.
- **Dependency/SCA scanning** flags known-vulnerable third-party libraries — often the biggest real risk, since most code in a modern app is dependencies.
- **Secrets scanning** blocks credentials committed to the repository.

> **Warning:** The most common breach today is not a clever exploit but a known-vulnerable dependency or a leaked credential. Dependency scanning and secrets scanning in CI catch both cheaply, and skipping them is negligence, not a shortcut.

### Try It Yourself

```text
Threat-model a login feature with STRIDE (fill in a control for each)

Feature: user logs in with email + password to a reporting dashboard

  Spoofing        -> ? (e.g. strong auth, MFA, no user enumeration on errors)
  Tampering       -> ? (e.g. TLS in transit, integrity checks)
  Repudiation     -> ? (e.g. audit log of logins with timestamp + IP)
  Info disclosure -> ? (e.g. hash+salt passwords, generic error messages)
  Denial of service -> ? (e.g. rate-limit login attempts, lockout/backoff)
  Elevation of priv -> ? (e.g. role checks on every request, least privilege)
```

### Quiz

1. "Shifting left" in security means:
- [x] Moving security work earlier in the SDLC where defects are cheaper to fix
- [ ] Moving the team to the left of the office
- [ ] Testing only at release
> Finding and fixing security defects earlier (requirements/design) costs far less than fixing them in production.

2. STRIDE is used primarily during which phase?
- [x] Design (threat modelling)
- [ ] Deployment
- [ ] Maintenance
> STRIDE is a design-time threat-modelling checklist covering spoofing, tampering, repudiation, info disclosure, DoS and elevation.

3. The most common real-world breach source today is often:
- [x] Known-vulnerable dependencies and leaked credentials
- [ ] Novel zero-day exploits
- [ ] Slow databases
> Most breaches trace to unpatched dependencies or committed secrets, which dependency and secrets scanning catch cheaply.

4. SAST differs from DAST in that:
- [x] SAST analyses source code statically; DAST attacks the running app
- [ ] SAST is manual; DAST is automatic
- [ ] They are the same
> Static analysis inspects code without running it; dynamic analysis tests the live application.

### Exercises

1. **Apply STRIDE** — For a file-upload feature, name one threat in the "Elevation of privilege" and one in the "Denial of service" category, with a control for each.
<details><summary>Solution</summary>

Elevation of privilege: an uploaded file executed on the server could run with server privileges — control by never executing uploads, validating type, and storing outside the web root. Denial of service: a huge file or zip bomb exhausts resources — control by enforcing size limits and resource caps per upload.

</details>

2. **Place the checks** — Which CI checks would you add to catch (a) a committed AWS key and (b) a dependency with a known CVE?
<details><summary>Solution</summary>

(a) A secrets-scanning step (e.g. gitleaks/trufflehog) that fails the build on detected credentials. (b) A software-composition-analysis / dependency-scanning step (e.g. `npm audit`, Dependabot, Snyk) that flags or fails on known-vulnerable versions.

</details>

### Interview Questions

**Q: What does it mean to "build security into the SDLC" rather than test for it at the end?**
It means every phase has a security activity rather than treating security as a final gate. Requirements include security and privacy requirements and abuse cases; design includes threat modelling with something like STRIDE and least-privilege architecture; implementation follows secure coding standards and keeps secrets out of code; testing adds static analysis, dynamic analysis and dependency scanning; deployment hardens configuration and manages secrets; and maintenance patches and monitors. This is "shifting left", and the reason is economic: a flaw caught in design costs a tiny fraction of the same flaw exploited in production. Bolting security on at the end finds fewer issues, later, when they are most expensive.

**Q: In your experience, where do most security problems actually come from, and how do you defend against that cheaply?**
In practice most breaches are not exotic zero-days; they are known-vulnerable third-party dependencies and leaked credentials. Modern applications are mostly dependencies, so a library with a public CVE is a common and serious exposure, and secrets accidentally committed to a repository are a classic cause of compromise. The cheap, high-value defence is automation in CI: dependency/software-composition scanning that flags or fails on vulnerable versions, and secrets scanning that blocks credentials from being committed. Neither requires deep security expertise, both run on every commit, and together they eliminate the two most common real-world causes. Layering the OWASP Top 10 as a review checklist covers most of the rest.

## DevOps & observability

DevOps closes the gap between building software and running it. Where the classic SDLC often ended at "deploy", DevOps treats operation as part of the same continuous loop, and observability is how you know what the running system is actually doing. For a maintainable production system, these are as important as the code.

### DevOps as a culture and a loop

DevOps is often drawn as an infinity loop: plan, code, build, test, release, deploy, operate, monitor, and back to plan. The point is that the same team owns software from idea through production, with fast feedback at every step. Its practices include continuous integration and delivery, infrastructure as code, and automated monitoring.

### Infrastructure as code

Instead of configuring servers by hand, **infrastructure as code** (IaC) describes infrastructure in version-controlled files (Terraform, CloudFormation, Ansible). Benefits: environments are reproducible, changes are reviewed like code, and you can recreate production from a repository. It is the same discipline as templating a document suite — define once, generate consistently.

### The three pillars of observability

| Pillar | Answers | Example |
|---|---|---|
| **Logs** | What happened, in detail | "Conversion of file X failed: font missing" |
| **Metrics** | How much / how fast, over time | requests/sec, error rate, p95 latency |
| **Traces** | Where time went across services | a request spent 800 ms in the PDF step |

Monitoring tells you *that* something is wrong; observability lets you ask *why* without shipping new code to find out.

### SLIs, SLOs and error budgets

- A **Service Level Indicator (SLI)** is a measured signal, e.g. the fraction of requests served under 500 ms.
- A **Service Level Objective (SLO)** is the target, e.g. 99.9% of requests under 500 ms over 30 days.
- The **error budget** is the allowed shortfall (0.1%): if you are within budget you can ship faster; if you have burned it, you slow down and stabilise.

This is the same idea as an SLA in operations, made measurable and used to balance speed against reliability.

> **Tip:** Alert on symptoms users feel (error rate, latency), not on causes (CPU is 80%). High CPU may be harmless; a rising error rate is always worth waking someone for. Alerting on causes produces noise and alert fatigue.

### Try It Yourself

```text
Design an SLO and alert for a document-conversion API

  SLI  : proportion of conversion requests that succeed AND finish < 10 s
  SLO  : 99.5% over a rolling 28 days
  Error budget : 0.5% of requests may fail or be slow

  Observability:
    Logs    -> every failed conversion with file id + reason (missing font, timeout)
    Metrics -> requests/sec, success rate, p95 duration
    Traces  -> time in queue vs time in LibreOffice vs time in QA checks

  Alert (symptom-based):
    Page if success rate < 99% over 15 min OR p95 duration > 20 s
    (Do NOT page on "CPU > 80%" alone.)
```

### Quiz

1. DevOps primarily aims to:
- [x] Close the gap between building and running software with a continuous, fast-feedback loop
- [ ] Replace developers with operations
- [ ] Eliminate testing
> DevOps unifies development and operations so the same team owns software through production with rapid feedback.

2. Infrastructure as code gives you:
- [x] Reproducible, version-controlled, reviewable environments
- [ ] Faster CPUs
- [ ] Smaller codebases
> Describing infrastructure in code makes environments reproducible and changes reviewable, and lets you rebuild from a repo.

3. The three pillars of observability are:
- [x] Logs, metrics and traces
- [ ] CPU, RAM and disk
- [ ] Plan, build, deploy
> Logs (what happened), metrics (how much/fast), and traces (where time went) together let you diagnose without new code.

4. A good production alert fires on:
- [x] User-visible symptoms like error rate and latency
- [ ] CPU utilisation alone
- [ ] Every log line
> Alerting on symptoms users feel avoids the noise and fatigue caused by cause-based alerts like high CPU.

### Exercises

1. **Classify the signals** — For "the weekly report API is slow", say whether each helps: a log of one failed request, a p95-latency metric, a trace of a single slow request. What does each tell you?
<details><summary>Solution</summary>

The metric (p95 latency) tells you *that* it is slow and how widespread. The trace of a slow request tells you *where* the time went across steps (queue vs conversion vs QA). The single failed-request log gives detail on one failure but not the overall trend. You use the metric to detect, the trace to localise, and logs to get specifics.

</details>

2. **Write an SLO** — Define an SLI, SLO and error budget for a login service that should be fast and reliable.
<details><summary>Solution</summary>

SLI: proportion of login requests that succeed and complete under 1 s. SLO: 99.9% over 30 days. Error budget: 0.1% of requests may fail or exceed 1 s in that window; while within budget you can release features, and once it is burned you prioritise reliability work.

</details>

### Interview Questions

**Q: What is the difference between monitoring and observability, and why does it matter?**
Monitoring tells you *that* something is wrong — a dashboard shows the error rate rising or latency spiking. Observability is the property that lets you ask *why* it is wrong without shipping new code, using logs, metrics and traces together: metrics detect the problem and show its scale, traces show where time went across services, and logs give the specific detail. It matters because in production you cannot attach a debugger; when a conversion API slows down at 2 a.m., a trace that shows the time is spent in the LibreOffice step versus the queue lets you fix the right thing fast. Monitoring is necessary but insufficient; observability is what turns an alert into a diagnosis.

**Q: How do SLOs and error budgets help a team balance shipping features against reliability?**
An SLO is a measurable reliability target, like 99.9% of requests under 500 ms over 30 days, and the error budget is the allowed shortfall — the 0.1% you are permitted to miss. The budget turns reliability into a currency: while you are within budget, you have room to ship features quickly and take some risk; once you have burned the budget, the team's priority shifts to stabilising rather than adding features. It replaces arguments about "are we reliable enough?" with a number everyone agreed to in advance. It is the same idea as an operational SLA, but instrumented and used continuously to make the speed-versus-stability trade-off explicit rather than political.

## Software engineering interview & viva questions

The final-year viva and the software-engineering interview both test whether you can reason about the whole life cycle, not just write code. This chapter pulls together the models, principles and trade-offs from this course into the questions examiners and interviewers actually ask, with the way a strong candidate answers.

### What they are really testing

An examiner asking "what is the difference between verification and validation?" is not checking a definition; they are checking whether you understand that you can build the product right yet build the wrong product. Interviewers probe trade-offs (waterfall vs agile, monolith vs microservices) to see whether you choose based on context rather than fashion. The best answers name the trade-off and the deciding factor.

### High-frequency concept questions

| Question | The one-line anchor |
|---|---|
| Verification vs validation | "Building it right" vs "building the right thing" |
| Functional vs non-functional requirements | What it does vs how well it does it |
| Coupling vs cohesion | Low coupling, high cohesion is the goal |
| Waterfall vs Agile | Predictable/fixed scope vs evolving/uncertain scope |
| Cohesion example | A module that does one thing well |
| Regression testing | Re-testing to confirm changes broke nothing |
| Technical debt | Shortcuts that cost interest later |

### How to answer a "which would you choose" question

Do not pick a side unconditionally. State the trade-off, name the deciding factor, then decide for the given context. For "monolith or microservices?": a monolith is simpler to build, deploy and reason about; microservices help when independent teams must deploy and scale parts independently; for a small team and unproven product, start with a well-structured monolith and split later if scale demands. That structure — trade-off, factor, contextual decision — is what earns marks.

> **Interview note:** When you do not know a term, do not bluff. Say what you do know, reason from principles, and state your assumption. Examiners reward "I would verify this, but based on X I would expect Y" far more than a confident wrong answer.

### Try It Yourself

```text
Rehearse the trade-off structure on five prompts (answer: trade-off -> factor -> decision)

1. Waterfall or Agile for a fixed-price government contract with locked requirements?
2. Monolith or microservices for a two-person startup MVP?
3. Write tests first (TDD) or after, for a well-understood utility function?
4. Fix technical debt now or ship the feature and defer?
5. Manual QA or automated tests for a report that changes format every week?

For each: name the competing concerns, the factor that decides, then choose for THIS context.
```

### Quiz

1. Verification vs validation:
- [x] Verification = building it right; validation = building the right thing
- [ ] They are synonyms
- [ ] Verification is done by customers
> Verification checks the product against its spec; validation checks the spec/product against the actual need.

2. The goal for coupling and cohesion is:
- [x] Low coupling, high cohesion
- [ ] High coupling, low cohesion
- [ ] High both
> Modules should depend little on each other (low coupling) and each do one thing well (high cohesion).

3. The best way to answer "waterfall or agile?" in an interview is:
- [x] Name the trade-off and the deciding factor, then choose for the given context
- [ ] Always say agile
- [ ] Always say waterfall
> Interviewers reward contextual reasoning: predictability/fixed scope favours waterfall, evolving/uncertain scope favours agile.

4. When you do not know a term in a viva you should:
- [x] Say what you do know, reason from principles, and state your assumption
- [ ] Bluff confidently
- [ ] Stay silent
> Reasoning from principles and being honest about uncertainty is rewarded; a confident wrong answer is penalised.

### Exercises

1. **Answer the classic** — Give a strong two-sentence answer to "what is the difference between functional and non-functional requirements?" with an example of each.
<details><summary>Solution</summary>

Functional requirements say what the system does — e.g. "the report generator produces a weekly PDF per state." Non-functional requirements say how well it does it — e.g. "each report generates in under 10 seconds and is accessible (tagged PDF)." One is behaviour, the other is quality attributes like performance, security and usability.

</details>

2. **Structure a trade-off answer** — Answer "monolith or microservices for a small internal reporting tool?" using trade-off, factor, decision.
<details><summary>Solution</summary>

Trade-off: a monolith is simpler to build, deploy and debug; microservices allow independent scaling and deployment but add operational complexity. Factor: team size and whether parts must scale/deploy independently. Decision: for a small internal tool with one team, a well-structured monolith is the right choice, splitting out a service only if a specific part later needs independent scale.

</details>

### Interview Questions

**Q: How would you decide between a waterfall and an agile approach for a project?**
I start from the trade-off: waterfall gives predictability and a fixed, documented scope but resists change, while agile embraces changing requirements and delivers incrementally but is harder to fix-price. The deciding factor is how well-understood and stable the requirements are. For a project with locked, contractually fixed requirements — say a government system with a signed specification — a plan-driven, waterfall-leaning approach fits. For a product where the requirements will genuinely evolve as users react, agile with short iterations and frequent feedback fits. In reality many projects are hybrid, agile within a phased contract. The mark of a good answer is choosing based on requirement stability and risk, not on which methodology is fashionable.

**Q: A viva examiner asks about a term you have not heard. What do you do?**
I do not bluff, because a confident wrong answer is the worst outcome. I say honestly that I am not certain of that exact term, then I reason from what I do know and state my assumption explicitly — for example, "I have not used that specific tool, but from the name I would expect it to do X, and I would confirm that before relying on it." That shows the examiner how I think and that I am safe to work with, because I flag uncertainty rather than hide it. Often the reasoning gets me most of the way to the right answer anyway. The same honesty is what I would apply on the job, where pretending to know is far more dangerous than admitting a gap and checking.
