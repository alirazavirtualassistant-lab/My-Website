/* Interview Prep hub */
(function () {
  'use strict';
  App.renderTopbar('interview');
  const C = window.CATALOG || { courses: [] };
  const B = window.BEHAVIORAL || { stories: [], questions: [], checklist: '' };
  let bank = [], selected = {};
  const pre = App.qs('c');

  // tabs
  App.els('.tabs button').forEach(function (b) { b.addEventListener('click', function () { App.els('.tabs button').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); App.els('.tab-panel').forEach(function (p) { p.classList.remove('active'); }); App.el('#tab-' + b.getAttribute('data-tab')).classList.add('active'); if (b.getAttribute('data-tab') === 'flash') showCard(); }); });

  // chips
  const chips = App.el('#course-chips');
  function renderChips() {
    const any = Object.keys(selected).some(function (k) { return selected[k]; });
    chips.innerHTML = '<span class="chip' + (!any ? ' on' : '') + '" data-c="">All courses</span><span class="chip' + (selected.__beh ? ' on' : '') + '" data-c="__beh">🗣️ Behavioural</span>' + C.courses.map(function (c) { return '<span class="chip' + (selected[c.id] ? ' on' : '') + '" data-c="' + App.esc(c.id) + '">' + App.esc(c.icon + ' ' + c.title) + '</span>'; }).join('');
  }
  chips.addEventListener('click', function (e) { const ch = e.target.closest('.chip'); if (!ch) return; const id = ch.getAttribute('data-c'); if (!id) selected = {}; else selected[id] = !selected[id]; renderChips(); refresh(); });
  if (pre) selected[pre] = true;
  renderChips();

  function pool() {
    const any = Object.keys(selected).some(function (k) { return selected[k]; });
    const beh = B.questions.map(function (q) { return { cid: '__beh', course: 'Behavioural', icon: '🗣️', level: 'All levels', chapter: 'Behavioural', q: q.q, a: q.a }; });
    let items = bank.concat(beh);
    if (any) items = items.filter(function (it) { return selected[it.cid]; });
    return items;
  }

  fetch('data/interview-bank.json').then(function (r) { return r.json(); }).then(function (d) { bank = d; refresh(); }).catch(function () { bank = []; refresh(); });

  /* ---------- bank ---------- */
  const bankBox = App.el('#bank'), bankQ = App.el('#bank-q');
  bankQ.addEventListener('input', refresh);
  function refresh() {
    const q = bankQ.value.trim().toLowerCase();
    let items = pool();
    if (q) items = items.filter(function (it) { return (it.q + ' ' + it.a + ' ' + it.course).toLowerCase().indexOf(q) !== -1; });
    App.el('#bank-count').textContent = items.length + ' questions';
    const groups = {};
    items.forEach(function (it) { (groups[it.course] = groups[it.course] || { icon: it.icon, items: [] }).items.push(it); });
    bankBox.innerHTML = Object.keys(groups).map(function (name) {
      const g = groups[name];
      return '<details open><summary>' + App.esc(g.icon + ' ' + name) + ' <span class="status">(' + g.items.length + ')</span></summary>' + g.items.slice(0, 400).map(function (it) {
        return '<details class="iq"><summary>' + LearnMD.inline(it.q) + ' <span class="badge ' + App.levelClass(it.level) + '">' + App.esc(it.level) + '</span></summary><div class="ans lesson-body">' + LearnMD.render(it.a) + (it.cid !== '__beh' ? '<p class="status"><a href="course.html?c=' + encodeURIComponent(it.cid) + '&ch=' + encodeURIComponent(it.chid) + '">Open lesson: ' + App.esc(it.chapter) + ' »</a></p>' : '') + '</div></details>';
      }).join('') + '</details>';
    }).join('') || '<p class="status">No questions match.</p>';
    deck = shuffle(pool()); di = 0; if (App.el('#tab-flash').classList.contains('active')) showCard();
  }

  /* ---------- flashcards ---------- */
  let deck = [], di = 0;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  const fc = App.el('#flashcard');
  function showCard() {
    if (!deck.length) { App.el('#fc-q').textContent = 'No questions in this selection.'; App.el('#fc-a').innerHTML = ''; App.el('#fc-count').textContent = ''; return; }
    const it = deck[di % deck.length];
    fc.classList.remove('flipped');
    App.el('#fc-lbl').textContent = it.icon + ' ' + it.course + ' · ' + it.level;
    App.el('#fc-q').innerHTML = LearnMD.inline(it.q);
    App.el('#fc-a').innerHTML = LearnMD.render(it.a);
    App.el('#fc-count').textContent = 'Card ' + ((di % deck.length) + 1) + ' of ' + deck.length;
  }
  fc.addEventListener('click', function () { fc.classList.toggle('flipped'); });
  App.el('#fc-flip').addEventListener('click', function () { fc.classList.toggle('flipped'); });
  App.el('#fc-next').addEventListener('click', function () { di++; showCard(); });
  App.el('#fc-prev').addEventListener('click', function () { di = (di - 1 + deck.length) % deck.length; showCard(); });
  App.el('#fc-shuffle').addEventListener('click', function () { deck = shuffle(pool()); di = 0; showCard(); });
  document.addEventListener('keydown', function (e) {
    if (!App.el('#tab-flash').classList.contains('active') || /input|textarea/i.test(document.activeElement.tagName)) return;
    if (e.key === ' ') { e.preventDefault(); fc.classList.toggle('flipped'); }
    if (e.key === 'ArrowRight') { di++; showCard(); }
    if (e.key === 'ArrowLeft') { di = (di - 1 + deck.length) % deck.length; showCard(); }
  });

  /* ---------- mock interview ---------- */
  let timer = null, remaining = 0;
  App.el('#mock-start').addEventListener('click', function () {
    const n = +App.el('#mock-n').value, mins = +App.el('#mock-min').value, beh = App.el('#mock-beh').checked;
    let items = pool();
    if (!beh) items = items.filter(function (it) { return it.cid !== '__beh'; });
    else if (!Object.keys(selected).some(function (k) { return selected[k]; })) {
      // default: mix ~30% behavioural
      const b = shuffle(items.filter(function (it) { return it.cid === '__beh'; })).slice(0, Math.max(1, Math.round(n * 0.3)));
      const t = shuffle(items.filter(function (it) { return it.cid !== '__beh'; })).slice(0, n - b.length);
      items = shuffle(b.concat(t));
    }
    const qs = shuffle(items).slice(0, n);
    const box = App.el('#mock');
    box.innerHTML = '<p class="status">Answer each question out loud or in the box as if a real interviewer asked it. Reveal the model answer only after you have answered. The timer counts ' + mins + ' minute(s) per question.</p>' + qs.map(function (it, i) {
      return '<div class="mock-q" data-i="' + i + '"><div class="status">Question ' + (i + 1) + ' of ' + qs.length + ' · ' + App.esc(it.icon + ' ' + it.course) + '</div><h3 style="margin:6px 0">' + LearnMD.inline(it.q) + '</h3><textarea placeholder="Type key points of your answer…"></textarea><div class="run-row"><button class="btn small secondary reveal" type="button">Reveal model answer</button><label><input type="checkbox" class="self-ok"> I answered this well</label></div><div class="model lesson-body">' + LearnMD.render(it.a) + '</div></div>';
    }).join('') + '<div class="run-row"><button class="btn" id="mock-finish" type="button">Finish &amp; score</button><span id="mock-score" class="quiz-score"></span></div>';
    box.addEventListener('click', function (e) { const r = e.target.closest('.reveal'); if (r) r.closest('.mock-q').classList.add('revealed'); });
    App.el('#mock-finish').addEventListener('click', function () {
      const ok = App.els('.self-ok', box).filter(function (c) { return c.checked; }).length;
      App.el('#mock-score').textContent = 'Self-rated ' + ok + ' / ' + qs.length + ' — ' + (ok === qs.length ? 'ready!' : ok >= qs.length * 0.7 ? 'nearly there; revisit the ones you missed.' : 'keep drilling: open the linked lessons and rebuild your answers.');
      clearInterval(timer); App.el('#mock-timer').textContent = '';
      const hist = App.load('sf.mock', []); hist.push({ at: Date.now(), ok: ok, n: qs.length }); App.save('sf.mock', hist.slice(-50));
    });
    // timer
    clearInterval(timer); remaining = mins * 60 * qs.length;
    const tEl = App.el('#mock-timer');
    const tick = function () { const m = Math.floor(remaining / 60), s = remaining % 60; tEl.textContent = '⏱ ' + m + ':' + (s < 10 ? '0' : '') + s; if (remaining <= 0) { clearInterval(timer); tEl.textContent = '⏱ Time!'; } remaining--; };
    tick(); timer = setInterval(tick, 1000);
    box.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- STAR stories ---------- */
  App.el('#star').innerHTML = '<p class="sub">Twelve ready-to-use stories mined from your resume. Rehearse each in under two minutes; adapt the emphasis to the question (leadership, conflict, failure, data, technical).</p>' + B.stories.map(function (s) {
    return '<details class="iq"><summary>' + App.esc(s.title) + ' <span class="status">' + s.tags.map(function (t) { return '#' + App.esc(t); }).join(' ') + '</span></summary><div class="ans"><p><b>Situation.</b> ' + App.esc(s.s) + '</p><p><b>Task.</b> ' + App.esc(s.t) + '</p><p><b>Action.</b> ' + App.esc(s.a) + '</p><p><b>Result.</b> ' + App.esc(s.r) + '</p></div></details>';
  }).join('') + '<div class="notice">Make every story yours: add exact numbers, names of tools, and what you would do differently. Interviewers probe the Action step hardest — be ready for "what exactly did <em>you</em> do?"</div>';

  /* ---------- checklist ---------- */
  App.el('#plan').innerHTML = LearnMD.render(B.checklist);
  if (pre) { const b = App.els('.tabs button')[0]; b.click(); }
})();
