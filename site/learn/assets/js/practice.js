/* Practice Lab: challenges with auto-tests (python/js/sql) or self-check (manual) */
(function () {
  'use strict';
  App.renderTopbar('practice');
  const list = App.el('#chal-list'), work = App.el('#work');
  const ALL = window.CHALLENGES || [];
  const solved = function () { return App.load('sf.solved', {}); };
  const cats = []; ALL.forEach(function (c) { if (cats.indexOf(c.cat) === -1) cats.push(c.cat); });
  const fCat = App.el('#f-cat'), fDiff = App.el('#f-diff'), fQ = App.el('#f-q');
  cats.forEach(function (c) { const o = document.createElement('option'); o.textContent = c; fCat.appendChild(o); });
  const preCat = App.qs('cat'); if (preCat) fCat.value = preCat;
  let current = null;

  function renderList() {
    const s = solved(); const q = fQ.value.toLowerCase();
    const items = ALL.filter(function (c) { return (!fCat.value || c.cat === fCat.value) && (!fDiff.value || c.diff === fDiff.value) && (!q || (c.title + ' ' + c.cat + ' ' + c.prompt).toLowerCase().indexOf(q) !== -1); });
    list.innerHTML = '<div class="status" style="margin:4px 0 8px">' + items.length + ' challenges · ' + Object.keys(s).length + ' solved</div>' + items.map(function (c) {
      return '<a href="#' + App.esc(c.id) + '" class="chal' + (s[c.id] ? ' solved' : '') + (current && current.id === c.id ? ' active' : '') + '" data-id="' + App.esc(c.id) + '"><div class="t">' + App.esc(c.title) + '</div><div class="m">' + App.esc(c.cat) + ' · <span class="diff ' + c.diff + '">' + c.diff + '</span></div></a>';
    }).join('') || '<div class="status">Nothing matches.</div>';
  }
  [fCat, fDiff].forEach(function (x) { x.addEventListener('change', renderList); }); fQ.addEventListener('input', renderList);
  list.addEventListener('click', function (e) { const a = e.target.closest('a[data-id]'); if (!a) return; e.preventDefault(); open(a.getAttribute('data-id')); history.replaceState({}, '', '#' + a.getAttribute('data-id')); });

  function open(id) {
    current = ALL.filter(function (c) { return c.id === id; })[0]; if (!current) return;
    const c = current;
    const key = 'sf.chal.' + c.id;
    const saved = App.load(key, null);
    let html = '<div class="crumbs status">' + App.esc(c.cat) + ' · <span class="diff ' + c.diff + '">' + c.diff + '</span>' + (solved()[c.id] ? ' · ✅ solved' : '') + '</div><h1>' + App.esc(c.title) + '</h1>';
    html += '<div class="prompt lesson-body">' + LearnMD.render(c.prompt) + '</div>';
    if (c.runner === 'manual') {
      html += '<div class="lesson-body">' + (c.starter ? LearnMD.render('```' + (c.lang || 'text') + '\n' + c.starter + '\n```') : '') + '</div>';
      html += '<textarea class="mini-editor" id="chal-code" placeholder="Write your answer, formula or notes here…" style="min-height:140px">' + App.esc(saved != null ? saved : '') + '</textarea>';
      html += '<div class="run-row"><button class="btn secondary" id="show-sol" type="button">Reveal solution</button><button class="btn" id="mark-solved" type="button">Mark as solved</button></div>';
      html += '<div id="solution" style="display:none" class="lesson-body">' + LearnMD.render(c.solution) + '</div>';
    } else {
      html += '<textarea class="mini-editor" id="chal-code" spellcheck="false">' + App.esc(saved != null ? saved : c.starter) + '</textarea>';
      html += '<div class="run-row"><button class="btn" id="run-tests" type="button">▶ Run tests (Ctrl+Enter)</button><button class="btn secondary" id="reset-code" type="button">Reset</button>' + (c.hints && c.hints.length ? '<button class="btn ghost" id="show-hint" type="button">Hint</button>' : '') + '<button class="btn ghost" id="show-sol" type="button">Reveal solution</button><span class="status" id="chal-status"></span></div>';
      html += '<div id="hints"></div><div class="mini-out" id="chal-out">Run the tests to see results.</div><div class="tests" id="tests"></div>';
      html += '<div id="solution" style="display:none" class="lesson-body"><h4>Solution</h4>' + LearnMD.render('```' + (c.runner === 'python' ? 'python' : c.runner === 'js' ? 'js' : 'sql') + '\n' + c.solution + '\n```') + (c.explain ? LearnMD.render(c.explain) : '') + '</div>';
    }
    work.innerHTML = html;
    const ed = App.el('#chal-code');
    let t = null; ed.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { App.save(key, ed.value); }, 400); });
    ed.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); const b = App.el('#run-tests'); if (b) b.click(); } if (e.key === 'Tab') { e.preventDefault(); const s = ed.selectionStart, en = ed.selectionEnd; ed.value = ed.value.slice(0, s) + '    ' + ed.value.slice(en); ed.selectionStart = ed.selectionEnd = s + 4; } });
    App.el('#show-sol').addEventListener('click', function () { const s = App.el('#solution'); s.style.display = s.style.display === 'none' ? 'block' : 'none'; });
    const ms = App.el('#mark-solved'); if (ms) ms.addEventListener('click', function () { markSolved(c.id); });
    const rc = App.el('#reset-code'); if (rc) rc.addEventListener('click', function () { ed.value = c.starter; try { localStorage.removeItem(key); } catch (e) {} });
    const sh = App.el('#show-hint'); if (sh) { let hi = 0; sh.addEventListener('click', function () { if (hi < c.hints.length) { App.el('#hints').innerHTML += '<div class="notice">💡 ' + LearnMD.inline(c.hints[hi++]) + '</div>'; } if (hi >= c.hints.length) sh.disabled = true; }); }
    const rt = App.el('#run-tests'); if (rt) rt.addEventListener('click', function () { runTests(c, ed.value); });
    renderList(); work.scrollTop = 0; window.scrollTo(0, 0);
  }

  function markSolved(id) { const s = solved(); s[id] = Date.now(); App.save('sf.solved', s); renderList(); const st = App.el('#chal-status'); if (st) st.textContent = '✅ Solved!'; else open(id); }

  function showTests(results) {
    const box = App.el('#tests');
    box.innerHTML = results.map(function (r) { return '<div class="test ' + (r.pass ? 'pass' : 'fail') + '">' + (r.pass ? '✔ ' : '✘ ') + App.esc(r.name) + (r.pass ? '' : ' — ' + App.esc(r.detail || '')) + '</div>'; }).join('');
    const passed = results.filter(function (r) { return r.pass; }).length;
    const st = App.el('#chal-status'); st.textContent = passed + ' / ' + results.length + ' tests passed';
    if (results.length && passed === results.length) markSolved(current.id);
  }

  function runTests(c, src) {
    const out = App.el('#chal-out'); out.textContent = ''; App.el('#tests').innerHTML = ''; App.el('#chal-status').textContent = 'Running…';
    const log = function (t, k) { const d = document.createElement('div'); if (k === 'error') d.className = 'err'; else if (k === 'info') d.className = 'info'; d.textContent = t; out.appendChild(d); };
    if (c.runner === 'python') {
      const harness = '\n\n# ---- tests ----\nimport json as __json\n__results = []\n' + c.tests.map(function (t) {
        return 'try:\n    __got = ' + t.call + '\n    __exp = ' + t.expect + '\n    __results.append({"name": ' + JSON.stringify(t.name || t.call) + ', "pass": __got == __exp, "detail": "got " + repr(__got) + ", expected " + repr(__exp)})\nexcept Exception as __e:\n    __results.append({"name": ' + JSON.stringify(t.name || t.call) + ', "pass": False, "detail": type(__e).__name__ + ": " + str(__e)})\n';
      }).join('') + 'print("__SF_RESULTS__" + __json.dumps(__results))\n';
      let results = null;
      Engines.python(src + harness, { packages: c.packages || '', onOut: function (t, k) { const m = t.match(/__SF_RESULTS__(.*)/); if (m) { try { results = JSON.parse(m[1]); } catch (e) {} const rest = t.replace(/__SF_RESULTS__.*/, '').trim(); if (rest) log(rest, k); } else log(t, k); } }).then(function () {
        if (results) showTests(results); else App.el('#chal-status').textContent = 'Your code raised an error before the tests could run.';
      }, function (e) { log(String(e.message || e), 'error'); App.el('#chal-status').textContent = 'Error'; });
    } else if (c.runner === 'js') {
      const harness = '\n\n// ---- tests ----\nconst __eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);\nconst __results=[];\n' + c.tests.map(function (t) {
        return 'try{const __got=await (' + t.call + ');const __exp=' + t.expect + ';__results.push({name:' + JSON.stringify(t.name || t.call) + ',pass:__eq(__got,__exp),detail:"got "+JSON.stringify(__got)+", expected "+JSON.stringify(__exp)});}catch(e){__results.push({name:' + JSON.stringify(t.name || t.call) + ',pass:false,detail:String(e)});}\n';
      }).join('') + 'console.log("__SF_RESULTS__"+JSON.stringify(__results));\n';
      let results = null;
      Engines.js(src + harness, { libs: c.libs || '', onOut: function (t, k) { const m = t.match(/__SF_RESULTS__(.*)/); if (m) { try { results = JSON.parse(m[1]); } catch (e) {} } else log(t, k); } }).then(function () {
        if (results) showTests(results); else App.el('#chal-status').textContent = 'Your code raised an error before the tests could run.';
      });
    } else if (c.runner === 'sql') {
      Engines.sql(src, { setup: c.setup, onOut: log }).then(function (res) {
        out.innerHTML = '';
        if (!res.length) { log('Your query returned no result set.', 'error'); showTests([{ name: 'Query returns rows', pass: false, detail: 'no result set' }]); return; }
        const last = res[res.length - 1];
        const d = document.createElement('div'); d.innerHTML = Engines.sqlTable(last); out.appendChild(d);
        const norm = function (rows) { return rows.map(function (r) { return r.map(function (v) { return v === null ? 'NULL' : typeof v === 'number' ? String(Math.round(v * 100) / 100) : String(v); }).join('\u0001'); }); };
        let got = norm(last.values), exp = norm(c.expect);
        if (c.unordered) { got = got.slice().sort(); exp = exp.slice().sort(); }
        const results = [];
        results.push({ name: 'Column count is ' + c.expect[0].length, pass: last.columns.length === c.expect[0].length, detail: 'got ' + last.columns.length + ' columns: ' + last.columns.join(', ') });
        results.push({ name: 'Row count is ' + c.expect.length, pass: last.values.length === c.expect.length, detail: 'got ' + last.values.length });
        results.push({ name: 'Rows match expected values' + (c.unordered ? ' (any order)' : ' (in order)'), pass: JSON.stringify(got) === JSON.stringify(exp), detail: 'expected: ' + c.expect.map(function (r) { return '[' + r.join(', ') + ']'; }).join(' ') });
        showTests(results);
      }, function (e) { log(String(e.message || e), 'error'); App.el('#chal-status').textContent = 'SQL error'; });
    }
  }

  renderList();
  const h = location.hash.replace('#', ''); if (h && ALL.some(function (c) { return c.id === h; })) open(h); else if (ALL.length) open(ALL[0].id);
})();
