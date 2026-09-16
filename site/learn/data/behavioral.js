/* Behavioural question bank + STAR stories + interview-day checklist, built from the resume. */
window.BEHAVIORAL = {
  stories: [
    { title: 'Leading a 20-agent title-search team to 100% daily targets', tags: ['leadership', 'targets', 'BPO'],
      s: 'At Systems Limited I was promoted within three months from Data Processing Executive to Quality Checker and then Process Lead on an international title-search data-processing project with a 20-member team.',
      t: 'The client expected 100% of the daily volume completed with accuracy above target, every day, while attendance and IT issues kept threatening throughput.',
      a: 'I ran a 10-minute morning huddle to allocate volume by agent capacity, tracked completion hourly in a shared sheet, moved work between agents at midday, escalated facility/IT blockers immediately and coached the two lowest-accuracy agents one-to-one using their own error samples.',
      r: 'The team hit the 100% daily target consistently, accuracy stayed above the client threshold, and my daily/weekly/monthly production reports became the management review standard for the process.' },
    { title: 'Building the Stewart Advanced Rate Calculator', tags: ['technical', 'initiative', 'JavaScript'],
      s: 'Stewart Title production staff compared title-insurance premiums across six policy types and competitor underwriters by hand, which was slow and error-prone.',
      t: 'Create a tool anyone could open without installation that computed all six policy types, compared competitors and exported to Excel.',
      a: 'I designed and built a single-file HTML/JavaScript application: rate tables as data, a tiered-premium engine, competitor comparison logic, validation on inputs and a client-side Excel export. I tested it against known rate sheets and documented the assumptions.',
      r: 'Rate quotes that took minutes became instant and consistent, the tool needed zero IT deployment, and it became the reference for later rate-matrix work.' },
    { title: 'Fixing truncated AI output in the Data Matrix AI Converter', tags: ['problem solving', 'AI', 'debugging'],
      s: 'I built a browser-based converter with a 21-column schema and three LLM providers to turn raw documents into structured matrices.',
      t: 'Long outputs were being cut off at the provider\'s token limit, silently producing incomplete matrices.',
      a: 'I detected truncation from the stop reason and unbalanced JSON, then implemented a continuation loop that resends the tail of the partial output and asks the model to continue exactly where it stopped, stitching the pieces and validating the final schema.',
      r: 'Long conversions became reliable across all three providers, and the validation step caught schema drift before it reached Excel.' },
    { title: 'The Tennessee all-underwriters combined rate matrix', tags: ['data', 'analysis', 'attention to detail'],
      s: 'Management needed to compare six underwriters\' Tennessee rates that were published in different formats, zone definitions and tier breakpoints.',
      t: 'Produce one comparable matrix that could answer "who is cheapest at this amount in this zone" instantly.',
      a: 'I extracted every rate table, normalised tier breakpoints, harmonised zone definitions into a common scheme with a mapping table, built a 3,346-row matrix and validated it by re-computing published sample premiums for each underwriter.',
      r: 'The matrix became the standard for multi-state, multi-underwriter comparisons and the method was reused for other states.' },
    { title: 'A 168-field AcroForm for a legal client', tags: ['document engineering', 'quality', 'client'],
      s: 'A legal client on Fiverr needed a long intake form with radio groups, calculated fields and strict naming so the data could be exported.',
      t: 'Deliver a fillable PDF that worked in Acrobat, Chrome and Preview and round-tripped through FDF without a single broken field.',
      a: 'I designed the layout first, defined a naming convention, built the fields, set tab order and export values, tested fill-and-export on three viewers and produced a field map for the client\'s developer.',
      r: 'The form shipped first time, the client returned for further work and it became one of my portfolio pieces.' },
    { title: 'Rebuilding a 767-page financial handbook', tags: ['long documents', 'process', 'QA'],
      s: 'A publishing client sent a 767-page handbook with inconsistent styles, manual numbering and a hand-typed table of contents.',
      t: 'Rebuild it with automated TOC, field codes and consistent styles under a tight deadline.',
      a: 'I created a style set, used wildcard find-and-replace to remap formatting, rebuilt numbering with multilevel lists, inserted TOC and cross-reference fields, then ran multi-pass QA in Word and LibreOffice with a checklist.',
      r: 'The handbook was delivered on time with a fully automated TOC and zero formatting rework requests.' },
    { title: 'Earning 400+ Fiverr reviews', tags: ['client communication', 'consistency', 'freelance'],
      s: 'I started freelancing in 2021 alongside a full-time role.',
      t: 'Build a sustainable reputation serving legal, healthcare, corporate, government, academic and publishing clients across time zones.',
      a: 'I standardised intake questions, quoted scope precisely, delivered previews early, documented every deliverable and handled revisions calmly and quickly.',
      r: 'Over 400 client reviews and repeat customers, plus registration as an IT/ITeS exporter with PSEB.' },
    { title: 'Weekly status reports for multi-state production', tags: ['reporting', 'stakeholders', 'Excel', 'Power BI'],
      s: 'Stewart Title Production needed weekly management reporting for Wyoming, Tennessee and other states from raw production data.',
      t: 'Turn scattered data into a management-ready report every week without errors.',
      a: 'I built a repeatable pipeline: data validation checks, Power Query cleaning, PivotTable summaries and a Power BI view, with an exceptions-first executive summary.',
      r: 'Reports went out on schedule every week, questions from management dropped because the exceptions were explained up front, and the checks caught source-data problems early.' },
    { title: 'Handling a conflict between agents and QA', tags: ['conflict', 'communication'],
      s: 'As Quality Checker, agents felt QA scoring was unfair and morale dipped.',
      t: 'Keep accuracy high without losing the team\'s trust.',
      a: 'I published the error taxonomy with examples, ran calibration sessions where agents scored samples with me, and separated coaching feedback from performance scoring.',
      r: 'Disputes on scores dropped, accuracy improved, and agents started flagging unclear instructions before errors happened.' },
    { title: 'Learning a new library under deadline (EPUB3 fixed layout)', tags: ['learning', 'adaptability'],
      s: 'A US publisher needed a fixed-layout EPUB3 for a picture book and I had only built reflowable EPUBs before.',
      t: 'Deliver a store-ready, EPUBCheck-clean file within a week.',
      a: 'I studied the EPUB3 rendition spec, built a small prototype, tested on Kindle Previewer and Apple Books, then produced the full book with automated validation.',
      r: 'The EPUB passed EPUBCheck with zero errors and was accepted by the store on the first submission.' },
    { title: 'A mistake and what I changed', tags: ['failure', 'ownership'],
      s: 'Early in freelancing I delivered a branded template suite where one template used a font that was not embedded, so it rendered incorrectly on the client\'s machine.',
      t: 'Fix the delivery and make sure it never happened again.',
      a: 'I apologised, embedded fonts across the suite the same day, and added a pre-delivery checklist item: open every file on a clean machine or LibreOffice without the fonts installed.',
      r: 'The client kept working with me, and font embedding checks became a standard step in my QA.' },
    { title: 'Prioritising when everything is urgent', tags: ['time management', 'prioritisation'],
      s: 'At Stewart, a weekly report deadline, a rate-matrix request and an ad-hoc data validation issue landed on the same afternoon.',
      t: 'Deliver what mattered most without dropping quality.',
      a: 'I clarified deadlines with each requester, did the validation first because it blocked the report, automated the report\'s manual step to save an hour, and gave the matrix requester a realistic time with a partial preview.',
      r: 'All three were delivered, the automation saved time every week afterwards, and stakeholders knew exactly when to expect each item.' }
  ],
  questions: [
    { q: 'Tell me about yourself.', a: 'Use a present–past–future structure in about 90 seconds: "I am a document production and automation specialist and data/reporting analyst with 7+ years across BPO operations, US title-insurance production support and freelance document engineering. Today at Stewart Pakistan I prepare weekly production reports for Stewart Title and build tools like an advanced rate calculator and an AI data-matrix converter. Before that I led a 20-agent team at Systems Limited, and alongside this I have delivered 400+ reviewed document projects on Fiverr, from fillable forms to EPUB3 ebooks. I am finishing a BS in Software Engineering, and I am looking for a role where I can combine automation, data and document engineering at a larger scale."' },
    { q: 'Why do you want to leave your current role?', a: 'Stay positive and forward-looking: you are grateful for the exposure to US title-insurance operations and the tools you built, and you now want more scope for automation and engineering, larger data sets, or a team where you can grow toward a senior analyst/engineer role. Never criticise the employer.' },
    { q: 'What is your greatest strength?', a: 'Pick one that matches the job and prove it with a number: "Turning messy, manual work into reliable, repeatable systems — for example the Tennessee combined rate matrix (3,346 rows, six underwriters) or the weekly reporting pipeline. I am also unusually comfortable moving between the business side (SLA, QA, client communication) and the technical side (Python, SQL, JavaScript)."' },
    { q: 'What is your greatest weakness?', a: 'Choose a real, non-fatal weakness and the fix you are applying: "I tend to over-polish deliverables. I now agree a definition of done with the requester up front and time-box the final QA pass so polish never delays delivery."' },
    { q: 'Describe a time you led a team through a difficult period.', a: 'Use the Systems Limited story: 20 agents, 100% daily target, attendance and IT issues; huddles, hourly tracking, mid-day rebalancing, coaching; result: targets met and reporting adopted by management.' },
    { q: 'Tell me about a time you disagreed with a manager or client.', a: 'Pick a scope disagreement from freelancing: the client wanted a legacy Word form; you recommended content controls for protection and compatibility, showed both in a five-minute demo, and let the client choose with the trade-offs clear. Emphasise data over opinion and that you executed the decision fully once it was made.' },
    { q: 'How do you handle tight deadlines and pressure?', a: 'Describe your system: clarify the real deadline, break the work into checkpoints, deliver a preview early, automate any repeating step, and communicate slippage before it happens. Give the "everything urgent" story.' },
    { q: 'Tell me about a mistake you made and what you learned.', a: 'Use the non-embedded font story. Own it, fix fast, change the process (clean-machine check), and show that it never recurred.' },
    { q: 'How do you ensure accuracy in your work?', a: 'Layered checks: validation rules at input, tie-outs and reconciliations on totals, sampling with an error taxonomy, a second pass in a different tool (Word vs LibreOffice, Excel vs pandas), and a written checklist. Quote the QA background: quality checker across multiple client processes.' },
    { q: 'How do you explain technical work to non-technical stakeholders?', a: 'Lead with the decision they need to make, show one chart or number, keep the method to one sentence, and offer detail on request. Example: the exceptions-first executive summary in the weekly status report.' },
    { q: 'Why should we hire you?', a: 'Map three of the job\'s needs to three proofs from your resume, then close with fit: "You need someone who can own reporting end-to-end, automate document production and communicate with US clients — I have done all three for four years, with measurable results."' },
    { q: 'Where do you see yourself in five years?', a: 'A senior automation/analytics engineer or operations-technology lead who owns systems that many people rely on, still hands-on with code and data, and mentoring others — which is why finishing the BS in Software Engineering matters to you.' },
    { q: 'How do you prioritise multiple client projects?', a: 'By deadline, dependency and impact; you quote scope precisely, keep a single task board, batch similar work (all cover designs together), and protect focus blocks for deep work like long-document rebuilds.' },
    { q: 'Describe how you learn a new tool quickly.', a: 'Read the official docs for the mental model, build a tiny end-to-end prototype the same day, then test against the real acceptance tool (EPUBCheck, Kindle Previewer, a printer\'s preflight). Use the fixed-layout EPUB story.' },
    { q: 'What do you know about our company and why this role?', a: 'Research: products, customers, tech stack, recent news. Connect two specifics to your experience. Never answer generically; if the company is in real estate, title, insurance, publishing, BPO or SaaS reporting, you have a direct story.' },
    { q: 'How do you handle feedback or criticism?', a: 'Treat it as data: thank, clarify the specific behaviour, act, and follow up to confirm the change landed. Mention calibration sessions where you invited agents to score samples with you.' },
    { q: 'Tell me about a time you improved a process.', a: 'Weekly report pipeline (validation + Power Query + PivotTables + Power BI) or the rate calculator replacing manual comparisons. Quantify time saved and errors prevented.' },
    { q: 'How do you deal with an underperforming team member?', a: 'Diagnose first (skill, will, or process), coach with their own error samples, set a short measurable improvement plan, check in daily, recognise progress publicly and escalate only with documentation if there is no change.' },
    { q: 'What questions do you have for us?', a: 'Ask about how success is measured in the first 90 days, the biggest bottleneck in their document/data workflows today, the tools and data stack, how work is reviewed, and the team\'s growth path.' },
    { q: 'What are your salary expectations?', a: 'Give a researched range anchored to the market for the role and location (or remote USD rates), state that you are flexible for the right role, and redirect to the total package. Do not give a single number first if you can avoid it.' },
    { q: 'How do you keep client data secure?', a: 'Least-privilege access, no data in public AI tools without permission, encrypted storage, redaction before sharing samples, NDAs, secure transfer links with expiry, and deletion after delivery on request.' },
    { q: 'Tell me about working with international clients across time zones.', a: 'UTC+5 with US clients: fixed overlap hours, async status updates before their morning, clear written summaries after every call, and quoting deadlines in the client\'s time zone.' },
    { q: 'Describe a time you used data to change a decision.', a: 'The combined rate matrix revealed where a competitor was cheaper in specific zones, changing which comparisons were highlighted in management reporting; or accuracy analysis by error type that shifted training focus.' },
    { q: 'What would you do in your first 30/60/90 days?', a: '30: learn the data, processes and people; ship one small fix. 60: document and automate the most painful manual step; agree KPIs. 90: deliver a measurable improvement and a roadmap for the next quarter.' }
  ],
  checklist: `### One week before
- Re-read the job description and map every requirement to a story or skill in this site.
- Do one mock interview here per day (8 questions, 2 minutes each) and one coding/SQL practice session.
- Prepare 3 portfolio items to show: rate calculator (or a demo copy), a branded document suite, a dashboard screenshot.
- Prepare 5 questions to ask.

### The day before
- Confirm time in **your** time zone (UTC+5) and theirs; add both to the calendar.
- Test camera, microphone, lighting and internet; have a phone hotspot as backup.
- Print or open your resume, the job description and your STAR story bank.
- Sleep.

### 30 minutes before
- Close every other app and notification; open only the meeting link, resume and notes.
- Water within reach, quiet room, neutral background.
- Say your 90-second introduction out loud twice.

### During
- Listen fully, pause, then answer; ask for clarification when a question is ambiguous.
- Use STAR for behavioural questions and think aloud for technical ones.
- When you do not know: say so, explain how you would find out, and offer the nearest thing you do know.
- Take note of names and any follow-ups you promised.

### After
- Send a short thank-you email within 24 hours referencing one specific topic from the conversation.
- Write down every question you were asked and add the hard ones to your story bank.
- If no answer in the stated time frame, follow up once, politely.`
};
