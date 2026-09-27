/* Cradle Your Cravings — site interactions
   - Navigation, reveal animations, counters
   - Forms: every form posts to FormSubmit, which emails Cynthia
   - Member state, course progress + XP (stored in this browser)
   - Trigger assessment quiz, resource library filters */
(function () {
  "use strict";

  // All form submissions are delivered to this inbox via FormSubmit (https://formsubmit.co).
  var NOTIFY_EMAIL = "cynthiajmm@gmail.com";
  var ENDPOINT = "https://formsubmit.co/ajax/" + NOTIFY_EMAIL;

  var doc = document.documentElement;
  var body = document.body;
  var ROOT = body.getAttribute("data-root") || "";
  doc.classList.add("js");

  /* ---------- storage helpers ---------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var member = load("cyc_member", null);
  var progress = load("cyc_progress", {});

  function applyMember() {
    member = load("cyc_member", null);
    body.classList.toggle("is-member", !!member);
    if (!member) return;
    var first = member.first || (member.email || "").split("@")[0] || "Friend";
    $$("[data-member-name]").forEach(function (el) { el.textContent = first; });
    $$("[data-member-initial]").forEach(function (el) { el.textContent = first.charAt(0).toUpperCase(); });
    $$("[data-member-email]").forEach(function (el) { el.textContent = member.email || ""; });
  }
  applyMember();

  /* ---------- toast + confetti ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2800);
  }
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var colors = ["#D08B7B", "#D9A85D", "#7FA08A", "#9C8FBF", "#F6E2D8"];
    for (var i = 0; i < 70; i++) {
      var c = document.createElement("i");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      c.style.animationDelay = Math.random() * 0.4 + "s";
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      body.appendChild(c);
      setTimeout(function (el) { el.remove(); }, 4000, c);
    }
  }

  /* ---------- header + drawer ---------- */
  var header = $(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = $(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = !doc.classList.contains("nav-open");
      doc.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$(".drawer a").forEach(function (a) {
      a.addEventListener("click", function () { doc.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && doc.classList.contains("nav-open")) { doc.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
    });
  }
  // Desktop dropdowns: keyboard + touch support
  $$(".has-menu > button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.parentElement;
      var expanded = btn.getAttribute("aria-expanded") === "true";
      $$(".has-menu > button").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      btn.setAttribute("aria-expanded", String(!expanded));
      if (!expanded) { var first = $(".menu a", li); if (first && btn.matches(":focus-visible")) first.focus(); }
    });
  });

  $$("[data-signout]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      try { localStorage.removeItem("cyc_member"); } catch (err) {}
      applyMember();
      toast("You've been signed out on this device.");
      setTimeout(function () { location.href = ROOT + "index.html"; }, 900);
    });
  });

  /* ---------- reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else { counters.forEach(countUp); }

  /* ---------- year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* =========================================================
     FORMS → email Cynthia via FormSubmit
     ========================================================= */
  function fieldValue(form, name) {
    var els = form.querySelectorAll('[name="' + name + '"]');
    if (!els.length) return "";
    if (els[0].type === "checkbox" && els.length > 1) {
      return Array.prototype.filter.call(els, function (e) { return e.checked; }).map(function (e) { return e.value; }).join(", ");
    }
    if (els[0].type === "radio") { var c = Array.prototype.filter.call(els, function (e) { return e.checked; })[0]; return c ? c.value : ""; }
    if (els[0].type === "checkbox") return els[0].checked ? "Yes" : "No";
    return els[0].value.trim();
  }

  function validate(scope) {
    var ok = true, firstBad = null;
    $$("[required]", scope).forEach(function (el) {
      var valid;
      if (el.type === "radio") valid = !!scope.querySelector('[name="' + el.name + '"]:checked');
      else if (el.type === "checkbox") valid = el.checked;
      else if (el.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
      else valid = el.value.trim().length > 0;
      var holder = el.closest(".field") || el.closest(".consent") || el.parentElement;
      var err = holder && holder.querySelector(".err");
      el.classList.toggle("invalid", !valid);
      if (err) err.classList.toggle("show", !valid);
      if (!valid) { ok = false; if (!firstBad) firstBad = el; }
    });
    if (firstBad) firstBad.focus({ preventScroll: false });
    return ok;
  }
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.classList && el.classList.contains("invalid")) {
      el.classList.remove("invalid");
      var holder = el.closest(".field") || el.closest(".consent");
      var err = holder && holder.querySelector(".err");
      if (err) err.classList.remove("show");
    }
  });

  function collect(form) {
    var data = {}, seen = {};
    $$("[name]", form).forEach(function (el) {
      var n = el.name;
      if (seen[n] || n.charAt(0) === "_") return;
      seen[n] = true;
      var v = fieldValue(form, n);
      if (v) data[n] = v;
    });
    return data;
  }

  function send(payload) {
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      clearTimeout(timer);
      return res.json().catch(function () { return {}; }).then(function (json) {
        var msg = String(json.message || "");
        // FormSubmit asks the inbox owner to activate the form on first use; treat that as received.
        if (res.ok && (String(json.success) === "true" || /activat/i.test(msg))) return json;
        throw new Error(msg || "Request failed (" + res.status + ")");
      });
    }, function (err) { clearTimeout(timer); throw err; });
  }

  function mailtoFallback(subject, data) {
    var lines = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
    return "mailto:" + NOTIFY_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines);
  }

  $$("form[data-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var kind = form.getAttribute("data-form");
      var status = $(".form-status", form);
      if (status) { status.className = "form-status"; status.textContent = ""; }
      if (!validate(form)) return;

      // Sign-in is handled on this device only
      if (kind === "login") return handleLogin(form);

      var hp = form.querySelector('[name="_honey"]');
      var data = collect(form);
      var name = [data["First name"], data["Last name"]].filter(Boolean).join(" ") || data["Name"] || data["Email"] || "Someone";
      var subject = (form.getAttribute("data-subject") || "New message from Cradle Your Cravings").replace("{name}", name);
      if (kind === "signup") {
        var quiz = load("cyc_quiz", null);
        if (quiz && quiz.summary) data["Trigger Assessment result"] = quiz.summary;
      }
      data["Submitted from"] = location.href.split("?")[0];
      data["Submitted at"] = new Date().toLocaleString();

      var payload = {};
      Object.keys(data).forEach(function (k) { payload[k] = data[k]; });
      payload._subject = subject;
      payload._template = "table";
      payload._captcha = "false";
      if (data.Email) payload._replyto = data.Email;
      var auto = form.getAttribute("data-autoresponse");
      if (auto && data.Email) payload._autoresponse = auto;

      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.classList.add("loading"); }

      var done = function () {
        if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
        if (kind === "signup") {
          save("cyc_member", {
            first: data["First name"] || "", last: data["Last name"] || "", email: data.Email || "",
            joinedAs: data["Joining as"] || "", joined: Date.now()
          });
          applyMember();
          var next = new URLSearchParams(location.search).get("next");
          var safe = next && /^[\w\-\/.#]+$/.test(next) && next.indexOf("//") === -1 ? next : null;
          location.href = safe ? safe : (form.getAttribute("data-redirect") || ROOT + "welcome.html");
          return;
        }
        form.reset();
        if (form.nextElementSibling && form.nextElementSibling.classList.contains("form-success")) {
          form.classList.add("done");
          form.nextElementSibling.setAttribute("tabindex", "-1");
          form.nextElementSibling.focus();
        } else if (status) {
          status.className = "form-status ok show";
          status.textContent = form.getAttribute("data-ok") || "Thank you — you're on the list!";
        }
      };

      if (hp && hp.value) { setTimeout(done, 600); return; } // bot trap

      send(payload).then(done).catch(function () {
        if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
        if (status) {
          status.className = "form-status error show";
          status.innerHTML = "We couldn't send that just now. Please check your connection and try again, or <a href=\"" +
            esc(mailtoFallback(subject, data)) + "\">email Cynthia directly</a>.";
        }
      });
    });
  });

  function handleLogin(form) {
    var email = fieldValue(form, "Email").toLowerCase();
    var existing = load("cyc_member", null);
    if (!existing || (existing.email || "").toLowerCase() !== email) {
      existing = { first: email.split("@")[0].replace(/[._\d]+/g, " ").trim().split(" ")[0] || "Friend", last: "", email: email, joined: existing ? existing.joined : Date.now() };
      existing.first = existing.first.charAt(0).toUpperCase() + existing.first.slice(1);
      save("cyc_member", existing);
    }
    applyMember();
    var next = new URLSearchParams(location.search).get("next");
    var safe = next && /^[\w\-\/.#]+$/.test(next) && next.indexOf("//") === -1 ? next : null;
    location.href = safe || ROOT + "course/index.html";
  }

  /* ---------- multi-step signup ---------- */
  var stepForm = $("form[data-steps]");
  if (stepForm) {
    var steps = $$(".fstep", stepForm), bars = $$(".steps-bar i", stepForm), cur = 0;
    var show = function (i) {
      cur = i;
      steps.forEach(function (s, j) { s.classList.toggle("active", j === i); });
      bars.forEach(function (b, j) { b.classList.toggle("on", j <= i); });
      var h = $("h3, legend", steps[i]); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    };
    $$("[data-next]", stepForm).forEach(function (b) { b.addEventListener("click", function () { if (validate(steps[cur])) show(cur + 1); }); });
    $$("[data-prev]", stepForm).forEach(function (b) { b.addEventListener("click", function () { show(cur - 1); }); });
    // Pre-select "joining as" from ?as=
    var as = new URLSearchParams(location.search).get("as");
    if (as) { var r = stepForm.querySelector('input[name="Joining as"][data-key="' + as + '"]'); if (r) r.checked = true; }
    show(0);
  }
  // Pre-select a role on the team form from ?role=
  var roleSel = $("select[data-role-select]");
  if (roleSel) {
    var role = new URLSearchParams(location.search).get("role");
    if (role) $$("option", roleSel).forEach(function (o) { if (o.getAttribute("data-key") === role) o.selected = true; });
    $$("[data-pick-role]").forEach(function (a) {
      a.addEventListener("click", function () {
        var k = a.getAttribute("data-pick-role");
        $$("option", roleSel).forEach(function (o) { o.selected = o.getAttribute("data-key") === k; });
      });
    });
  }

  /* =========================================================
     Members-only downloads: guests are sent to sign up first
     ========================================================= */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-gated]");
    if (!a || member) return;
    e.preventDefault();
    var here = location.pathname.split("/").pop() || "index.html";
    var prefix = body.getAttribute("data-dir") ? body.getAttribute("data-dir") + "/" : "";
    location.href = ROOT + "signup.html?next=" + encodeURIComponent(prefix + here);
  });

  /* =========================================================
     Course progress + XP
     ========================================================= */
  var COURSE = window.CYC_COURSE;
  function isDone(id) { return !!progress[id]; }
  function lessonStats(lesson) {
    var done = lesson.actions.filter(function (a) { return isDone(a.id); });
    var xp = done.reduce(function (s, a) { return s + a.xp; }, 0);
    return { done: done.length, total: lesson.actions.length, xp: xp, complete: lesson.actions.length > 0 && done.length === lesson.actions.length };
  }
  function moduleStats(mod) {
    var c = 0, xp = 0;
    mod.lessons.forEach(function (l) { var s = lessonStats(l); if (s.complete) c++; xp += s.xp; });
    return { complete: c, total: mod.lessons.length, xp: xp, pct: mod.lessons.length ? Math.round((c / mod.lessons.length) * 100) : 0 };
  }
  function courseStats() {
    var c = 0, t = 0, xp = 0, next = null;
    COURSE.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        var s = lessonStats(l); t++; xp += s.xp;
        if (s.complete) c++; else if (!next && m.core) next = { mod: m, lesson: l };
      });
    });
    return { complete: c, total: t, xp: xp, pct: t ? Math.round((c / t) * 100) : 0, next: next };
  }

  function paintProgress() {
    if (!COURSE) return;
    // Lesson rows
    COURSE.modules.forEach(function (m) {
      m.lessons.forEach(function (l) {
        var s = lessonStats(l);
        $$('[data-lesson-row="' + l.id + '"]').forEach(function (el) { el.classList.toggle("done", s.complete); });
      });
      var ms = moduleStats(m);
      $$('[data-module-progress="' + m.id + '"]').forEach(function (el) {
        if (el.classList.contains("progress-ring")) {
          el.style.setProperty("--p", ms.pct);
          var b = el.querySelector("b"); if (b) b.textContent = ms.pct + "%";
        } else { var i = el.querySelector("i"); if (i) i.style.width = ms.pct + "%"; }
      });
      $$('[data-module-count="' + m.id + '"]').forEach(function (el) { el.textContent = ms.complete + " / " + ms.total + " lessons complete"; });
    });
    var cs = courseStats();
    $$("[data-course-pct]").forEach(function (el) { el.textContent = cs.pct + "%"; });
    $$("[data-course-bar]").forEach(function (el) { el.style.width = cs.pct + "%"; });
    $$("[data-course-xp]").forEach(function (el) { el.textContent = cs.xp.toLocaleString(); });
    $$("[data-course-xp-bar]").forEach(function (el) { el.style.width = Math.min(100, Math.round((cs.xp / COURSE.totalXP) * 100)) + "%"; });
    $$("[data-course-lessons]").forEach(function (el) { el.textContent = cs.complete + " / " + cs.total; });
    $$("[data-course-lessons-bar]").forEach(function (el) { el.style.width = cs.pct + "%"; });
    $$("[data-course-level]").forEach(function (el) {
      var lv = COURSE.levels.filter(function (x) { return cs.xp >= x.xp; }).pop();
      el.textContent = lv ? lv.name : COURSE.levels[0].name;
    });
    if (member) {
      var days = Math.floor((Date.now() - (member.joined || Date.now())) / 86400000) + 1;
      $$("[data-course-day]").forEach(function (el) { el.textContent = "Day " + days; });
      $$("[data-course-day-bar]").forEach(function (el) { el.style.width = Math.min(100, Math.round((days / 49) * 100)) + "%"; });
    }
    var cont = $("[data-continue]");
    if (cont && cs.next) {
      cont.setAttribute("href", ROOT + cs.next.lesson.url);
      var t = $("[data-continue-title]", cont); if (t) t.textContent = cs.next.lesson.title;
      var mm = $("[data-continue-module]", cont); if (mm) mm.textContent = "Continue · Module " + cs.next.mod.num;
    } else if (cont) {
      var t2 = $("[data-continue-title]", cont); if (t2) t2.textContent = "You've completed the core course — celebrate!";
    }
  }

  // Action checkboxes on lesson pages
  $$("[data-action]").forEach(function (label) {
    var id = label.getAttribute("data-action");
    var input = $("input", label);
    var xp = parseInt(label.getAttribute("data-xp"), 10) || 0;
    var sync = function () { label.classList.toggle("checked", !!progress[id]); input.checked = !!progress[id]; };
    sync();
    input.addEventListener("change", function () {
      if (!member) {
        input.checked = false;
        toast("Join free to save your progress and earn XP.");
        setTimeout(function () { location.href = ROOT + "signup.html?next=" + encodeURIComponent((body.getAttribute("data-dir") ? body.getAttribute("data-dir") + "/" : "") + location.pathname.split("/").pop()); }, 1300);
        return;
      }
      if (input.checked) { progress[id] = Date.now(); toast("+" + xp + " XP — beautifully done."); }
      else { delete progress[id]; }
      save("cyc_progress", progress);
      sync();
      afterChange();
    });
  });
  var completeBtn = $("[data-complete-lesson]");
  function afterChange() {
    paintProgress();
    var lid = body.getAttribute("data-lesson");
    if (!lid || !COURSE) return;
    var lesson = null;
    COURSE.modules.forEach(function (m) { m.lessons.forEach(function (l) { if (l.id === lid) lesson = l; }); });
    if (!lesson) return;
    var s = lessonStats(lesson);
    $$("[data-lesson-xp]").forEach(function (el) { el.textContent = s.xp + " / " + lesson.xp + " XP"; });
    if (completeBtn) {
      completeBtn.innerHTML = s.complete ? "Lesson complete ✓" : "Mark lesson complete";
      completeBtn.classList.toggle("btn--ghost", s.complete);
    }
    if (s.complete && !body._celebrated) { body._celebrated = true; confetti(); }
    if (!s.complete) body._celebrated = false;
  }
  if (completeBtn) {
    completeBtn.addEventListener("click", function () {
      if (!member) { location.href = ROOT + "signup.html?next=" + encodeURIComponent((body.getAttribute("data-dir") || "course") + "/" + location.pathname.split("/").pop()); return; }
      var boxes = $$("[data-action]");
      var allDone = boxes.every(function (b) { return progress[b.getAttribute("data-action")]; });
      boxes.forEach(function (b) {
        var id = b.getAttribute("data-action");
        if (allDone) delete progress[id]; else if (!progress[id]) progress[id] = Date.now();
        b.classList.toggle("checked", !allDone); $("input", b).checked = !allDone;
      });
      save("cyc_progress", progress);
      if (!allDone) toast("Lesson complete — XP earned!");
      afterChange();
    });
  }
  body._celebrated = true; // don't celebrate on first paint
  afterChange();
  body._celebrated = (function () {
    var lid = body.getAttribute("data-lesson"); if (!lid || !COURSE) return false;
    var done = false; COURSE.modules.forEach(function (m) { m.lessons.forEach(function (l) { if (l.id === lid) done = lessonStats(l).complete; }); });
    return done;
  })();

  $$("[data-reset-progress]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!confirm("Reset all course progress on this device?")) return;
      progress = {}; save("cyc_progress", progress);
      $$("[data-action]").forEach(function (l) { l.classList.remove("checked"); $("input", l).checked = false; });
      afterChange(); toast("Progress reset.");
    });
  });

  /* =========================================================
     Trigger assessment quiz
     ========================================================= */
  var quiz = $("[data-quiz]");
  if (quiz) {
    var qs = $$(".q", quiz);
    var answers = new Array(qs.length);
    var DIMS = {
      nutrition: { label: "Cravings & nutrition", color: "var(--m2)", url: "course/module-2.html", module: "Module 2 · Nutrition for Optimal Fertility" },
      movement: { label: "Movement & energy", color: "var(--m3)", url: "course/module-3.html", module: "Module 3 · Exercise and Movement" },
      stress: { label: "Stress & emotions", color: "var(--m4)", url: "course/module-4.html", module: "Module 4 · Stress Management and Emotional Wellness" },
      toxins: { label: "Home & environment", color: "var(--m5)", url: "course/module-5.html", module: "Module 5 · Toxin Elimination and Detox" },
      connection: { label: "Partner & family", color: "var(--m6)", url: "course/module-6.html", module: "Module 6 · Family Connection and Communication" }
    };
    var qi = 0;
    var bar = $(".quiz-bar i", quiz), count = $("[data-q-count]", quiz), back = $("[data-q-back]", quiz);
    var showQ = function (i) {
      qi = i;
      qs.forEach(function (q, j) { q.classList.toggle("active", j === i); });
      if (bar) bar.style.width = Math.round((i / qs.length) * 100) + "%";
      if (count) count.textContent = "Question " + (i + 1) + " of " + qs.length;
      if (back) back.style.visibility = i === 0 ? "hidden" : "visible";
    };
    qs.forEach(function (q, i) {
      $$(".q-opt", q).forEach(function (opt) {
        opt.addEventListener("click", function () {
          $$(".q-opt", q).forEach(function (o) { o.classList.remove("sel"); o.setAttribute("aria-pressed", "false"); });
          opt.classList.add("sel"); opt.setAttribute("aria-pressed", "true");
          answers[i] = JSON.parse(opt.getAttribute("data-w"));
          setTimeout(function () { if (i + 1 < qs.length) showQ(i + 1); else finish(); }, 280);
        });
      });
    });
    if (back) back.addEventListener("click", function () { if (qi > 0) showQ(qi - 1); });
    var finish = function () {
      var totals = {}, max = {};
      Object.keys(DIMS).forEach(function (k) { totals[k] = 0; max[k] = 0; });
      qs.forEach(function (q, i) {
        var opts = $$(".q-opt", q).map(function (o) { return JSON.parse(o.getAttribute("data-w")); });
        Object.keys(DIMS).forEach(function (k) {
          max[k] += Math.max.apply(null, opts.map(function (o) { return o[k] || 0; }));
          totals[k] += (answers[i] && answers[i][k]) || 0;
        });
      });
      var scores = Object.keys(DIMS).map(function (k) { return { k: k, pct: max[k] ? Math.round((totals[k] / max[k]) * 100) : 0 }; })
        .sort(function (a, b) { return b.pct - a.pct; });
      var top = scores[0], d = DIMS[top.k];
      var res = $("[data-quiz-result]");
      $("[data-r-title]", res).textContent = d.label;
      $("[data-r-module]", res).textContent = d.module;
      $("[data-r-link]", res).setAttribute("href", ROOT + d.url);
      $("[data-r-bars]", res).innerHTML = scores.map(function (s) {
        return '<div class="rbar"><span>' + esc(DIMS[s.k].label) + '</span><div class="track"><i style="background:' + DIMS[s.k].color + '" data-w="' + s.pct + '"></i></div><b>' + s.pct + "%</b></div>";
      }).join("");
      save("cyc_quiz", { top: top.k, scores: scores, summary: "Focus area: " + d.label + " — " + scores.map(function (s) { return DIMS[s.k].label + " " + s.pct + "%"; }).join(", ") });
      quiz.hidden = true; res.hidden = false;
      res.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () { $$(".rbar i", res).forEach(function (i) { i.style.width = i.getAttribute("data-w") + "%"; }); }, 200);
    };
    var retake = $("[data-retake]");
    if (retake) retake.addEventListener("click", function () {
      answers = new Array(qs.length);
      $$(".q-opt", quiz).forEach(function (o) { o.classList.remove("sel"); });
      $("[data-quiz-result]").hidden = true; quiz.hidden = false; showQ(0);
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    showQ(0);
  }

  /* ---------- resource library filters ---------- */
  var filters = $(".lib-filters");
  if (filters) {
    filters.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("button", filters).forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); });
      var f = b.getAttribute("data-filter");
      $$(".lib .dl").forEach(function (d) { d.hidden = f !== "all" && d.getAttribute("data-cat") !== f; });
    });
  }
})();
