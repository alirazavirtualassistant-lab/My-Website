# Course content spec (courses/*.md)

Every course is ONE Markdown file in `courses/`, named `<id>.md`. It is parsed at
runtime by `assets/js/md.js` and validated by `node tools/validate.js`.

## 1. Front matter (required, first thing in the file)

```
---
id: python
title: Python
icon: 🐍
track: Programming
color: #3776AB
runner: python
packages: 
tagline: The language behind every document pipeline you will build.
description: Two or three sentences describing what the course covers and who it is for.
---
```

* `id` must equal the file name without `.md` (lowercase, hyphens only).
* `track` is one of: `Programming`, `Document Engineering`, `Data & Reporting`,
  `Office & Tools`, `AI & Automation`, `Computer Science`, `Operations & Career`.
* `runner` is one of: `python`, `js`, `html`, `sql`, `none`.
  It decides what the "Try it Yourself" button does.
  - `python` runs in the browser via Pyodide. `packages:` may list pip packages
    to try to install (comma separated, e.g. `python-docx, openpyxl`).
  - `js` runs JavaScript in the browser and shows console output. `libs:` may
    list CDN script URLs (comma separated) that are loaded before the code
    (e.g. the browser build of `docx` or `pptxgenjs`).
  - `html` shows a live preview of HTML/CSS/JS.
  - `sql` runs SQLite in the browser via sql.js.
  - `none` shows the code with a copy button (for tools that cannot run in a
    browser, e.g. PyMuPDF, pikepdf, Power BI, Excel).

## 2. Levels and chapters

```
# LEVEL: Beginner
## Chapter title
...chapter body...
## Next chapter
...
# LEVEL: Intermediate
...
# LEVEL: Advanced
...
# LEVEL: Expert
...
```

* Exactly these four levels, in this order: Beginner, Intermediate, Advanced, Expert.
* Aim for 3–5 chapters per level (12–18 per course). Chapter titles must be unique.
* A chapter body is normal Markdown: paragraphs, `###`/`####` sub-headings,
  fenced code blocks with a language tag, tables, lists, bold, inline code,
  blockquotes. Use `> **Tip:**`, `> **Warning:**`, `> **Interview note:**` for
  call-outs. Raw HTML `<details><summary>…</summary>…</details>` is allowed.
* Write like W3Schools: short paragraphs, one concept at a time, an example
  after every concept, then explain the example. Be concrete and complete.
  Beginner chapters assume zero knowledge. Expert chapters cover internals,
  performance, edge cases, production practices and "what interviewers probe".

## 3. Special sections inside a chapter (in this order, all optional but strongly encouraged)

### `### Try It Yourself`
Exactly one fenced code block that the learner can run/edit. Match the course runner.

### `### Quiz`
3–5 questions. Format is strict:

```
1. What does `len("abc")` return?
- [ ] "abc"
- [x] 3
- [ ] 2
> `len` counts characters, and "abc" has three.
```

One `[x]` per question. The `>` explanation line is required.

### `### Exercises`
2–4 exercises. Format:

```
1. **Reverse a string** — Write a function that returns its argument reversed.
<details><summary>Solution</summary>

```python
def rev(s):
    return s[::-1]
```

</details>
```

### `### Interview Questions`
3–6 questions with model answers. Format:

```
**Q: What is the difference between a list and a tuple?**
Lists are mutable, tuples are not. ... (2–8 sentences, may include a code block)
```

## 4. Style rules
* No placeholder text. Every chapter must be genuinely teachable.
* Prefer examples from the learner's world: documents, PDFs, reports, dashboards,
  title-insurance production data, BPO operations.
* Code must be correct and runnable where the runner allows it.
* Do not use HTML headings; use Markdown `###` and `####` only (`#` and `##` are reserved).
