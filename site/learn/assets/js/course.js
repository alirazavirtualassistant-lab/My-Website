/* Course viewer */
(function () {
  'use strict';
  App.renderTopbar('home');
  const cid = App.qs('c');
  const content = App.el('#content'), sidebar = App.el('#sidebar');
  if (!cid) { content.innerHTML = '<div class="notice">No course selected. <a href="index.html">Back to courses</a>.</div>'; return; }

  App.loadCourse(cid).then(function (course) {
    document.title = course.meta.title + ' · SkillForge';
    let chId = App.qs('ch');
    let chapter = course.chapters.filter(function (c) { return c.id === chId; })[0] || course.chapters[0];
    renderSidebar(course, chapter);
    renderChapter(course, chapter);
    window.addEventListener('popstate', function () {
      const id = App.qs('ch');
      const ch = course.chapters.filter(function (c) { return c.id === id; })[0] || course.chapters[0];
      renderSidebar(course, ch); renderChapter(course, ch);
    });
  }).catch(function (err) {
    content.innerHTML = '<div class="notice"><b>Could not load this course.</b> ' + App.esc(err.message) + '<br>If you opened this page directly from your disk (file://), serve the folder over HTTP instead, e.g. <code>python3 -m http.server 8080</code> inside <code>site/learn</code>.</div>';
  });

  function renderSidebar(course, current) {
    const done = App.progress.countDone(course.id), total = course.chapters.length;
    let html = '<div class="course-head"><div class="t"><span>' + App.esc(course.meta.icon) + '</span> ' + App.esc(course.meta.title) + '</div><div class="p">' + done + ' / ' + total + ' chapters complete</div><div class="progress-bar"><span style="width:' + (total ? Math.round(done / total * 100) : 0) + '%"></span></div></div>';
    course.levels.forEach(function (lv) {
      html += '<div class="level"><span class="badge ' + App.levelClass(lv.name) + '">' + App.esc(lv.name) + '</span></div>';
      lv.chapters.forEach(function (ch) {
        const cls = ['ch']; if (ch.id === current.id) cls.push('active'); if (App.progress.isDone(course.id, ch.id)) cls.push('done');
        html += '<a class="' + cls.join(' ') + '" href="course.html?c=' + encodeURIComponent(course.id) + '&ch=' + encodeURIComponent(ch.id) + '" data-ch="' + App.esc(ch.id) + '"><span class="dot"></span><span>' + App.esc(ch.title) + '</span></a>';
      });
    });
    html += '<div class="level" style="margin-top:14px"><a href="index.html" style="text-transform:none;letter-spacing:0">← All courses</a></div>';
    sidebar.innerHTML = html;
    sidebar.addEventListener('click', onNavClick);
    const act = sidebar.querySelector('a.ch.active'); if (act && act.scrollIntoView) act.scrollIntoView({ block: 'center' });
  }

  function onNavClick(e) {
    const a = e.target.closest('a[data-ch]'); if (!a) return;
    e.preventDefault();
    history.pushState({}, '', a.getAttribute('href'));
    document.body.classList.remove('sidebar-open');
    App.loadCourse(cid).then(function (course) {
      const ch = course.chapters.filter(function (c) { return c.id === a.getAttribute('data-ch'); })[0];
      renderSidebar(course, ch); renderChapter(course, ch); window.scrollTo(0, 0);
    });
  }

  function renderChapter(course, ch) {
    const idx = course.chapters.indexOf(ch);
    const prev = course.chapters[idx - 1], next = course.chapters[idx + 1];
    const m = course.meta;
    const mins = Math.max(3, Math.round(ch.words / 180));
    let html = '<div class="lesson-head"><div class="crumbs"><a href="index.html">Courses</a> › <a href="course.html?c=' + encodeURIComponent(course.id) + '">' + App.esc(m.title) + '</a> › ' + App.esc(ch.level) + '</div>' +
      '<h1>' + App.esc(ch.title) + '</h1><div class="meta"><span class="badge ' + App.levelClass(ch.level) + '">' + App.esc(ch.level) + '</span><span>Chapter ' + (idx + 1) + ' of ' + course.chapters.length + '</span><span>·</span><span>~' + mins + ' min read</span>' + (ch.quiz.length ? '<span>·</span><span>' + ch.quiz.length + ' quiz questions</span>' : '') + '</div></div>';
    html += pager(course, prev, next);
    html += '<article class="lesson-body">' + LearnMD.render(ch.body) + '</article>';

    if (ch.tryit) {
      html += '<section class="section-card tryit"><h3>🧪 Try It Yourself</h3>' + LearnMD.render('```' + ch.tryit.lang + '\n' + ch.tryit.code + '\n```') +
        '<p><a class="btn" href="' + App.tryItUrl(course.id, ch.id) + '">Try it Yourself »</a></p>' +
        '<p class="note">' + runnerNote(m) + '</p></section>';
    }
    if (ch.quiz.length) html += renderQuiz(course, ch);
    if (ch.exercises) html += '<section class="section-card"><h3>🏋️ Exercises</h3><div class="lesson-body">' + LearnMD.render(ch.exercises) + '</div></section>';
    if (ch.interview.length) {
      html += '<section class="section-card"><h3>🎯 Interview Questions</h3>' + ch.interview.map(function (iq) {
        return '<details class="iq"><summary>' + LearnMD.inline(iq.q) + '</summary><div class="ans lesson-body">' + LearnMD.render(iq.a) + '</div></details>';
      }).join('') + '<p style="margin:12px 0 0"><a href="interview.html?c=' + encodeURIComponent(course.id) + '">Practise all ' + App.esc(m.title) + ' interview questions in mock mode »</a></p></section>';
    }
    const done = App.progress.isDone(course.id, ch.id);
    html += '<div class="complete-row"><label><input type="checkbox" id="mark-done"' + (done ? ' checked' : '') + '> Mark this chapter as complete</label><span class="status" id="done-status">' + (done ? '✅ Completed' : '') + '</span></div>';
    html += pager(course, prev, next);
    content.innerHTML = html;
    content.querySelector('#mark-done').addEventListener('change', function (e) {
      App.progress.setDone(course.id, ch.id, e.target.checked);
      content.querySelector('#done-status').textContent = e.target.checked ? '✅ Completed' : '';
      renderSidebar(course, ch);
    });
    bindQuiz(course, ch);
    content.addEventListener('click', function (e) { const a = e.target.closest('a[data-ch]'); if (a) onNavClick(e); });
  }

  function runnerNote(m) {
    switch (m.runner) {
      case 'python': return 'Runs Python in your browser (Pyodide loads on first use, ~10 MB).' + (m.packages ? ' Installs: ' + App.esc(m.packages) + '.' : '');
      case 'js': return 'Runs JavaScript in your browser and shows console output.' + (m.libs ? ' Loads library: ' + App.esc(m.libs) + '.' : '');
      case 'html': return 'Renders a live preview of the HTML/CSS in your browser.';
      case 'sql': return 'Runs SQLite in your browser (sql.js loads on first use).';
      default: return 'This tool cannot run inside a browser. Copy the code and run it on your machine; the editor still lets you edit and save your notes.';
    }
  }

  function pager(course, prev, next) {
    return '<div class="pager">' + (prev ? '<a class="btn secondary" href="course.html?c=' + encodeURIComponent(course.id) + '&ch=' + encodeURIComponent(prev.id) + '" data-ch="' + App.esc(prev.id) + '">« ' + App.esc(prev.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn" href="course.html?c=' + encodeURIComponent(course.id) + '&ch=' + encodeURIComponent(next.id) + '" data-ch="' + App.esc(next.id) + '">' + App.esc(next.title) + ' »</a>' : '<a class="btn" href="index.html">🎉 Course finished — back to courses</a>') + '</div>';
  }

  function renderQuiz(course, ch) {
    const p = App.progress.course(course.id)[ch.id];
    let html = '<section class="section-card" id="quiz"><h3>📝 Quiz</h3>' + (p && p.total ? '<p class="status">Last score: ' + p.quiz + ' / ' + p.total + '</p>' : '');
    ch.quiz.forEach(function (q, qi) {
      html += '<div class="quiz-q" data-q="' + qi + '"><div class="qt">' + (qi + 1) + '. ' + LearnMD.inline(q.q) + '</div>' +
        q.options.map(function (o, oi) { return '<label><input type="radio" name="q' + qi + '" value="' + oi + '"> <span>' + LearnMD.inline(o) + '</span></label>'; }).join('') +
        '<div class="explain">' + LearnMD.inline(q.explain) + '</div></div>';
    });
    html += '<div class="run-row"><button class="btn" id="quiz-check" type="button">Check answers</button><button class="btn secondary" id="quiz-reset" type="button">Reset</button><span class="quiz-score" id="quiz-score"></span></div></section>';
    return html;
  }

  function bindQuiz(course, ch) {
    const box = content.querySelector('#quiz'); if (!box) return;
    box.querySelector('#quiz-check').addEventListener('click', function () {
      let score = 0;
      ch.quiz.forEach(function (q, qi) {
        const wrap = box.querySelector('.quiz-q[data-q="' + qi + '"]');
        const sel = wrap.querySelector('input:checked');
        App.els('label', wrap).forEach(function (l) { l.classList.remove('correct', 'wrong'); });
        wrap.classList.add('answered');
        const labels = App.els('label', wrap);
        labels[q.answer].classList.add('correct');
        if (sel) { if (+sel.value === q.answer) score++; else labels[+sel.value].classList.add('wrong'); }
      });
      const s = box.querySelector('#quiz-score');
      s.textContent = 'Score: ' + score + ' / ' + ch.quiz.length + (score === ch.quiz.length ? ' — perfect!' : score >= ch.quiz.length * 0.6 ? ' — good, review the misses.' : ' — re-read the chapter and try again.');
      s.className = 'quiz-score ' + (score >= ch.quiz.length * 0.6 ? 'pass' : 'fail');
      App.progress.setQuiz(course.id, ch.id, score, ch.quiz.length);
      if (score === ch.quiz.length && !App.progress.isDone(course.id, ch.id)) { App.progress.setDone(course.id, ch.id, true); const cb = content.querySelector('#mark-done'); if (cb) { cb.checked = true; content.querySelector('#done-status').textContent = '✅ Completed'; } renderSidebar(course, ch); }
    });
    box.querySelector('#quiz-reset').addEventListener('click', function () {
      App.els('input', box).forEach(function (i) { i.checked = false; });
      App.els('label', box).forEach(function (l) { l.classList.remove('correct', 'wrong'); });
      App.els('.quiz-q', box).forEach(function (w) { w.classList.remove('answered'); });
      box.querySelector('#quiz-score').textContent = '';
    });
  }
})();
