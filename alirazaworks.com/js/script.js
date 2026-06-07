/* =====================================================================
   ALI RAZA — PREMIUM PORTFOLIO · INTERACTIONS
   ===================================================================== */
(() => {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

  /* ---------- THEME TOGGLE ---------- */
  const root = document.documentElement;
  const saved = localStorage.getItem('ar-theme');
  if (saved) root.setAttribute('data-theme', saved);
  $('#theme-toggle')?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (next === 'dark') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme','light');
    localStorage.setItem('ar-theme', next);
  });

  /* ---------- NAV: SCROLLED STATE + MOBILE TOGGLE ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 24);
    $('#scroll-top')?.classList.toggle('visible', window.scrollY > 800);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#nav-toggle')?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    $('#nav-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));

  $('#scroll-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

  /* ---------- HERO HEADLINE WORD REVEAL ---------- */
  const splitWords = el => {
    if (!el) return;
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    let i = 0;
    nodes.forEach(node => {
      if (node.nodeType === 1) {
        // keep inline elements (e.g. <span class="accent">) intact and animate as one unit
        node.classList.add('word');
        node.style.animationDelay = (i++ * 0.08) + 's';
        el.appendChild(node);
        return;
      }
      (node.textContent || '').split(/(\s+)/).forEach(part => {
        if (part === '') return;
        if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement('span');
        w.className = 'word';
        w.textContent = part;
        w.style.animationDelay = (i++ * 0.08) + 's';
        el.appendChild(w);
      });
    });
  };
  $$('.hero h1, .reveal-words').forEach(splitWords);

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .reveal-up, .stagger').forEach(el => io.observe(el));
  } else {
    $$('.reveal, .reveal-up, .stagger').forEach(el => el.classList.add('in'));
  }

  /* ---------- COUNTER ANIMATION ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const dur = 1600;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const v = target * ease(p);
      el.textContent = v.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !prefersReduced) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(el => cio.observe(el));
  } else {
    $$('[data-count]').forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ---------- CUSTOM CURSOR GLOW ---------- */
  if (!prefersReduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.opacity = '0';
    document.body.appendChild(glow);
    let mx = 0, my = 0, cx = 0, cy = 0;
    let visible = false;
    addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) { glow.style.opacity = '1'; visible = true; }
    });
    addEventListener('mouseleave', () => { glow.style.opacity = '0'; visible = false; });
    const loop = () => {
      cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- SPOTLIGHT CARD HOVER ---------- */
  $$('.svc-card, .capability-card, .work-card, .pay-card, .test-card, .product-card, .pay-method').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- HERO PORTRAIT 3D TILT ---------- */
  const portrait = $('.hero-portrait');
  if (portrait && !prefersReduced && matchMedia('(hover: hover)').matches) {
    let raf;
    portrait.addEventListener('mousemove', (e) => {
      const r = portrait.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        portrait.style.transform = `perspective(1200px) rotateX(${-y*6}deg) rotateY(${x*8}deg) translateZ(0)`;
      });
    });
    portrait.addEventListener('mouseleave', () => { portrait.style.transform = ''; });
  }

  /* ---------- WORK FILTER ---------- */
  const workGrid = $('.work-grid');
  $$('.work-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('.work-filter').forEach(b => b.classList.toggle('active', b === btn));
      const cards = $$('.work-card');
      if (workGrid && !prefersReduced) workGrid.classList.add('transitioning');
      cards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = f === 'all' || tags.includes(f);
        if (!prefersReduced) card.classList.add('is-leaving');
        setTimeout(() => {
          card.style.display = show ? '' : 'none';
          if (show && !prefersReduced) {
            card.classList.remove('is-leaving');
            card.classList.add('is-entering');
            setTimeout(() => card.classList.remove('is-entering'), 480);
          } else {
            card.classList.remove('is-leaving');
          }
        }, prefersReduced ? 0 : 140);
      });
      if (workGrid && !prefersReduced) setTimeout(() => workGrid.classList.remove('transitioning'), 520);
    });
  });

  /* ---------- STORE FILTER (template shop) ---------- */
  const storeGrid = $('.store-grid');
  $$('.store-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('.store-filter').forEach(b => b.classList.toggle('active', b === btn));
      const cards = $$('.product-card');
      if (storeGrid && !prefersReduced) storeGrid.classList.add('transitioning');
      cards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = f === 'all' || tags.includes(f);
        if (!prefersReduced) card.classList.add('is-leaving');
        setTimeout(() => {
          card.style.display = show ? '' : 'none';
          if (show && !prefersReduced) {
            card.classList.remove('is-leaving');
            card.classList.add('is-entering');
            setTimeout(() => card.classList.remove('is-entering'), 480);
          } else {
            card.classList.remove('is-leaving');
          }
        }, prefersReduced ? 0 : 140);
      });
      if (storeGrid && !prefersReduced) setTimeout(() => storeGrid.classList.remove('transitioning'), 520);
    });
  });

  /* ---------- PAYMENT: show selected item from store (?item=) ---------- */
  const paySelected = $('#pay-selected');
  if (paySelected) {
    const item = new URLSearchParams(location.search).get('item');
    if (item) {
      const safe = item.replace(/[<>]/g, '').slice(0, 120);
      const nameEl = paySelected.querySelector('.tag');
      if (nameEl) nameEl.textContent = safe;
      paySelected.classList.add('show');
      // Pre-fill the WhatsApp order links with the chosen product
      $$('a[data-wa-order]').forEach(a => {
        a.href = `https://wa.me/923454371509?text=${encodeURIComponent('Hi Ali, I want to buy: ' + safe)}`;
      });
    }
  }

  /* ---------- HERO MEDIA FALLBACK ---------- */
  const heroVideo = $('.hero-media video');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      const wrap = heroVideo.closest('.hero-media');
      if (wrap) wrap.style.display = 'none';
    });
  }

  /* ---------- PAGE TRANSITION ---------- */
  if (!prefersReduced) {
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => document.body.classList.add('page-enter-active'));
    $$('a[href$=".html"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('http') || a.target === '_blank') return;
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = href; }, 240);
      });
    });
  }

  /* ---------- COPY-TO-CLIPBOARD (payment details) ---------- */
  $$('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = 'Copied ✓';
        btn.style.color = 'var(--emerald-500)';
        setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1600);
      } catch (e) {
        btn.textContent = 'Copy failed';
      }
    });
  });

  /* ---------- HIRE MODAL ---------- */
  const modal = $('#hire-modal');
  const openModal = () => { modal?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal?.classList.remove('open'); document.body.style.overflow = ''; };
  $$('[data-open-hire]').forEach(el => el.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  $$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- CONTACT FORM → WhatsApp ---------- */
  $('#hire-form, #contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const project = data.get('project') || data.get('service') || 'a project';
    const budget = data.get('budget') || 'TBD';
    const message = data.get('message') || '';
    const text = `Hi Ali,%0A%0AI'm ${encodeURIComponent(name)} (${encodeURIComponent(email)}).%0A%0AInterested in: ${encodeURIComponent(project)}%0ABudget: ${encodeURIComponent(budget)}%0A%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/923454371509?text=${text}`, '_blank', 'noopener');
    closeModal();
  });

  /* ---------- YEAR ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const tzWidget = document.getElementById('tz-widget');
  if (tzWidget) {
    const pkZone = 'Asia/Karachi';
    const visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const pkTimeEl = tzWidget.querySelector('#tz-pk-time');
    const pkDateEl = tzWidget.querySelector('#tz-pk-date');
    const visitorTimeEl = tzWidget.querySelector('#tz-visitor-time');
    const visitorDateEl = tzWidget.querySelector('#tz-visitor-date');
    const visitorNameEl = tzWidget.querySelector('#tz-visitor-name');
    const diffEl = tzWidget.querySelector('#tz-diff');

    const zoneName = (zone) => {
      const fallback = zone.split('/').pop().replace(/_/g, ' ');
      try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' }).formatToParts(new Date());
        return parts.find(p => p.type === 'timeZoneName')?.value || fallback;
      } catch {
        return fallback;
      }
    };

    const offsetMinutes = (zone) => {
      const now = new Date();
      const inZone = new Date(now.toLocaleString('en-US', { timeZone: zone }));
      const inUTC = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      return Math.round((inZone.getTime() - inUTC.getTime()) / 60000);
    };

    const pkOffset = offsetMinutes(pkZone);
    const visitorOffset = offsetMinutes(visitorZone);
    const diffMin = visitorOffset - pkOffset;
    const absDiff = Math.abs(diffMin);
    const diffHours = Math.floor(absDiff / 60);
    const diffRemainMin = absDiff % 60;
    const leadLag = diffMin === 0 ? 'same' : (diffMin > 0 ? 'ahead' : 'behind');

    if (visitorNameEl) visitorNameEl.textContent = zoneName(visitorZone);
    if (diffEl) {
      if (visitorZone === pkZone) diffEl.textContent = 'Same timezone as Pakistan';
      else if (diffMin === 0) diffEl.textContent = 'Same UTC offset as Pakistan';
      else if (diffRemainMin) diffEl.textContent = `Visitor is ${diffHours}h ${diffRemainMin}m ${leadLag} PK`;
      else diffEl.textContent = `Visitor is ${diffHours}h ${leadLag} PK`;
    }

    const timeFmt = (zone) => new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).format(new Date()).replace(/^24:/, '00:');

    const dateFmt = (zone) => new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date());

    const renderTimes = () => {
      if (pkTimeEl) pkTimeEl.textContent = timeFmt(pkZone);
      if (pkDateEl) pkDateEl.textContent = dateFmt(pkZone);
      if (visitorTimeEl) visitorTimeEl.textContent = timeFmt(visitorZone);
      if (visitorDateEl) visitorDateEl.textContent = dateFmt(visitorZone);
    };

    renderTimes();
    const refreshMs = prefersReduced ? 60000 : 1000;
    setInterval(renderTimes, refreshMs);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) renderTimes();
    });
  }

  /* ---------- SMOOTH SCROLL (anchor links) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- CHARTS (Chart.js) ---------- */
  const initCharts = () => {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = getComputedStyle(root).getPropertyValue('--ink-2').trim();
    Chart.defaults.borderColor = getComputedStyle(root).getPropertyValue('--border').trim();
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.font.size = 11;

    const gold = '#2563eb';
    const violet = '#8b5cf6';
    const cyan = '#22d3ee';
    const emerald = '#34d399';
    const grid = { color: 'rgba(255,255,255,0.05)' };

    const c1 = $('#chart-volume');
    if (c1) new Chart(c1, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Projects',
          data: [28,34,38,41,47,52,55,61,58,64,71,68],
          borderColor: gold,
          backgroundColor: 'rgba(37,99,235,0.14)',
          fill: true, tension: 0.42, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid, ticks: { color: '#7c8499' } }, y: { grid, ticks: { color: '#7c8499' } } }
      }
    });

    const c2 = $('#chart-mix');
    if (c2) new Chart(c2, {
      type: 'doughnut',
      data: {
        labels: ['Excel / Dashboards','Power BI','Python / Automation','Research / Docs','SQL / Database','Presentations'],
        datasets: [{
          data: [32,22,18,14,8,6],
          backgroundColor: [gold, violet, cyan, emerald, '#f0abfc', '#fbbf24'],
          borderColor: 'rgba(0,0,0,0)', borderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '64%',
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 14, font: { size: 11 } } } }
      }
    });

    const c3 = $('#chart-ratings');
    if (c3) new Chart(c3, {
      type: 'bar',
      data: {
        labels: ['Communication','Quality','Delivery','Value','Recommend'],
        datasets: [{
          data: [4.9, 4.8, 4.9, 4.7, 4.9],
          backgroundColor: ctx => {
            const g = ctx.chart.ctx.createLinearGradient(0,0,0,240);
            g.addColorStop(0, gold); g.addColorStop(1, 'rgba(37,99,235,.2)');
            return g;
          },
          borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { min: 4, max: 5, grid, ticks: { stepSize: 0.2 } } }
      }
    });

    const c4 = $('#chart-countries');
    if (c4) new Chart(c4, {
      type: 'radar',
      data: {
        labels: ['United States','United Kingdom','Germany','UAE','Canada','Australia','Pakistan','Singapore'],
        datasets: [{
          label: 'Client distribution',
          data: [82, 38, 24, 18, 22, 14, 28, 11],
          borderColor: violet, backgroundColor: 'rgba(139,92,246,0.18)',
          pointBackgroundColor: violet, borderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: { grid: { color: 'rgba(255,255,255,.08)' }, angleLines: { color: 'rgba(255,255,255,.08)' }, ticks: { display: false }, suggestedMin: 0 } }
      }
    });
  };
  if (document.readyState === 'complete') initCharts();
  else window.addEventListener('load', initCharts);

  /* ---------- KONAMI / FUN ---------- */
  console.log('%cAli Raza — Data & Automation','color:#2563eb;font-size:18px;font-weight:700;');
  console.log('%cHire me on Fiverr · alirazaworks.com','color:#6a7896;font-size:12px;');
})();
