/* alirazaworks.com — behaviour. No dependencies. */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isPlaceholder(url) { return !url || /REPLACE|YOUR_|example\.com/i.test(url); }
  function digits(v) { return String(v || "").replace(/[^\d]/g, ""); }

  /* ---------- Config-driven links ---------- */
  function applyLinks() {
    /* Upwork: if the URL is missing, fall back to the contact section rather than a dead link */
    var upwork = isPlaceholder(cfg.upworkUrl) ? "#contact" : cfg.upworkUrl;
    $all('[data-link="upwork"]').forEach(function (a) {
      a.setAttribute("href", upwork);
      if (upwork === "#contact") { a.removeAttribute("target"); a.removeAttribute("rel"); }
      else { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    });

    /* LinkedIn: hide when not configured */
    $all('[data-link="linkedin"]').forEach(function (a) {
      if (isPlaceholder(cfg.linkedinUrl)) a.setAttribute("hidden", "");
      else { a.removeAttribute("hidden"); a.setAttribute("href", cfg.linkedinUrl); }
    });

    /* Email */
    if (cfg.email) {
      $all('[data-link="email"]').forEach(function (a) {
        var subject = /subject=/.test(a.getAttribute("href") || "") ? "?subject=Project%20Inquiry" : "";
        a.setAttribute("href", "mailto:" + cfg.email + subject);
      });
      $all('[data-text="email"]').forEach(function (el) { el.textContent = cfg.email; });
    }

    /* WhatsApp + phone */
    var wa = digits(cfg.whatsapp);
    var greeting = "Hi%20Ali%2C%20I%20want%20to%20discuss%20a%20project.";
    $all('[data-link="whatsapp"]').forEach(function (a) {
      if (wa) { a.removeAttribute("hidden"); a.setAttribute("href", "https://wa.me/" + wa + "?text=" + greeting); }
      else a.setAttribute("hidden", "");
    });
    $all('[data-link="tel"]').forEach(function (a) {
      var tel = digits(cfg.phone || cfg.whatsapp);
      if (tel) { a.removeAttribute("hidden"); a.setAttribute("href", "tel:+" + tel); }
      else a.setAttribute("hidden", "");
    });
    $all('[data-text="phone"]').forEach(function (el) {
      if (cfg.phone) el.textContent = cfg.phone;
      else if (wa) el.textContent = "+" + wa;
    });
    $all('[data-requires="whatsapp"]').forEach(function (el) {
      if (wa) el.removeAttribute("hidden"); else el.setAttribute("hidden", "");
    });

    /* Optional booking link (Calendly etc.) */
    $all('[data-link="booking"]').forEach(function (a) {
      if (isPlaceholder(cfg.bookingUrl)) a.setAttribute("hidden", "");
      else { a.removeAttribute("hidden"); a.setAttribute("href", cfg.bookingUrl); }
    });
  }

  /* ---------- Live Lahore clock ---------- */
  function clock() {
    var el = document.getElementById("pkTime");
    if (!el || !window.Intl) return;
    var fmt;
    try { fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", hour12: false }); }
    catch (e) { return; }
    function tick() { el.textContent = fmt.format(new Date()); }
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Navigation ---------- */
  function nav() {
    var header = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    if (!header) return;

    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setMenu(open) {
      if (!toggle || !menu) return;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    if (toggle && menu) {
      toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
      $all("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
      var mq = window.matchMedia("(min-width: 901px)");
      if (mq.addEventListener) mq.addEventListener("change", function (e) { if (e.matches) setMenu(false); });
    }

    /* active link highlighting */
    var links = $all(".nav-links a[href^='#']");
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id); });
        });
      }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
      sections.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ---------- Counters ---------- */
  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = reduceMotion ? 0 : 1500;
    var start = null;
    function format(v) {
      return prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    }
    if (!duration || isNaN(target)) { el.textContent = format(target || 0); return; }
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Reveal on scroll ---------- */
  function reveal() {
    var items = $all(".reveal");
    var counters = $all("[data-count]");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add("in"); });
      counters.forEach(runCounter);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        $all("[data-count]", entry.target).forEach(runCounter);
        if (entry.target.hasAttribute("data-count")) runCounter(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { if (!el.closest(".reveal")) io.observe(el); });
  }

  /* ---------- Card spotlight + cursor glow ---------- */
  function pointerEffects() {
    if (!finePointer || reduceMotion) return;

    $all(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });

    var glow = document.querySelector(".cursor-glow");
    if (!glow) return;
    var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, raf = null;
    function tick() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = "translate(" + (x - 260) + "px," + (y - 260) + "px)";
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(tick);
      else raf = null;
    }
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("on");
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    document.addEventListener("pointerleave", function () { glow.classList.remove("on"); });
  }

  /* ---------- Marquee: duplicate track for a seamless loop ---------- */
  function marquee() {
    var track = document.getElementById("marquee");
    if (!track || track.dataset.dup) return;
    track.dataset.dup = "1";
    track.innerHTML += track.innerHTML;
  }

  /* ---------- Contact form: Netlify Forms (AJAX) + WhatsApp hand-off ---------- */
  function form() {
    var f = document.getElementById("contactForm");
    var msg = document.getElementById("formMsg");
    if (!f || !msg) return;

    function show(text, isError) {
      msg.textContent = text;
      msg.classList.toggle("error", !!isError);
      msg.classList.add("show");
    }
    function value(name) { var el = f.elements[name]; return el && el.value ? el.value.trim() : ""; }

    f.addEventListener("submit", function (e) {
      if (!window.fetch || !window.FormData || !window.URLSearchParams) return; /* plain POST to Netlify */
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }

      var btn = f.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Sending…";

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(f)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        f.reset();
        show("Thanks, your brief is in. I'll reply within one business day.");
      }).catch(function () {
        show("Couldn't send just now. Use the WhatsApp button or email " + (cfg.email || "alirazavirtualassistant@gmail.com") + ".", true);
      }).then(function () {
        btn.disabled = false;
        btn.innerHTML = original;
      });
    });

    var waBtn = document.getElementById("waSend");
    var wa = digits(cfg.whatsapp);
    if (waBtn && wa) {
      waBtn.addEventListener("click", function () {
        if (!f.checkValidity()) { f.reportValidity(); return; }
        var text = "Hi Ali,\n\nI'm " + value("name") + " (" + value("email") + ").\n\n" +
          "Interested in: " + (value("service") || "a project") + "\n" +
          "Budget: " + (value("budget") || "TBD") + "\n\n" + value("message");
        window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      });
    }
  }

  /* ---------- Footer year ---------- */
  function year() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function init() {
    applyLinks();
    clock();
    nav();
    marquee();
    reveal();
    pointerEffects();
    form();
    year();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
