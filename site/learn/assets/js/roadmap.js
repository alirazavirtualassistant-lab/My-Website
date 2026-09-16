/* 24-week roadmap with persistent checkboxes */
(function () {
  'use strict';
  App.renderTopbar('roadmap');
  const PHASES = [
    { title: 'Phase 1 · Foundations refresh', when: 'Weeks 1–3 · ~1.5 h/day', goal: 'Rebuild the base quickly; you already use these daily, so move fast and fill gaps.', items: [
      ['python', 'Python — finish Beginner + Intermediate, all quizzes green'],
      ['javascript', 'JavaScript — Beginner + Intermediate'],
      ['html', 'HTML — all levels (short course)'],
      ['css', 'CSS — Beginner + Intermediate'],
      ['sql', 'SQL — Beginner + Intermediate, solve every SQL challenge in Practice'],
      ['git-devtools', 'Git & Dev Tools — Beginner + Intermediate; put one project on GitHub'],
      [null, 'Milestone: solve 10 easy Practice challenges without hints']
    ] },
    { title: 'Phase 2 · Document engineering depth', when: 'Weeks 4–8', goal: 'Turn your Fiverr experience into explainable, interview-grade expertise.', items: [
      ['ooxml', 'OOXML & DOCX Internals — all levels'],
      ['python-docx', 'python-docx — all levels; rebuild one client deliverable from JSON'],
      ['docx-js', 'docx-js — all levels; generate a branded letterhead in the browser Try-It'],
      ['word-expert', 'Microsoft Word Expert — Advanced + Expert (templates, field codes, fonts)'],
      ['reportlab', 'ReportLab — all levels'],
      ['weasyprint', 'WeasyPrint — all levels; build a paged report with running headers'],
      ['pymupdf', 'PyMuPDF — all levels'],
      ['pikepdf', 'pikepdf — all levels'],
      ['pdfplumber', 'pdfplumber — all levels; extract one real rate table to Excel'],
      ['pdf-forms', 'Fillable PDF & DOCX Forms — all levels'],
      ['epub3', 'EPUB3 — all levels'],
      ['prepress', 'Print-Ready PDF & Prepress — all levels'],
      ['pptxgenjs', 'PptxGenJS — all levels'],
      ['libreoffice-automation', 'LibreOffice & Headless Automation — all levels'],
      [null, 'Milestone: write a one-page architecture doc for a JSON → branded DOCX/PDF pipeline (Practice: "Design a JSON → branded DOCX pipeline")']
    ] },
    { title: 'Phase 3 · Data & reporting mastery', when: 'Weeks 9–13', goal: 'Be the analyst who can defend every number.', items: [
      ['excel', 'Advanced Excel — all levels; complete every Excel challenge'],
      ['pandas', 'pandas — all levels'],
      ['openpyxl', 'openpyxl — all levels; automate one weekly report end-to-end'],
      ['powerbi', 'Power BI — all levels; build a production dashboard with a date table and 5 DAX measures'],
      ['data-cleaning-reporting', 'Data Cleaning, Validation & KPI Reporting — all levels'],
      ['spss-eviews', 'SPSS & EViews — all levels'],
      ['databases', 'Database Systems — all levels'],
      [null, 'Milestone: present a 5-slide weekly production report deck built from data (use PptxGenJS or PowerPoint)']
    ] },
    { title: 'Phase 4 · Computer science & engineering', when: 'Weeks 14–18', goal: 'Cover the BS-SE viva and technical screens for developer roles.', items: [
      ['dsa', 'Data Structures & Algorithms — all levels; solve all DSA challenges'],
      ['oop', 'Object-Oriented Programming — all levels'],
      ['python', 'Python — Advanced + Expert'],
      ['javascript', 'JavaScript — Advanced + Expert'],
      ['nodejs', 'Node.js — all levels; build a CLI that batch-converts DOCX to PDF'],
      ['sdlc', 'Software Engineering & SDLC — all levels'],
      ['networks', 'Computer Networks — all levels'],
      ['llm-api', 'LLM & AI API Integration — all levels; rebuild a mini Data Matrix AI Converter'],
      [null, 'Milestone: 45-minute timed mock coding session (3 medium DSA problems) with no hints']
    ] },
    { title: 'Phase 5 · Office, domain & leadership', when: 'Weeks 19–21', goal: 'Round out the resume claims interviewers will probe.', items: [
      ['powerpoint-expert', 'PowerPoint Expert — all levels'],
      ['workspace-tools', 'Microsoft 365, Outlook & Google Workspace — all levels'],
      ['design-tools', 'Photoshop, CorelDRAW & InPage — all levels'],
      ['citations', 'Citation & Reference Management — all levels'],
      ['title-insurance', 'Title Insurance & Title Search — all levels'],
      ['leadership-qa', 'Team Leadership, QA & SLA Management — all levels'],
      [null, 'Milestone: write your 12 STAR stories in your own words (Interview Prep → STAR stories)']
    ] },
    { title: 'Phase 6 · Interview sprint', when: 'Weeks 22–24', goal: 'Convert knowledge into offers.', items: [
      ['interview-mastery', 'Interview Mastery — all levels'],
      [null, 'Daily: one 8-question mock interview (mixed) — self-rate ≥ 7/8 three days in a row'],
      [null, 'Daily: 20 flashcards from your weakest two courses'],
      [null, 'Twice a week: one timed take-home style task (Practice → SQL/pandas/Excel hard challenges)'],
      [null, 'Update resume, LinkedIn and portfolio (alirazaworks.com) with the projects you built during this roadmap'],
      [null, 'Apply: 5 targeted applications per week, each with a tailored 90-second introduction'],
      [null, 'Milestone: complete every course to 100% and every Practice challenge']
    ] }
  ];
  const state = App.load('sf.roadmap', {});
  const box = App.el('#roadmap');
  function render() {
    let total = 0, done = 0;
    box.innerHTML = PHASES.map(function (p, pi) {
      return '<div class="phase"><h3>' + App.esc(p.title) + '</h3><div class="when">' + App.esc(p.when) + ' · ' + App.esc(p.goal) + '</div><ul>' + p.items.map(function (it, ii) {
        const key = pi + '.' + ii; total++; const ok = !!state[key]; if (ok) done++;
        const c = it[0] ? App.courseById(it[0]) : null;
        const pct = c ? Math.round(App.progress.countDone(c.id) / Math.max(1, c.chapters) * 100) : null;
        return '<li class="' + (ok ? 'done' : '') + '"><input type="checkbox" data-k="' + key + '"' + (ok ? ' checked' : '') + '> <span class="txt">' + (c ? '<a href="course.html?c=' + encodeURIComponent(c.id) + '">' + App.esc(c.icon + ' ' + c.title) + '</a> — ' : '') + App.esc(it[1].replace(/^[^—]+— /, c ? '' : '')) + (pct ? ' <span class="badge">' + pct + '% done</span>' : '') + '</span></li>';
      }).join('') + '</ul></div>';
    }).join('');
    App.el('#rm-progress').textContent = done + ' / ' + total + ' items complete (' + Math.round(done / total * 100) + '%)';
  }
  box.addEventListener('change', function (e) { const cb = e.target.closest('input[data-k]'); if (!cb) return; state[cb.getAttribute('data-k')] = cb.checked; App.save('sf.roadmap', state); render(); });
  App.el('#rm-reset').addEventListener('click', function () { if (confirm('Clear the roadmap checklist?')) { Object.keys(state).forEach(function (k) { delete state[k]; }); App.save('sf.roadmap', state); render(); } });
  render();
})();
