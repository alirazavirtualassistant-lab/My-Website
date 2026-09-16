# SkillForge — W3Schools-style learning platform for Ali Raza's skill set

A static, no-build learning site that covers every skill on the resume — from absolute beginner to expert — with runnable examples, quizzes, exercises, a practice lab and a full interview-prep hub.

Published at: `https://alirazavirtualassistant-lab.github.io/my-website/learn/`

## What is inside

| Page | What it does |
|---|---|
| `index.html` | Course catalogue grouped by track, progress bars, "continue learning", global search |
| `course.html?c=<id>` | Course viewer: chapter sidebar (Beginner → Expert), lesson body, Try-It block, quiz with instant feedback, exercises with hidden solutions, interview questions, mark-complete |
| `tryit.html` | Try-It editor. Runs **HTML/CSS/JS** natively, **JavaScript** in a sandboxed iframe (with optional libraries: `docx`, `pptxgenjs`, `pdf-lib`), **Python** via Pyodide (installs `python-docx`, `openpyxl`, … with micropip), **SQL** via sql.js (SQLite). Edits are saved locally. |
| `practice.html` | Practice Lab: 52 challenges with automatic tests (Python, JavaScript, SQL, pandas, DSA, python-docx/openpyxl) and self-check tasks (Excel, Power BI, document engineering) |
| `interview.html` | Interview Prep: every interview question from every course (searchable, filter by course), flashcards, timed mock interview with self-scoring, 12 STAR stories mined from the resume, interview-day checklist |
| `roadmap.html` | 24-week study roadmap with a persistent checklist and live course progress |

Progress, quiz scores, code edits and checklists are stored in the browser's `localStorage` (no accounts, no server).

## Courses (40)

**Programming** — Python · JavaScript · HTML · CSS · SQL · Node.js · OOP · Git & Dev Tools
**Document Engineering** — python-docx · docx-js · OOXML internals · openpyxl · ReportLab · WeasyPrint · PyMuPDF · pikepdf · pdfplumber · PptxGenJS · Fillable PDF & DOCX forms · EPUB3 · Print-ready PDF & prepress · LibreOffice headless automation
**Data & Reporting** — Advanced Excel · Power BI · pandas · Data cleaning, validation & KPI reporting · SPSS & EViews
**Office & Tools** — Word Expert · PowerPoint Expert · Microsoft 365 / Outlook / Google Workspace · Photoshop, CorelDRAW & InPage · Citation management (EndNote, Mendeley, Zotero)
**AI & Automation** — LLM & AI API integration
**Computer Science** — Data Structures & Algorithms · Database Systems · Software Engineering & SDLC · Computer Networks
**Operations & Career** — Team leadership, QA & SLA · Title insurance & title search · Interview Mastery

Each course has four levels (Beginner, Intermediate, Advanced, Expert) with 3–5 chapters per level.

## Run locally

The pages load course content with `fetch`, so serve the folder over HTTP (opening `index.html` from disk will not load courses):

```bash
cd site/learn
python3 -m http.server 8080
# open http://localhost:8080
```

Python/SQL runners and the docx/pptxgenjs/pdf-lib libraries load from public CDNs (jsdelivr / cdnjs) on first use, so those need internet access. HTML and JavaScript examples run fully offline.

## Adding or editing a course

1. Read `CONTENT-SPEC.md` (format) and `courses/_example.md` (template).
2. Create `courses/<id>.md` with front matter, four `# LEVEL:` sections and `##` chapters.
3. Validate and rebuild the catalogue, search index and interview bank:

```bash
node tools/validate.js            # all courses (or: node tools/validate.js python)
node tools/build-catalog.js       # regenerates assets/js/catalog.js, data/search-index.json, data/interview-bank.json
```

Commit the regenerated files together with the course.

## File structure

```
learn/
├── index.html · course.html · tryit.html · practice.html · interview.html · roadmap.html
├── CONTENT-SPEC.md              Course file format
├── courses/*.md                 One Markdown file per course (40)
├── data/
│   ├── challenges.js            Practice Lab challenges + tests
│   ├── behavioral.js            Behavioural questions, STAR stories, checklist
│   ├── search-index.json        generated
│   └── interview-bank.json      generated
├── assets/css/learn.css         Design system (light/dark)
├── assets/js/
│   ├── md.js                    Markdown renderer + course parser + highlighter (browser & Node)
│   ├── app.js                   Shared runtime: theme, topbar, search, progress, course loading
│   ├── engines.js               JS sandbox, Pyodide, sql.js engines
│   ├── course.js · runner.js · practice.js · interview.js · roadmap.js
│   └── catalog.js               generated
└── tools/
    ├── validate.js              Content validator
    └── build-catalog.js         Catalogue / index generator
```

## Offline (download and open, no server)

For a copy that works by double-clicking with no web server or internet:

```bash
cd site/learn
node tools/build-offline.js     # writes dist-offline/skillforge/ with all content inlined
```

Then open `dist-offline/skillforge/index.html` in any browser, or zip that folder and share it. All reading, quizzes, exercises, interview prep, flashcards, the mock interview and the roadmap work fully offline; only the Python/SQL "Try it Yourself" runners and generating real Office/PDF files still need internet the first time.
