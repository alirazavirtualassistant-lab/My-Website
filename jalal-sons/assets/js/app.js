/* =====================================================================
   Jalal Sons - Storefront JavaScript (vanilla ES6, no build step)
   Gallery, variant selection with live stock, quantity, Add to Cart via
   fetch (with full-page fallback), cart quantity updates, filter auto-submit.
   ===================================================================== */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const csrf = document.body.dataset.csrf || '';

  /* ---------- toast ---------- */
  function toast(message, type = 'success') {
    const wrap = $('#toastWrap');
    if (!wrap || !window.bootstrap) { return; }
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'danger' ? 'danger' : '');
    el.setAttribute('role', 'status');
    el.innerHTML = '<div class="d-flex"><div class="toast-body"></div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>';
    $('.toast-body', el).textContent = message;
    wrap.appendChild(el);
    const t = new bootstrap.Toast(el, { delay: 3500 });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    t.show();
  }
  const updateCartBadge = (n) => $$('[data-cart-count]').forEach((b) => { b.textContent = n > 0 ? n : ''; b.dataset.count = n; });

  /* ---------- gallery ---------- */
  const main = $('#galleryMain');
  const mainImg = $('#galleryImage');
  if (main && mainImg) {
    $$('#gallery .thumbs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('#gallery .thumbs button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        mainImg.src = btn.dataset.full;
        mainImg.alt = btn.dataset.alt || '';
        main.classList.remove('zoomed');
      });
    });
    // Zoom on desktop (pointer: fine), ignored on touch devices.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      main.addEventListener('click', () => main.classList.toggle('zoomed'));
      main.addEventListener('mousemove', (e) => {
        const r = main.getBoundingClientRect();
        mainImg.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%');
        mainImg.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%');
      });
      main.addEventListener('mouseleave', () => main.classList.remove('zoomed'));
    }
    // Swipe between images on touch.
    let startX = null;
    main.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    main.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) < 40) return;
      const thumbs = $$('#gallery .thumbs button');
      const i = thumbs.findIndex((b) => b.classList.contains('active'));
      const next = thumbs[(i + (dx < 0 ? 1 : -1) + thumbs.length) % thumbs.length];
      next?.click();
    }, { passive: true });
  }

  /* ---------- variant selection & live stock ---------- */
  const form = $('#buyForm');
  if (form) {
    const data = JSON.parse($('#variantData').textContent || '[]');
    const low = Number(form.dataset.low || 3);
    const select = $('#variantSelect');
    const wrap = $('#variantSelectWrap');
    const indicator = $('#stockIndicator');
    const qty = $('#qty');
    const addBtns = [$('#addToCart'), $('#addToCartMobile')].filter(Boolean);
    const waLinks = [$('#waOrder'), $('#waOrderMobile')].filter(Boolean);
    const groups = $$('.option-group[data-option]', form);
    const chosen = {};
    const hasGroups = groups.length > 0;
    if (hasGroups) wrap.hidden = true; // swatches replace the plain select

    const matches = (v) => Object.entries(chosen).every(([k, val]) => v[k] === val);
    const current = () => {
      if (!hasGroups) { return data.find((v) => String(v.id) === select.value) || (data.length === 1 ? data[0] : null); }
      if (groups.some((g) => !chosen[g.dataset.option])) return null;
      return data.find(matches) || null;
    };
    const setIndicator = (v) => {
      indicator.className = 'stock-indicator';
      if (!v) { indicator.classList.add(data.some((x) => x.stock > 0) ? 'in' : 'out'); indicator.textContent = data.some((x) => x.stock > 0) ? 'Select an option to see availability' : 'Out of Stock'; return; }
      if (v.stock <= 0) { indicator.classList.add('out'); indicator.textContent = 'Out of Stock'; }
      else if (v.stock <= low) { indicator.classList.add('low'); indicator.textContent = 'Only ' + v.stock + ' left'; }
      else { indicator.classList.add('in'); indicator.textContent = 'In Stock'; }
    };
    const refresh = () => {
      const v = current();
      // Disable swatches whose combination has no stock given the other choice.
      groups.forEach((g) => {
        const key = g.dataset.option;
        $$('.swatch', g).forEach((b) => {
          const others = { ...chosen }; delete others[key];
          const ok = data.some((x) => x[key] === b.dataset.value && x.stock > 0 && Object.entries(others).every(([k, val]) => x[k] === val));
          b.classList.toggle('unavailable', !ok);
          b.setAttribute('aria-pressed', chosen[key] === b.dataset.value ? 'true' : 'false');
        });
        const sel = $('[data-selected]', g);
        if (sel) sel.textContent = chosen[key] ? '- ' + chosen[key] : '';
      });
      setIndicator(v);
      const can = !!v && v.stock > 0;
      addBtns.forEach((b) => { b.disabled = !can; b.innerHTML = b.innerHTML.replace(/(Add to Cart|Sold Out|Choose option)$/, v && v.stock <= 0 ? 'Sold Out' : (hasGroups && !v ? 'Choose option' : 'Add to Cart')); });
      if (v) { qty.max = Math.max(1, v.stock); if (Number(qty.value) > v.stock && v.stock > 0) qty.value = v.stock; if (hasGroups) select.value = v.id; }
      const label = v ? (v.size !== 'Unstitched' ? v.size + ' / ' + v.color : v.color) : '';
      const text = form.dataset.waBase + (label ? '\nOption: ' + label : '') + '\nQuantity: ' + (qty.value || 1) + '\n' + form.dataset.url;
      waLinks.forEach((a) => { a.href = 'https://wa.me/' + form.dataset.waNumber + '?text=' + encodeURIComponent(text); });
    };
    groups.forEach((g) => g.addEventListener('click', (e) => {
      const b = e.target.closest('.swatch');
      if (!b) return;
      const key = g.dataset.option;
      chosen[key] = chosen[key] === b.dataset.value ? undefined : b.dataset.value;
      if (chosen[key] === undefined) delete chosen[key];
      refresh();
    }));
    // Auto-select when a group has a single option.
    groups.forEach((g) => { const sw = $$('.swatch', g); if (sw.length === 1) chosen[g.dataset.option] = sw[0].dataset.value; });
    select?.addEventListener('change', refresh);
    $$('[data-qty]', form).forEach((b) => b.addEventListener('click', () => {
      const max = Number(qty.max) || 99;
      qty.value = Math.min(max, Math.max(1, (Number(qty.value) || 1) + Number(b.dataset.qty)));
      refresh();
    }));
    qty.addEventListener('input', refresh);
    refresh();

    // Add to cart via fetch; falls back to a normal POST when fetch fails.
    form.addEventListener('submit', async (e) => {
      const v = current();
      if (!v) { e.preventDefault(); toast('Please choose a size / colour first.', 'danger'); return; }
      if (v.stock <= 0) { e.preventDefault(); toast('Sorry, this option is out of stock.', 'danger'); return; }
      e.preventDefault();
      const fd = new FormData(form);
      fd.set('variant_id', String(v.id));
      let out;
      try {
        // form.getAttribute: the form has an input named "action", so form.action would return that element.
        const res = await fetch(form.getAttribute('action'), { method: 'POST', body: fd, headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-Token': csrf } });
        out = await res.json();
      } catch (err) {
        // Network problem or non-JSON reply: fall back to a normal page POST.
        console.error('Add to cart fetch failed, falling back to form submit', err);
        form.submit();
        return;
      }
      toast(out.message, out.ok ? 'success' : 'danger');
      if (out.ok) updateCartBadge(out.count);
      if (typeof out.stock === 'number') { const vv = data.find((x) => x.id === v.id); if (vv) { vv.stock = out.stock; refresh(); } }
    });
  }

  /* ---------- cart page: auto-submit quantity changes ---------- */
  $$('form[data-cart-line] input[name="qty"]').forEach((inp) => {
    let t;
    inp.addEventListener('change', () => { clearTimeout(t); t = setTimeout(() => inp.form.requestSubmit(), 150); });
  });
  $$('[data-qty-step]').forEach((b) => b.addEventListener('click', () => {
    const inp = $('input[name="qty"]', b.closest('form'));
    inp.value = Math.max(0, (Number(inp.value) || 0) + Number(b.dataset.qtyStep));
    inp.form.requestSubmit();
  }));

  /* ---------- shop filters: submit on change ---------- */
  $$('[data-autosubmit]').forEach((el) => el.addEventListener('change', () => el.form.requestSubmit()));

  /* ---------- Google AdSense: request each unit (no inline scripts, CSP friendly) ---------- */
  const adUnits = $$('ins.adsbygoogle');
  if (adUnits.length) {
    window.adsbygoogle = window.adsbygoogle || [];
    adUnits.forEach(() => { try { window.adsbygoogle.push({}); } catch (e) { /* blocked by an ad blocker: ignore */ } });
  }

  /* ---------- checkout: phone formatting hint ---------- */
  const phone = $('#phone');
  if (phone) phone.addEventListener('blur', () => { phone.value = phone.value.replace(/[\s\-()]/g, ''); });
})();
