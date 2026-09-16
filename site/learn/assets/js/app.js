/* SkillForge shared runtime: theme, topbar, search, progress, course loading */
(function () {
  'use strict';
  const App = window.App = {};

  /* ---------- theme ---------- */
  function getTheme() { try { return localStorage.getItem('sf.theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) { return 'light'; } }
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('sf.theme', t); } catch (e) {} }
  applyTheme(getTheme());
  App.toggleTheme = function () { applyTheme(getTheme() === 'dark' ? 'light' : 'dark'); };

  /* ---------- storage ---------- */
  function load(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  App.load = load; App.save = save;

  const Progress = App.progress = {
    all: function () { return load('sf.progress', {}); },
    course: function (id) { return this.all()[id] || {}; },
    isDone: function (cid, ch) { return !!(this.course(cid)[ch] && this.course(cid)[ch].done); },
    setDone: function (cid, ch, done) { const all = this.all(); all[cid] = all[cid] || {}; all[cid][ch] = Object.assign({}, all[cid][ch], { done: done, at: Date.now() }); save('sf.progress', all); },
    setQuiz: function (cid, ch, score, total) { const all = this.all(); all[cid] = all[cid] || {}; all[cid][ch] = Object.assign({}, all[cid][ch], { quiz: score, total: total }); save('sf.progress', all); },
    countDone: function (cid) { const c = this.course(cid); return Object.keys(c).filter(function (k) { return c[k].done; }).length; },
    totalDone: function () { const all = this.all(); let n = 0; Object.keys(all).forEach(function (k) { n += Object.keys(all[k]).filter(function (c) { return all[k][c].done; }).length; }); return n; },
    reset: function () { save('sf.progress', {}); }
  };

  /* ---------- helpers ---------- */
  App.esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  App.qs = function (k) { return new URLSearchParams(location.search).get(k); };
  App.el = function (sel, root) { return (root || document).querySelector(sel); };
  App.els = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  App.levelClass = function (name) { return 'lv-' + String(name || '').toLowerCase(); };
  App.courseById = function (id) { return (window.CATALOG && window.CATALOG.courses || []).filter(function (c) { return c.id === id; })[0]; };

  /* ---------- copy buttons ---------- */
  document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const pre = b.closest('.codeblock').querySelector('pre');
    const text = pre.innerText;
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { b.textContent = 'Copied!'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); }, function () {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); b.textContent = 'Copied!'; } catch (x) {} document.body.removeChild(ta); setTimeout(function () { b.textContent = 'Copy'; }, 1500);
    });
  });

  /* ---------- topbar ---------- */
  App.renderTopbar = function (active) {
    const bar = document.querySelector('.topbar');
    if (!bar) return;
    const links = [['index.html', 'Courses', 'home'], ['practice.html', 'Practice', 'practice'], ['interview.html', 'Interview Prep', 'interview'], ['roadmap.html', 'Roadmap', 'roadmap']];
    bar.innerHTML = '<button class="icon-btn menu-btn" type="button" aria-label="Toggle chapter menu">☰</button>' +
      '<a class="logo" href="index.html"><span>⚡</span> SkillForge</a>' +
      '<nav>' + links.map(function (l) { return '<a href="' + l[0] + '"' + (l[2] === active ? ' class="active"' : '') + '>' + l[1] + '</a>'; }).join('') + '</nav>' +
      '<span class="spacer"></span>' +
      '<div class="search"><input type="search" id="site-search" placeholder="Search all lessons…" autocomplete="off" aria-label="Search lessons"><div class="search-results" id="search-results" role="listbox"></div></div>' +
      '<button class="icon-btn" type="button" id="search-toggle" aria-label="Search" style="display:none">🔍</button>' +
      '<button class="icon-btn" type="button" id="theme-toggle" aria-label="Toggle dark mode">🌓</button>';
    bar.querySelector('#theme-toggle').addEventListener('click', App.toggleTheme);
    const menu = bar.querySelector('.menu-btn');
    menu.addEventListener('click', function () { document.body.classList.toggle('sidebar-open'); });
    const ov = document.querySelector('.overlay'); if (ov) ov.addEventListener('click', function () { document.body.classList.remove('sidebar-open'); });
    if (!document.querySelector('.sidebar')) menu.style.display = 'none';
    // mobile search toggle
    const st = bar.querySelector('#search-toggle');
    if (matchMedia('(max-width: 600px)').matches) st.style.display = 'inline-flex';
    st.addEventListener('click', function () { bar.classList.toggle('show-search'); const i = bar.querySelector('#site-search'); if (bar.classList.contains('show-search')) i.focus(); });
    setupSearch(bar);
  };

  /* ---------- search ---------- */
  let index = null, indexPromise = null;
  function loadIndex() {
    if (!indexPromise) indexPromise = fetch('data/search-index.json').then(function (r) { return r.json(); }).then(function (d) { index = d; return d; }).catch(function () { index = []; return index; });
    return indexPromise;
  }
  function setupSearch(bar) {
    const input = bar.querySelector('#site-search'), box = bar.querySelector('#search-results');
    let t = null;
    input.addEventListener('focus', loadIndex);
    input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { runSearch(input.value.trim(), box); }, 120); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); } if (e.key === 'Enter') { const a = box.querySelector('a'); if (a) location.href = a.getAttribute('href'); } });
    document.addEventListener('click', function (e) { if (!bar.querySelector('.search').contains(e.target)) box.classList.remove('open'); });
  }
  function runSearch(q, box) {
    if (!q) { box.classList.remove('open'); return; }
    loadIndex().then(function (idx) {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      const scored = [];
      idx.forEach(function (it) {
        const title = it.title.toLowerCase(), course = it.course.toLowerCase(), text = it.text.toLowerCase();
        let score = 0;
        terms.forEach(function (term) {
          if (title.indexOf(term) !== -1) score += 10;
          if (course.indexOf(term) !== -1) score += 6;
          const n = text.split(term).length - 1; if (n) score += Math.min(n, 5);
        });
        if (score) scored.push({ it: it, score: score });
      });
      scored.sort(function (a, b) { return b.score - a.score; });
      const top = scored.slice(0, 14);
      if (!top.length) { box.innerHTML = '<div class="empty">No lessons match "' + App.esc(q) + '".</div>'; box.classList.add('open'); return; }
      const re = new RegExp('(' + terms.map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'ig');
      box.innerHTML = top.map(function (s) {
        const it = s.it; let pos = it.text.toLowerCase().indexOf(terms[0]); if (pos < 0) pos = 0;
        const snip = it.text.slice(Math.max(0, pos - 60), pos + 120);
        return '<a href="course.html?c=' + encodeURIComponent(it.cid) + '&ch=' + encodeURIComponent(it.id) + '"><div class="crumb">' + App.esc(it.icon + ' ' + it.course + ' › ' + it.level) + '</div><div><b>' + App.esc(it.title).replace(re, '<mark>$1</mark>') + '</b></div><div class="snip">…' + App.esc(snip).replace(re, '<mark>$1</mark>') + '…</div></a>';
      }).join('');
      box.classList.add('open');
    });
  }

  /* ---------- course loading ---------- */
  const courseCache = {};
  App.loadCourse = function (id) {
    if (courseCache[id]) return courseCache[id];
    courseCache[id] = fetch('courses/' + encodeURIComponent(id) + '.md', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).then(function (text) {
      const c = LearnMD.parseCourse(text);
      c.id = id;
      const cat = App.courseById(id); if (cat) Object.keys(cat).forEach(function (k) { if (!c.meta[k]) c.meta[k] = cat[k]; });
      return c;
    });
    return courseCache[id];
  };

  /* ---------- lib aliases for runners ---------- */
  App.LIBS = {
    'docx': ['https://cdn.jsdelivr.net/npm/docx@9.5.1/build/index.umd.js', 'https://cdn.jsdelivr.net/npm/docx@9/build/index.umd.js', 'https://cdn.jsdelivr.net/npm/docx@9/dist/index.umd.js', 'https://unpkg.com/docx@9/build/index.umd.js'],
    'pptxgenjs': ['https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js', 'https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.bundle.js', 'https://unpkg.com/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'],
    'pdf-lib': ['https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js', 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js'],
    'xlsx': ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js']
  };
  App.PYODIDE = ['https://cdn.jsdelivr.net/pyodide/v0.26.4/full/', 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'];
  App.SQLJS = ['https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/', 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/'];

  App.loadScript = function (candidates) {
    candidates = [].concat(candidates);
    return new Promise(function (resolve, reject) {
      let i = 0;
      (function next() {
        if (i >= candidates.length) return reject(new Error('Could not load library from any CDN: ' + candidates[0]));
        const url = candidates[i++];
        const s = document.createElement('script'); s.src = url; s.async = true;
        s.onload = function () { resolve(url); }; s.onerror = function () { s.remove(); next(); };
        document.head.appendChild(s);
      })();
    });
  };

  App.tryItUrl = function (course, chapter) {
    return 'tryit.html?c=' + encodeURIComponent(course) + '&ch=' + encodeURIComponent(chapter);
  };

  /* ---------- key shortcuts ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { const i = document.getElementById('site-search'); if (i) { e.preventDefault(); i.focus(); } }
  });
})();
