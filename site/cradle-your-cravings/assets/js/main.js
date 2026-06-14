/* Cradle Your Cravings — site interactions
   Vanilla JS, no dependencies. Progressive enhancement. */
(function () {
  "use strict";

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("no-scroll", open);
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.classList.remove("open"); toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded","false");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq-item");
      var ans = item.querySelector(".faq-a");
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : null;
    });
  });

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(0)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Newsletter / contact form (demo) ---------- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-success");
      if (!note) { note = document.createElement("div"); note.className = "form-success"; form.appendChild(note); }
      note.textContent = form.getAttribute("data-success") || "Thank you — you're on the list. Watch your inbox.";
      form.querySelectorAll("input, textarea, button, select").forEach(function (el) {
        if (el.type !== "hidden") el.setAttribute("disabled","disabled");
      });
    });
  });

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .drawer a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "index.html" && href === "index.html")) a.classList.add("active");
  });


  /* =============================================================
     TRIGGER ASSESSMENT — interactive 8-question quiz
     Each answer carries weights toward four trigger profiles:
       sugar, processed, emotional, generational
     Loads automatically if #quiz-app exists on the page.
     ============================================================= */
  var quizRoot = document.getElementById("quiz-app");
  if (quizRoot) {

    var QUESTIONS = [
      { q: "When do you most often think about food?",
        opts: [
          { t: "Mostly at mealtimes",                       w: { sugar:0, processed:0, emotional:0, generational:0 } },
          { t: "Several times an hour, even when full",     w: { sugar:3, processed:2, emotional:2, generational:0 } },
          { t: "When I'm stressed, sad, or alone",          w: { sugar:1, processed:1, emotional:3, generational:1 } },
          { t: "Whenever I see or smell something sweet",   w: { sugar:3, processed:1, emotional:1, generational:0 } },
        ]},
      { q: "Which foods feel hardest to stop once you start?",
        opts: [
          { t: "Sweets, chocolate, baked goods",            w: { sugar:3, processed:1, emotional:1, generational:0 } },
          { t: "Chips, crackers, pretzels, salty snacks",   w: { sugar:0, processed:3, emotional:1, generational:0 } },
          { t: "Bread, pasta, pizza, cereals",              w: { sugar:1, processed:2, emotional:1, generational:1 } },
          { t: "I don't really have foods like that",       w: { sugar:0, processed:0, emotional:0, generational:0 } },
        ]},
      { q: "Have you ever eaten in secret or hidden food wrappers?",
        opts: [
          { t: "Never",                                     w: { sugar:0, processed:0, emotional:0, generational:0 } },
          { t: "Once or twice in my life",                  w: { sugar:1, processed:1, emotional:1, generational:0 } },
          { t: "Sometimes",                                 w: { sugar:2, processed:2, emotional:2, generational:1 } },
          { t: "Often — it's part of my pattern",           w: { sugar:3, processed:2, emotional:3, generational:2 } },
        ]},
      { q: "How do you usually feel after eating trigger foods?",
        opts: [
          { t: "Satisfied and fine",                        w: { sugar:0, processed:0, emotional:0, generational:0 } },
          { t: "Physically uncomfortable but emotionally okay", w: { sugar:1, processed:2, emotional:0, generational:0 } },
          { t: "Guilty, ashamed, or angry at myself",       w: { sugar:1, processed:1, emotional:3, generational:1 } },
          { t: "Numb and disconnected",                     w: { sugar:1, processed:1, emotional:3, generational:1 } },
        ]},
      { q: "Did one or both of your parents struggle with food, weight, or eating patterns?",
        opts: [
          { t: "No, neither did",                           w: { sugar:0, processed:0, emotional:0, generational:0 } },
          { t: "One of them did",                           w: { sugar:1, processed:1, emotional:1, generational:2 } },
          { t: "Both of them did",                          w: { sugar:1, processed:1, emotional:1, generational:3 } },
          { t: "It runs through several generations",       w: { sugar:1, processed:1, emotional:2, generational:3 } },
        ]},
      { q: "How often do you eat in response to feelings (rather than hunger)?",
        opts: [
          { t: "Rarely",                                    w: { sugar:0, processed:0, emotional:0, generational:0 } },
          { t: "Sometimes",                                 w: { sugar:1, processed:1, emotional:1, generational:0 } },
          { t: "Most days",                                 w: { sugar:1, processed:1, emotional:3, generational:1 } },
          { t: "Every day — it's how I cope",               w: { sugar:2, processed:2, emotional:3, generational:1 } },
        ]},
      { q: "Have you tried dieting or restricting, only to end up eating more later?",
        opts: [
          { t: "Never",                                     w: { sugar:0, processed:0, emotional:0, generational:0 } },
          { t: "Once or twice",                             w: { sugar:1, processed:1, emotional:1, generational:0 } },
          { t: "A handful of times",                        w: { sugar:2, processed:2, emotional:2, generational:1 } },
          { t: "It's been the story of my life",            w: { sugar:3, processed:2, emotional:3, generational:2 } },
        ]},
      { q: "Which best describes what you want from this work?",
        opts: [
          { t: "Just to understand my patterns better",     w: { sugar:0, processed:0, emotional:0, generational:0 } },
          { t: "To stop the cravings and feel free",        w: { sugar:2, processed:2, emotional:2, generational:1 } },
          { t: "To break a generational pattern for my family", w:{ sugar:1, processed:1, emotional:1, generational:3 } },
          { t: "To prepare my body for pregnancy / fertility",  w:{ sugar:1, processed:1, emotional:1, generational:2 } },
        ]},
    ];

    var state = { i: 0, answers: [] };

    function render() {
      if (state.i >= QUESTIONS.length) return renderResult();
      var q = QUESTIONS[state.i];
      var pct = Math.round((state.i / QUESTIONS.length) * 100);
      quizRoot.innerHTML =
        '<div class="quiz reveal in">' +
          '<div class="progress"><span style="width:'+pct+'%"></span></div>' +
          '<div class="step-label">Question '+(state.i+1)+' of '+QUESTIONS.length+'</div>' +
          '<h2 class="q-text">'+q.q+'</h2>' +
          '<div class="q-options" role="radiogroup">' +
            q.opts.map(function (o, idx) {
              return '<button class="q-opt" data-idx="'+idx+'" role="radio" aria-checked="false">' +
                       '<span class="dot" aria-hidden="true"></span>' +
                       '<span>'+o.t+'</span>' +
                     '</button>';
            }).join("") +
          '</div>' +
          '<div class="quiz-nav">' +
            (state.i > 0 ? '<button class="btn btn--ghost btn--sm q-back">‹ Back</button>' : '<span></span>') +
            '<button class="btn btn--primary btn--sm q-next" disabled>Continue ›</button>' +
          '</div>' +
        '</div>';

      var selectedIdx = null;
      quizRoot.querySelectorAll(".q-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          quizRoot.querySelectorAll(".q-opt").forEach(function (x) {
            x.classList.remove("selected");
            x.setAttribute("aria-checked", "false");
          });
          b.classList.add("selected"); b.setAttribute("aria-checked", "true");
          selectedIdx = parseInt(b.getAttribute("data-idx"), 10);
          quizRoot.querySelector(".q-next").removeAttribute("disabled");
        });
      });
      quizRoot.querySelector(".q-next").addEventListener("click", function () {
        if (selectedIdx === null) return;
        state.answers[state.i] = selectedIdx;
        state.i++;
        render();
        window.scrollTo({ top: quizRoot.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
      });
      var backBtn = quizRoot.querySelector(".q-back");
      if (backBtn) backBtn.addEventListener("click", function () { state.i--; render(); });
    }

    function renderResult() {
      var totals = { sugar:0, processed:0, emotional:0, generational:0 };
      var maxima = { sugar:0, processed:0, emotional:0, generational:0 };
      QUESTIONS.forEach(function (q, idx) {
        var ans = state.answers[idx];
        var w = q.opts[ans].w;
        for (var k in w) totals[k] += w[k];
        // compute per-question maximum for normalization
        var maxAt = { sugar:0, processed:0, emotional:0, generational:0 };
        q.opts.forEach(function (o) {
          for (var k in o.w) if (o.w[k] > maxAt[k]) maxAt[k] = o.w[k];
        });
        for (var k in maxAt) maxima[k] += maxAt[k];
      });
      // Normalize to 0–100
      var pct = {};
      for (var k in totals) pct[k] = Math.round((totals[k] / Math.max(maxima[k], 1)) * 100);

      // Determine primary profile
      var profile = Object.keys(pct).reduce(function (a, b) { return pct[a] >= pct[b] ? a : b; });
      var profileMap = {
        sugar: {
          title: "Sugar-driven cravings",
          desc: "Your relationship with sugar and sweet foods looks like one that's been hijacking your brain's reward system. Cravings for sweets feel hard to override on willpower alone — because biologically, they often are. The good news: this is the most-studied of all the food-addiction profiles, and structured abstinence works.",
          step: "Start with the SUGAR® Assessment with Cynthia.",
          link: "../site/programs/sugar-assessment.html"
        },
        processed: {
          title: "Ultra-processed pull",
          desc: "Chips, breads, crackers, and engineered combinations of fat-salt-flour are doing the work that sugar does for some people — bypassing your fullness signals and keeping you coming back. A Customized Food Plan focused on real, whole foods is the clearest path.",
          step: "Begin with a Customized Food Plan consultation.",
          link: "../site/programs/customized-food-plan.html"
        },
        emotional: {
          title: "Emotional eating loop",
          desc: "Food has become your way of coping with feelings — calm, distraction, comfort, numbing. This isn't a willpower problem; it's an emotional-regulation pattern, and it responds beautifully to coaching that builds new responses to old feelings.",
          step: "Food Addiction Coaching is the right starting point.",
          link: "../site/programs/food-addiction-coaching.html"
        },
        generational: {
          title: "Generational pattern carrier",
          desc: "Your answers point to patterns that don't begin or end with you — they've been passed forward through your family. The Genogram Discovery Program maps these patterns and shows you exactly where to interrupt them, for yourself and the generations after.",
          step: "Begin with the Genogram Discovery Program.",
          link: "../site/programs/genogram-discovery.html"
        }
      };
      var info = profileMap[profile];

      quizRoot.innerHTML =
        '<div class="quiz reveal in">' +
          '<div class="result-hero">' +
            '<div class="result-orb"><div class="result-orb-inner">'+pct[profile]+'%</div></div>' +
            '<span class="eyebrow">Your trigger profile</span>' +
            '<h2 style="margin-bottom:14px">'+info.title+'</h2>' +
            '<p style="max-width:54ch; margin:0 auto 28px">'+info.desc+'</p>' +
          '</div>' +
          '<h3 style="margin:32px 0 18px; font-size:1.2rem">Your profile across all four dimensions</h3>' +
          '<div class="scorebars">' +
            renderBar("Sugar-driven cravings", pct.sugar) +
            renderBar("Ultra-processed pull", pct.processed) +
            renderBar("Emotional eating loop", pct.emotional) +
            renderBar("Generational pattern carrier", pct.generational) +
          '</div>' +
          '<div style="background:var(--cream-2); border-radius:18px; padding:28px; margin-top:32px">' +
            '<span class="eyebrow" style="color:var(--moss)">Your next step</span>' +
            '<h3 style="margin:8px 0 14px; font-size:1.25rem">'+info.step+'</h3>' +
            '<p style="margin-bottom:18px">This recommendation is informational, not a diagnosis. The full work happens in collaboration with Cynthia.</p>' +
            '<div class="btn-row"><a class="btn btn--primary" href="signup.html">Join Cradle Your Cravings</a><a class="btn btn--ghost" href="'+info.link+'" target="_blank" rel="noopener">Explore the recommended program ›</a></div>' +
          '</div>' +
          '<div class="center" style="margin-top:24px"><button class="btn btn--ghost btn--sm" id="retake">↺ Retake the assessment</button></div>' +
        '</div>';

      // animate score bars
      requestAnimationFrame(function () {
        quizRoot.querySelectorAll(".scorebar .bar span").forEach(function (el) {
          el.style.width = el.getAttribute("data-w") + "%";
        });
      });
      document.getElementById("retake").addEventListener("click", function () {
        state = { i:0, answers: [] }; render();
      });
    }

    function renderBar(label, value) {
      return '<div class="scorebar"><div class="top"><span>'+label+'</span><span class="val">'+value+'%</span></div>' +
             '<div class="bar"><span data-w="'+value+'" style="width:0"></span></div></div>';
    }

    render();
  }


  /* =============================================================
     DASHBOARD MOCK — SVG line chart for craving intensity
     ============================================================= */
  var chartEl = document.getElementById("craving-chart");
  if (chartEl) {
    var data = [7, 6, 5, 6, 4, 3, 4, 3, 2, 3, 2, 2, 1, 2]; // 14 days craving intensity 0-10
    var w = 600, h = 140, pad = 16;
    var max = 10;
    var stepX = (w - pad*2) / (data.length - 1);
    var pts = data.map(function (v, i) {
      var x = pad + i * stepX;
      var y = pad + (1 - v/max) * (h - pad*2);
      return [x, y];
    });
    var path = "M " + pts[0][0] + " " + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var prev = pts[i-1], cur = pts[i];
      var cx = (prev[0] + cur[0]) / 2;
      path += " Q " + cx + " " + prev[1] + " " + cx + " " + (prev[1]+cur[1])/2;
      path += " T " + cur[0] + " " + cur[1];
    }
    var fill = path + " L " + pts[pts.length-1][0] + " " + (h-pad) + " L " + pts[0][0] + " " + (h-pad) + " Z";
    chartEl.innerHTML =
      '<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-label="14-day craving intensity chart">' +
        '<defs>' +
          '<linearGradient id="cgrad" x1="0" x2="0" y1="0" y2="1">' +
            '<stop offset="0%" stop-color="#D08B7B" stop-opacity=".35"/>' +
            '<stop offset="100%" stop-color="#D08B7B" stop-opacity="0"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="'+fill+'" fill="url(#cgrad)"/>' +
        '<path d="'+path+'" fill="none" stroke="#B36A5B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        pts.map(function (p, i) {
          var r = i === pts.length-1 ? 5 : 3;
          var c = i === pts.length-1 ? "#3D4F44" : "#D08B7B";
          return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'" fill="'+c+'"/>';
        }).join("") +
      '</svg>';
  }
})();
