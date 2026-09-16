/* LearnMD — tiny Markdown + course parser shared by the browser app and tools/validate.js */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.LearnMD = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const SPECIAL = ['Try It Yourself', 'Quiz', 'Exercises', 'Interview Questions'];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function slugify(s) {
    return String(s).toLowerCase().replace(/[`*_]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }

  /* ---------- syntax highlighting (small, regex based) ---------- */
  const KW = {
    python: 'def class return if elif else for while in not and or is None True False import from as with try except finally raise lambda yield pass break continue global nonlocal assert del async await print',
    js: 'const let var function return if else for while do switch case break continue new this class extends super import export from default async await try catch finally throw typeof instanceof in of null undefined true false void delete yield static get set',
    sql: 'SELECT FROM WHERE AND OR NOT IN IS NULL AS JOIN LEFT RIGHT INNER OUTER FULL CROSS ON GROUP BY ORDER HAVING LIMIT OFFSET INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE VIEW INDEX DROP ALTER ADD PRIMARY KEY FOREIGN REFERENCES UNIQUE DEFAULT CHECK DISTINCT UNION ALL EXISTS BETWEEN LIKE CASE WHEN THEN ELSE END WITH OVER PARTITION ROW_NUMBER RANK DENSE_RANK COUNT SUM AVG MIN MAX COALESCE CAST INTEGER TEXT REAL VARCHAR INT DATE BEGIN COMMIT ROLLBACK TRANSACTION',
    bash: 'if then else fi for do done while echo cd ls cat grep sed awk export pip npm node python python3 git mkdir rm cp mv',
    excel: 'IF IFS SUMIFS COUNTIFS XLOOKUP VLOOKUP INDEX MATCH SUMPRODUCT LET LAMBDA FILTER UNIQUE SORT TEXT DATE EOMONTH IFERROR AND OR NOT TRUE FALSE SUM AVERAGE COUNT MAX MIN ROUND TEXTJOIN CONCAT LEFT RIGHT MID LEN TRIM SUBSTITUTE VALUE INDIRECT OFFSET CHOOSE SWITCH SEQUENCE',
    dax: 'CALCULATE FILTER ALL ALLEXCEPT SUM SUMX AVERAGE AVERAGEX COUNTROWS DISTINCTCOUNT RELATED RELATEDTABLE VAR RETURN IF SWITCH DIVIDE BLANK VALUES SELECTEDVALUE DATEADD SAMEPERIODLASTYEAR TOTALYTD DATESYTD EARLIER RANKX TOPN KEEPFILTERS REMOVEFILTERS USERELATIONSHIP HASONEVALUE ISBLANK FORMAT MAX MIN MEASURE EVALUATE SUMMARIZE ADDCOLUMNS',
  };
  KW.javascript = KW.js; KW.node = KW.js; KW.typescript = KW.js; KW.ts = KW.js; KW.py = KW.python;
  KW.sh = KW.bash; KW.shell = KW.bash; KW.powerquery = 'let in each if then else and or not true false null type table record list text number date';
  KW.m = KW.powerquery;

  function highlight(code, lang) {
    lang = (lang || '').toLowerCase();
    const kwSet = new Set((KW[lang] || '').split(/\s+/).filter(Boolean));
    if (lang === 'html' || lang === 'xml' || lang === 'svg' || lang === 'xhtml') return highlightMarkup(code);
    const out = [];
    let i = 0, n = code.length;
    const isCssLike = lang === 'css' || lang === 'scss';
    while (i < n) {
      const ch = code[i];
      const rest = code.slice(i);
      let m;
      // comments
      if ((lang === 'python' || lang === 'py' || lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'yaml' || lang === 'toml') && ch === '#') {
        m = rest.match(/^#[^\n]*/); out.push('<span class="tok-c">' + esc(m[0]) + '</span>'); i += m[0].length; continue;
      }
      if ((lang === 'sql') && rest.startsWith('--')) { m = rest.match(/^--[^\n]*/); out.push('<span class="tok-c">' + esc(m[0]) + '</span>'); i += m[0].length; continue; }
      if ((kwSet === kwSet) && rest.startsWith('//') && lang !== 'python' && lang !== 'sql') { m = rest.match(/^\/\/[^\n]*/); out.push('<span class="tok-c">' + esc(m[0]) + '</span>'); i += m[0].length; continue; }
      if (rest.startsWith('/*')) { m = rest.match(/^\/\*[\s\S]*?(\*\/|$)/); out.push('<span class="tok-c">' + esc(m[0]) + '</span>'); i += m[0].length; continue; }
      // strings
      if (ch === '"' || ch === "'" || ch === '`') {
        if (lang === 'python' && (rest.startsWith('"""') || rest.startsWith("'''"))) {
          const q = rest.slice(0, 3); const end = rest.indexOf(q, 3);
          const s = end === -1 ? rest : rest.slice(0, end + 3);
          out.push('<span class="tok-s">' + esc(s) + '</span>'); i += s.length; continue;
        }
        let j = i + 1;
        while (j < n && code[j] !== ch) { if (code[j] === '\\') j++; if (code[j] === '\n' && ch !== '`') break; j++; }
        const s = code.slice(i, Math.min(j + 1, n));
        out.push('<span class="tok-s">' + esc(s) + '</span>'); i += s.length; continue;
      }
      // numbers
      if (/[0-9]/.test(ch) && !/[A-Za-z_]/.test(code[i - 1] || '')) {
        m = rest.match(/^\d[\d_]*(\.\d+)?([eE][+-]?\d+)?[a-zA-Z%]*/); out.push('<span class="tok-n">' + esc(m[0]) + '</span>'); i += m[0].length; continue;
      }
      // identifiers / keywords
      if (/[A-Za-z_$@]/.test(ch)) {
        m = rest.match(/^[A-Za-z_$@][\w$]*/); const w = m[0];
        const isKw = kwSet.has(w) || (lang === 'sql' && kwSet.has(w.toUpperCase())) || ((lang === 'excel' || lang === 'dax') && kwSet.has(w.toUpperCase()));
        if (isKw) out.push('<span class="tok-k">' + esc(w) + '</span>');
        else if (/^[A-Z][A-Za-z0-9]+$/.test(w) && lang !== 'sql' && lang !== 'excel' && lang !== 'dax') out.push('<span class="tok-t">' + esc(w) + '</span>');
        else if (code[i + w.length] === '(') out.push('<span class="tok-f">' + esc(w) + '</span>');
        else if (isCssLike && code[i + w.length] === ':') out.push('<span class="tok-p">' + esc(w) + '</span>');
        else out.push(esc(w));
        i += w.length; continue;
      }
      if (isCssLike && ch === '.' || (isCssLike && ch === '#')) { m = rest.match(/^[.#][\w-]+/); if (m) { out.push('<span class="tok-t">' + esc(m[0]) + '</span>'); i += m[0].length; continue; } }
      out.push(esc(ch)); i++;
    }
    return out.join('');
  }

  function highlightMarkup(code) {
    return esc(code)
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-c">$1</span>')
      .replace(/(&lt;\/?)([\w:-]+)([^&]*?)(\/?&gt;)/g, function (_, o, tag, attrs, c) {
        attrs = attrs.replace(/([\w:-]+)(=)(&quot;[^&]*?&quot;|'[^']*')/g, '<span class="tok-p">$1</span>$2<span class="tok-s">$3</span>');
        return '<span class="tok-k">' + o + tag + '</span>' + attrs + '<span class="tok-k">' + c + '</span>';
      });
  }

  /* ---------- inline markdown ---------- */
  function inline(s) {
    // protect code spans first
    const codes = [];
    s = s.replace(/`([^`\n]+)`/g, function (_, c) { codes.push('<code>' + esc(c) + '</code>'); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return codes[+i]; });
    return s;
  }

  /* ---------- block markdown ---------- */
  function render(md) {
    const lines = String(md).replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let i = 0;
    const para = [];
    function flushPara() {
      if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para.length = 0; }
    }
    while (i < lines.length) {
      const line = lines[i];
      // fenced code
      let m = line.match(/^\s*(```+|~~~+)\s*([\w+-]*)\s*$/);
      if (m) {
        flushPara();
        const fence = m[1]; const lang = m[2] || '';
        const buf = []; i++;
        while (i < lines.length && !lines[i].trim().startsWith(fence)) { buf.push(lines[i]); i++; }
        i++;
        const code = buf.join('\n');
        out.push('<div class="codeblock" data-lang="' + esc(lang) + '"><div class="codebar"><span class="lang">' + esc(lang || 'text') + '</span><button type="button" class="copy-btn" data-copy>Copy</button></div><pre><code class="lang-' + esc(lang) + '">' + highlight(code, lang) + '</code></pre></div>');
        continue;
      }
      // blank
      if (!line.trim()) { flushPara(); i++; continue; }
      // headings
      m = line.match(/^(#{1,6})\s+(.*)$/);
      if (m) { flushPara(); const lvl = Math.min(6, m[1].length + 1); const t = m[2].replace(/\s+#+$/, ''); out.push('<h' + lvl + ' id="' + slugify(t) + '">' + inline(t) + '</h' + lvl + '>'); i++; continue; }
      // hr
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flushPara(); out.push('<hr>'); i++; continue; }
      // raw html block
      if (/^\s*<\/?(details|summary|div|table|thead|tbody|tr|td|th|kbd|br|p|ul|ol|li|span|img|figure|figcaption|section|iframe|video|audio|source|hr|h[1-6])\b/i.test(line)) {
        flushPara();
        // summary lines may contain markdown text — keep raw
        out.push(line); i++; continue;
      }
      // blockquote / callout
      if (/^\s*>/.test(line)) {
        flushPara();
        const buf = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
        const inner = buf.join('\n');
        const kind = (inner.match(/^\*\*(Tip|Note|Warning|Interview note|Interview|Example|Important|Remember|Pro tip|Caution|Key idea)\b/i) || [])[1];
        const cls = kind ? ' callout callout-' + kind.toLowerCase().split(' ')[0] : '';
        out.push('<blockquote class="' + cls.trim() + '">' + render(inner) + '</blockquote>');
        continue;
      }
      // table
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        flushPara();
        const header = splitRow(line);
        i += 2;
        const rows = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
        let t = '<div class="table-wrap"><table><thead><tr>' + header.map(function (h) { return '<th>' + inline(h) + '</th>'; }).join('') + '</tr></thead><tbody>';
        rows.forEach(function (r) { t += '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>'; });
        out.push(t + '</tbody></table></div>');
        continue;
      }
      // lists (supports one nesting level and task checkboxes)
      if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
        flushPara();
        out.push(renderList(lines, i, function (j) { i = j; }));
        continue;
      }
      para.push(line.trim());
      i++;
    }
    flushPara();
    return out.join('\n');
  }

  function splitRow(row) {
    return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
  }

  function renderList(lines, start, setIndex) {
    let i = start;
    const first = lines[i].match(/^(\s*)([-*+]|\d+[.)])\s+/);
    const baseIndent = first[1].length;
    const ordered = /\d/.test(first[2]);
    const items = [];
    while (i < lines.length) {
      const l = lines[i];
      const m = l.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
      if (m && m[1].length === baseIndent) {
        items.push({ text: m[3], sub: [] }); i++; continue;
      }
      if (m && m[1].length > baseIndent && items.length) { items[items.length - 1].sub.push(l); i++; continue; }
      if (!l.trim()) {
        // blank line: list continues only if next non-blank line is a list item at base indent or indented continuation
        let k = i + 1; while (k < lines.length && !lines[k].trim()) k++;
        if (k < lines.length && (/^(\s*)([-*+]|\d+[.)])\s+/.test(lines[k]) && lines[k].match(/^(\s*)/)[1].length === baseIndent || (lines[k].match(/^(\s*)/)[1].length > baseIndent && items.length))) { if (items.length) items[items.length - 1].sub.push(''); i = k; continue; }
        break;
      }
      if (l.match(/^(\s*)/)[1].length > baseIndent && items.length) { items[items.length - 1].sub.push(l); i++; continue; }
      break;
    }
    setIndex(i);
    const tag = ordered ? 'ol' : 'ul';
    const startNum = ordered ? parseInt(first[2], 10) : 1;
    let html = '<' + tag + (ordered && startNum > 1 ? ' start="' + startNum + '"' : '') + '>';
    items.forEach(function (it) {
      let text = it.text; let cls = '';
      const task = text.match(/^\[( |x|X)\]\s+(.*)$/);
      if (task) { cls = ' class="task' + (task[1].trim() ? ' done' : '') + '"'; text = '<span class="box">' + (task[1].trim() ? '☑' : '☐') + '</span> ' + inline(task[2]); }
      else text = inline(text);
      let sub = '';
      if (it.sub.length) {
        const minIndent = Math.min.apply(null, it.sub.filter(function (s) { return s.trim(); }).map(function (s) { return s.match(/^(\s*)/)[1].length; }));
        sub = render(it.sub.map(function (s) { return s.slice(minIndent); }).join('\n'));
      }
      html += '<li' + cls + '>' + text + sub + '</li>';
    });
    return html + '</' + tag + '>';
  }

  /* ---------- course parser ---------- */
  function parseFrontMatter(text) {
    const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!m) return { meta: {}, body: text, error: 'Missing front matter' };
    const meta = {};
    m[1].split('\n').forEach(function (l) {
      const mm = l.match(/^([A-Za-z_]+)\s*:\s*(.*)$/); if (mm) meta[mm[1].trim()] = mm[2].trim();
    });
    return { meta: meta, body: text.slice(m[0].length) };
  }

  function parseQuiz(md) {
    const qs = [];
    const lines = md.split('\n');
    let cur = null;
    lines.forEach(function (l) {
      let m = l.match(/^\s*\d+[.)]\s+(.*)$/);
      if (m) { cur = { q: m[1], options: [], answer: -1, explain: '' }; qs.push(cur); return; }
      m = l.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/);
      if (m && cur) { if (m[1].trim()) cur.answer = cur.options.length; cur.options.push(m[2]); return; }
      m = l.match(/^\s*>\s?(.*)$/);
      if (m && cur) { cur.explain += (cur.explain ? ' ' : '') + m[1]; return; }
      if (cur && l.trim() && !cur.options.length) cur.q += ' ' + l.trim();
    });
    return qs;
  }

  function parseInterview(md) {
    const out = [];
    const lines = md.split('\n');
    let cur = null;
    lines.forEach(function (l) {
      const m = l.match(/^\s*\*\*Q:\s*(.*?)\*\*\s*$/);
      if (m) { cur = { q: m[1], a: [] }; out.push(cur); return; }
      if (cur) cur.a.push(l);
    });
    out.forEach(function (x) { x.a = x.a.join('\n').trim(); });
    return out;
  }

  function parseTryIt(md) {
    const m = md.match(/(```+|~~~+)\s*([\w+-]*)\s*\n([\s\S]*?)\n\1/);
    if (!m) return null;
    return { lang: m[2] || '', code: m[3] };
  }

  function parseCourse(text) {
    const fm = parseFrontMatter(text);
    const meta = fm.meta;
    const levels = [];
    const problems = [];
    if (fm.error) problems.push(fm.error);
    const lines = fm.body.replace(/\r\n?/g, '\n').split('\n');
    let curLevel = null, curChapter = null, curSection = null, inFence = null;
    const seen = new Set();
    function pushLine(l) {
      if (!curChapter) { if (l.trim()) problems.push('Content before first chapter: ' + l.slice(0, 40)); return; }
      if (curSection) curChapter.sections[curSection].push(l); else curChapter.bodyLines.push(l);
    }
    lines.forEach(function (l, idx) {
      const fm2 = l.match(/^\s*(```+|~~~+)/);
      if (fm2) { if (!inFence) inFence = fm2[1]; else if (l.trim().startsWith(inFence)) inFence = null; pushLine(l); return; }
      if (inFence) { pushLine(l); return; }
      let m = l.match(/^#\s+LEVEL:\s*(.+?)\s*$/i);
      if (m) { curLevel = { name: m[1], chapters: [] }; levels.push(curLevel); curChapter = null; curSection = null; return; }
      m = l.match(/^##\s+(.+?)\s*$/);
      if (m) {
        if (!curLevel) { problems.push('Chapter "' + m[1] + '" appears before any # LEVEL:'); curLevel = { name: 'Beginner', chapters: [] }; levels.push(curLevel); }
        let id = slugify(m[1]); let base = id; let k = 2; while (seen.has(id)) id = base + '-' + (k++); seen.add(id);
        curChapter = { id: id, title: m[1], line: idx + 1, bodyLines: [], sections: { 'Try It Yourself': [], 'Quiz': [], 'Exercises': [], 'Interview Questions': [] } };
        curLevel.chapters.push(curChapter); curSection = null; return;
      }
      m = l.match(/^###\s+(.+?)\s*$/);
      if (m && SPECIAL.indexOf(m[1].trim()) !== -1) { curSection = m[1].trim(); return; }
      pushLine(l);
    });
    const chapters = [];
    levels.forEach(function (lv) {
      lv.chapters.forEach(function (ch) {
        ch.level = lv.name;
        ch.body = ch.bodyLines.join('\n').trim();
        ch.tryit = parseTryIt(ch.sections['Try It Yourself'].join('\n'));
        ch.quiz = parseQuiz(ch.sections['Quiz'].join('\n'));
        ch.exercises = ch.sections['Exercises'].join('\n').trim();
        ch.interview = parseInterview(ch.sections['Interview Questions'].join('\n'));
        ch.words = ch.body.split(/\s+/).filter(Boolean).length;
        delete ch.bodyLines; delete ch.sections;
        chapters.push(ch);
      });
    });
    return { meta: meta, levels: levels, chapters: chapters, problems: problems };
  }

  function validateCourse(course, expectedId) {
    const errs = [], warns = [];
    const m = course.meta;
    ['id', 'title', 'icon', 'track', 'color', 'runner', 'tagline', 'description'].forEach(function (k) { if (!m[k]) errs.push('front matter missing "' + k + '"'); });
    if (expectedId && m.id && m.id !== expectedId) errs.push('id "' + m.id + '" does not match file name "' + expectedId + '"');
    if (m.runner && ['python', 'js', 'html', 'sql', 'none'].indexOf(m.runner) === -1) errs.push('unknown runner "' + m.runner + '"');
    const names = course.levels.map(function (l) { return l.name; });
    if (names.join(',') !== LEVELS.join(',')) errs.push('levels must be exactly ' + LEVELS.join(', ') + ' (found: ' + names.join(', ') + ')');
    course.problems.forEach(function (p) { errs.push(p); });
    course.levels.forEach(function (lv) {
      if (lv.chapters.length < 2) errs.push('level ' + lv.name + ' has only ' + lv.chapters.length + ' chapter(s)');
      lv.chapters.forEach(function (ch) {
        const where = lv.name + ' / "' + ch.title + '" (line ' + ch.line + ')';
        if (ch.words < 120) errs.push(where + ': body too short (' + ch.words + ' words)');
        if (!ch.quiz.length) warns.push(where + ': no quiz');
        ch.quiz.forEach(function (q, qi) {
          if (q.options.length < 2) errs.push(where + ': quiz Q' + (qi + 1) + ' has < 2 options');
          if (q.answer < 0) errs.push(where + ': quiz Q' + (qi + 1) + ' has no [x] answer');
          if (!q.explain) warns.push(where + ': quiz Q' + (qi + 1) + ' has no explanation');
        });
        if (!ch.interview.length) warns.push(where + ': no interview questions');
        ch.interview.forEach(function (iq, k) { if (!iq.a || iq.a.length < 30) errs.push(where + ': interview Q' + (k + 1) + ' answer missing/too short'); });
        if (!ch.exercises) warns.push(where + ': no exercises');
        if (!ch.tryit && m.runner !== 'none') warns.push(where + ': no Try It Yourself block');
        if (/lorem ipsum|\bTODO\b|\bTBD\b|\[insert /i.test(ch.body)) errs.push(where + ': placeholder text found');
        if (/^\s*<h[1-6]/m.test(ch.body)) warns.push(where + ': raw HTML heading used');
      });
    });
    return { errors: errs, warnings: warns };
  }

  return { render: render, inline: inline, highlight: highlight, esc: esc, slugify: slugify, parseCourse: parseCourse, validateCourse: validateCourse, LEVELS: LEVELS };
});
