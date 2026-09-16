/* Try-It editor page */
(function () {
  'use strict';
  App.renderTopbar('home');
  const code = App.el('#code'), out = App.el('#output'), preview = App.el('#preview'), status = App.el('#run-status'), saveStatus = App.el('#save-status');
  const runnerSel = App.el('#runner-select'), runBtn = App.el('#run-btn');
  const cid = App.qs('c'), chid = App.qs('ch');
  let lessonCode = '', meta = { runner: App.qs('runner') || 'html', packages: App.qs('packages') || '', libs: App.qs('libs') || '' };
  const storeKey = 'sf.code.' + (cid || 'scratch') + '.' + (chid || meta.runner);

  const DEFAULTS = {
    html: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: sans-serif; padding: 20px; }\n  h1 { color: #04aa6d; }\n</style>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n  <p>Edit the code and press Run.</p>\n</body>\n</html>',
    js: 'const pages = [12, 40, 135];\nconst total = pages.reduce((a, b) => a + b, 0);\nconsole.log("Total pages:", total);',
    python: 'pages = [12, 40, 135]\nprint("Total pages:", sum(pages))',
    sql: 'CREATE TABLE production (id INTEGER PRIMARY KEY, state TEXT, files INTEGER);\nINSERT INTO production (state, files) VALUES (\'Wyoming\', 120), (\'Tennessee\', 340), (\'Texas\', 90);\nSELECT state, files FROM production ORDER BY files DESC;',
    none: '# Paste or write code here.\n'
  };

  function setRunner(r) {
    meta.runner = r; runnerSel.value = r;
    const isHtml = r === 'html';
    preview.style.display = isHtml ? 'block' : 'none';
    out.style.display = isHtml ? 'none' : 'block';
    runBtn.disabled = r === 'none';
    runBtn.textContent = r === 'none' ? 'Cannot run in browser' : '▶ Run (Ctrl+Enter)';
  }

  function init() {
    if (cid && chid) {
      App.el('#back-link').href = 'course.html?c=' + encodeURIComponent(cid) + '&ch=' + encodeURIComponent(chid);
      App.loadCourse(cid).then(function (course) {
        const ch = course.chapters.filter(function (c) { return c.id === chid; })[0];
        meta.runner = course.meta.runner || 'none'; meta.packages = course.meta.packages || ''; meta.libs = course.meta.libs || '';
        App.el('#ed-title').textContent = course.meta.icon + ' ' + course.meta.title + ' › ' + (ch ? ch.title : '');
        document.title = (ch ? ch.title : 'Try It') + ' · Try It · SkillForge';
        lessonCode = ch && ch.tryit ? ch.tryit.code : DEFAULTS[meta.runner] || '';
        if (ch && ch.tryit && ch.tryit.lang && meta.runner === 'none') {
          const l = ch.tryit.lang.toLowerCase();
          if (l === 'js' || l === 'javascript') meta.runner = 'js';
          if (l === 'html') meta.runner = 'html';
          if (l === 'sql') meta.runner = 'sql';
        }
        setRunner(meta.runner);
        const saved = App.load(storeKey, null);
        code.value = saved != null ? saved : lessonCode;
        if (saved != null) saveStatus.textContent = 'Restored your edits';
        if (meta.runner === 'none') out.innerHTML = '<span class="info">This tool needs native software (or a desktop app) and cannot run inside a browser. Copy the code and run it on your machine — see the lesson for install steps. You can still edit and download it here.</span>';
        else run();
      }).catch(function (e) { out.innerHTML = '<span class="err">Could not load lesson: ' + App.esc(e.message) + '</span>'; });
    } else {
      setRunner(meta.runner);
      lessonCode = DEFAULTS[meta.runner] || '';
      code.value = App.load(storeKey, null) || lessonCode;
    }
  }

  runnerSel.addEventListener('change', function () { setRunner(runnerSel.value); if (!code.value.trim()) code.value = DEFAULTS[runnerSel.value] || ''; });
  runBtn.addEventListener('click', run);
  App.el('#reset-btn').addEventListener('click', function () { code.value = lessonCode; try { localStorage.removeItem(storeKey); } catch (e) {} saveStatus.textContent = 'Reset to lesson code'; if (meta.runner !== 'none') run(); });
  App.el('#download-btn').addEventListener('click', function () {
    const ext = { html: 'html', js: 'js', python: 'py', sql: 'sql', none: 'txt' }[meta.runner] || 'txt';
    const b = new Blob([code.value], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = (chid || 'tryit') + '.' + ext; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  let saveT = null;
  code.addEventListener('input', function () { clearTimeout(saveT); saveT = setTimeout(function () { App.save(storeKey, code.value); saveStatus.textContent = 'Saved locally'; }, 400); });
  code.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    if (e.key === 'Tab') { e.preventDefault(); const s = code.selectionStart, en = code.selectionEnd; code.value = code.value.slice(0, s) + '    ' + code.value.slice(en); code.selectionStart = code.selectionEnd = s + 4; }
  });

  function log(text, kind) {
    const d = document.createElement('div');
    if (kind === 'error') d.className = 'err'; else if (kind === 'info' || kind === 'warn') d.className = 'info';
    if (kind === 'html') d.innerHTML = text; else d.textContent = (kind === 'warn' ? '⚠ ' : '') + text;
    out.appendChild(d); out.scrollTop = out.scrollHeight;
  }
  function clear() { out.innerHTML = ''; }

  function run() {
    const src = code.value;
    clear();
    if (meta.runner === 'html') { status.textContent = 'Rendered'; preview.srcdoc = src; return; }
    status.textContent = 'Running…';
    if (meta.runner === 'js') {
      Engines.js(src, { libs: meta.libs, onOut: log }).then(function () { status.textContent = 'Finished'; if (!out.children.length) log('(no output — use console.log to print something)', 'info'); });
    } else if (meta.runner === 'python') {
      Engines.python(src, { packages: meta.packages, onOut: function (t, k) { if (k === 'info' && /^(Loading|Installing)/.test(t)) { log(t, 'info'); return; } log(t, k); } }).then(function () { status.textContent = 'Finished'; if (!out.children.length) log('(no output — use print() to show something)', 'info'); }, function (e) { status.textContent = 'Error'; log(String(e.message || e), 'error'); });
    } else if (meta.runner === 'sql') {
      Engines.sql(src, { onOut: log }).then(function (results) {
        clear();
        if (!results.length) log('Statements executed (no rows returned).', 'info');
        results.forEach(function (r) { log(Engines.sqlTable(r), 'html'); });
        status.textContent = 'Finished';
      }, function (e) { status.textContent = 'Error'; log(String(e.message || e), 'error'); });
    }
  }

  init();
})();
