/* =====================================================================
   Jalal Sons - Admin panel JavaScript (vanilla ES6, no build step)
   Dependent dropdowns, variant rows, image previews/reorder, quick stock
   updates, shop-sale search, dashboard chart, confirm dialogs.
   ===================================================================== */
(function () {
  'use strict';

  const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => 'Rs. ' + Number(n).toLocaleString('en-PK', { maximumFractionDigits: 0 });

  /* ---------- confirm dialogs on destructive buttons ---------- */
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-confirm]');
    if (btn && !window.confirm(btn.dataset.confirm)) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
  }, true);

  /* ---------- auto-dismiss success alerts ---------- */
  setTimeout(() => $$('.alert-success.alert-dismissible').forEach((a) => bootstrap.Alert.getOrCreateInstance(a).close()), 6000);

  /* ---------- dependent category -> subcategory dropdowns ---------- */
  const form = $('#productForm');
  if (form) {
    const cat = $('#category_id');
    const sub = $('#subcategory_id');
    const allOptions = $$('option[data-category]', sub).map((o) => ({ id: o.value, cat: o.dataset.category, text: o.textContent }));

    const renderSubs = (items, selected) => {
      sub.innerHTML = '<option value="">Choose...</option>';
      items.forEach((it) => {
        const o = document.createElement('option');
        o.value = it.id;
        o.textContent = it.text || (it.name + (it.is_active ? '' : ' (hidden)'));
        if (String(it.id) === String(selected)) o.selected = true;
        sub.appendChild(o);
      });
    };
    const loadSubs = async (keepSelected) => {
      const selected = keepSelected ? (sub.value || form.dataset.selectedSubcategory) : '';
      if (!cat.value) { renderSubs(allOptions, selected); return; }
      try {
        const res = await fetch(form.dataset.subcategoryUrl + '?category_id=' + encodeURIComponent(cat.value), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        const data = await res.json();
        if (data.ok) { renderSubs(data.items, selected); return; }
      } catch (e) { /* fall through to local filter */ }
      renderSubs(allOptions.filter((o) => o.cat === cat.value), selected);
    };
    cat.addEventListener('change', () => loadSubs(false));
    if (cat.value) loadSubs(true);

    /* ---------- variant rows ---------- */
    const tbody = $('#variantTable tbody');
    const rowTemplate = (i, size = '', color = '') => `
      <tr>
        <td><input type="hidden" name="variants[${i}][id]" value="0">
            <input class="form-control form-control-sm" name="variants[${i}][size]" list="sizeList" value="${size}" placeholder="M / Unstitched"></td>
        <td><input class="form-control form-control-sm" name="variants[${i}][color]" value="${color}" placeholder="Maroon"></td>
        <td><input class="form-control form-control-sm form-control-color color-dot" type="color" name="variants[${i}][color_hex]" value="#D4AF37" title="Swatch colour"></td>
        <td><input class="form-control form-control-sm" type="number" min="0" step="1" name="variants[${i}][stock_quantity]" placeholder="0"></td>
        <td><input class="form-control form-control-sm" name="variants[${i}][sku]" placeholder="auto"></td>
        <td class="text-end"><button class="btn btn-sm btn-outline-danger js-remove-row" type="button" aria-label="Remove row">&times;</button></td>
      </tr>`;
    let nextIndex = tbody ? tbody.children.length + 100 : 0;
    const addRow = (size, color) => { tbody.insertAdjacentHTML('beforeend', rowTemplate(nextIndex++, size, color)); };
    $('#addVariantRow')?.addEventListener('click', () => addRow('', ''));
    $('#addSizeRun')?.addEventListener('click', () => {
      const color = $('input[name$="[color]"]', tbody)?.value || '';
      ['XS', 'S', 'M', 'L', 'XL', 'XXL'].forEach((s) => addRow(s, color));
    });
    tbody?.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.js-remove-row');
      if (!btn) return;
      if (tbody.children.length === 1) {
        $$('input', btn.closest('tr')).forEach((inp) => { if (inp.type !== 'color' && inp.type !== 'hidden') inp.value = ''; });
      } else {
        btn.closest('tr').remove();
      }
    });

    /* ---------- image dropzone with previews & client-side checks ---------- */
    const input = $('#images');
    const zone = $('#dropzone');
    const grid = $('#previewGrid');
    if (input && zone && grid) {
      const maxFiles = Number(grid.dataset.maxFiles || 8);
      const maxSize = Number(grid.dataset.maxSize || 5242880);
      const okTypes = ['image/jpeg', 'image/png', 'image/webp'];
      let files = [];

      const sync = () => {
        const dt = new DataTransfer();
        files.forEach((f) => dt.items.add(f));
        input.files = dt.files;
        grid.innerHTML = '';
        files.forEach((f, idx) => {
          const item = document.createElement('div');
          item.className = 'preview-item';
          const img = document.createElement('img');
          img.alt = '';
          img.src = URL.createObjectURL(f);
          img.onload = () => URL.revokeObjectURL(img.src);
          const meta = document.createElement('div');
          meta.className = 'meta';
          meta.textContent = (idx === 0 && !$('#existingImages') ? 'Primary - ' : '') + f.name + ' (' + (f.size / 1048576).toFixed(1) + ' MB)';
          const rm = document.createElement('button');
          rm.type = 'button';
          rm.className = 'btn btn-sm btn-danger remove';
          rm.textContent = '×';
          rm.setAttribute('aria-label', 'Remove ' + f.name);
          rm.onclick = () => { files.splice(idx, 1); sync(); };
          item.append(img, meta, rm);
          grid.appendChild(item);
        });
      };
      const addFiles = (list) => {
        const problems = [];
        Array.from(list).forEach((f) => {
          if (!okTypes.includes(f.type)) { problems.push(`"${f.name}" is not a JPEG, PNG or WebP image.`); return; }
          if (f.size > maxSize) { problems.push(`"${f.name}" is larger than ${Math.round(maxSize / 1048576)} MB.`); return; }
          if (files.length >= maxFiles) { problems.push(`Only ${maxFiles} images per upload; "${f.name}" skipped.`); return; }
          files.push(f);
        });
        if (problems.length) window.alert(problems.join('\n'));
        sync();
      };
      input.addEventListener('change', () => { addFiles(input.files); });
      ['dragenter', 'dragover'].forEach((t) => zone.addEventListener(t, (e) => { e.preventDefault(); zone.classList.add('dragover'); }));
      ['dragleave', 'drop'].forEach((t) => zone.addEventListener(t, (e) => { e.preventDefault(); zone.classList.remove('dragover'); }));
      zone.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));
    }

    /* ---------- existing images: drag to reorder, highlight primary ---------- */
    const existing = $('#existingImages');
    if (existing) {
      let dragged = null;
      existing.addEventListener('dragstart', (e) => { dragged = e.target.closest('[data-image-id]'); dragged?.classList.add('dragging'); });
      existing.addEventListener('dragend', () => { dragged?.classList.remove('dragging'); dragged = null; });
      existing.addEventListener('dragover', (e) => {
        e.preventDefault();
        const over = e.target.closest('[data-image-id]');
        if (!dragged || !over || over === dragged) return;
        const rect = over.getBoundingClientRect();
        const after = (e.clientX - rect.left) > rect.width / 2;
        existing.insertBefore(dragged, after ? over.nextSibling : over);
      });
      existing.addEventListener('change', (e) => {
        if (e.target.name === 'primary_image') {
          $$('.image-card', existing).forEach((c) => c.classList.remove('primary'));
          e.target.closest('.image-card').classList.add('primary');
        }
      });
    }
  }

  /* ---------- quick stock +/- forms (product list modal) ---------- */
  document.addEventListener('submit', async (ev) => {
    const f = ev.target.closest('.js-stock-form');
    if (!f) return;
    ev.preventDefault();
    const btn = $('button', f);
    btn.disabled = true;
    try {
      const res = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-Token': csrf } });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message || 'Failed');
      const row = f.closest('tr');
      $('[data-variant-stock]', row).textContent = data.stock_quantity;
      const productId = f.closest('.modal').id.replace('stock-', '');
      const badge = document.querySelector(`[data-product-total="${productId}"]`);
      if (badge) {
        badge.textContent = data.product_total.toLocaleString();
        badge.className = 'badge badge-stock ' + (data.product_total <= 0 ? 'out' : (data.product_total <= 3 ? 'low' : 'in'));
      }
      $('input[name="delta"]', f).value = '';
      $('input[name="note"]', f).value = '';
      toast(data.message, 'success');
    } catch (err) {
      toast(err.message || 'Could not update stock.', 'danger');
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- toast helper ---------- */
  function toast(message, type = 'success') {
    let wrap = $('#toastWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toastWrap';
      wrap.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${type} border-0`;
    el.setAttribute('role', 'status');
    el.innerHTML = `<div class="d-flex"><div class="toast-body"></div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
    $('.toast-body', el).textContent = message;
    wrap.appendChild(el);
    const t = new bootstrap.Toast(el, { delay: 3500 });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    t.show();
  }

  /* ---------- dashboard chart ---------- */
  const chartEl = $('#salesChart');
  const chartData = $('#salesChartData');
  if (chartEl && chartData && window.Chart) {
    const d = JSON.parse(chartData.textContent);
    new Chart(chartEl, {
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [
          { label: 'Units sold', data: d.units, backgroundColor: 'rgba(212,175,55,.85)', borderRadius: 2, yAxisID: 'y' },
          { label: 'Revenue (Rs.)', data: d.revenue, type: 'line', borderColor: '#1C1A16', backgroundColor: '#1C1A16', tension: .3, pointRadius: 2, yAxisID: 'y1' },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Units' } },
          y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: (v) => money(v) } },
          x: { ticks: { maxTicksLimit: 10 } },
        },
        plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (c) => c.dataset.yAxisID === 'y1' ? ' ' + money(c.parsed.y) : ' ' + c.parsed.y + ' units' } } },
      },
    });
  }

  /* ---------- shop sale: product search & cart ---------- */
  const saleForm = $('#shopSaleForm');
  if (saleForm) {
    const search = $('#saleSearch');
    const results = $('#saleResults');
    const lines = $('#saleLines');
    const empty = $('#saleEmpty');
    const totalsEl = { subtotal: $('#saleSubtotal'), discount: $('#saleDiscount'), total: $('#saleTotal') };
    let timer = null;
    let idx = 0;

    const recalc = () => {
      let subtotal = 0;
      $$('tr[data-line]', lines).forEach((tr) => {
        const qty = Number($('[name$="[quantity]"]', tr).value) || 0;
        const price = Number($('[name$="[unit_price]"]', tr).value) || 0;
        const lt = qty * price;
        $('[data-line-total]', tr).textContent = money(lt);
        subtotal += lt;
      });
      const discount = Math.min(subtotal, Number($('#discount').value) || 0);
      totalsEl.subtotal.textContent = money(subtotal);
      totalsEl.total.textContent = money(subtotal - discount);
      empty.hidden = lines.children.length > 0;
      $('#saleSubmit').disabled = lines.children.length === 0;
    };
    const addLine = (item) => {
      const existing = $(`tr[data-variant="${item.variant_id}"]`, lines);
      if (existing) {
        const q = $('[name$="[quantity]"]', existing);
        q.value = Math.min(item.stock, Number(q.value) + 1);
        recalc();
        return;
      }
      const i = idx++;
      lines.insertAdjacentHTML('beforeend', `
        <tr data-line data-variant="${item.variant_id}">
          <td><input type="hidden" name="lines[${i}][variant_id]" value="${item.variant_id}">
              <div class="fw-semibold"></div><div class="small text-secondary"></div></td>
          <td style="width:110px"><input class="form-control form-control-sm" type="number" name="lines[${i}][quantity]" min="1" max="${item.stock}" value="1" aria-label="Quantity"></td>
          <td style="width:140px"><input class="form-control form-control-sm" type="number" name="lines[${i}][unit_price]" min="0" step="1" value="${item.price}" aria-label="Unit price"></td>
          <td class="text-end text-nowrap" data-line-total></td>
          <td class="text-end"><button class="btn btn-sm btn-outline-danger js-remove-line" type="button" aria-label="Remove">&times;</button></td>
        </tr>`);
      const tr = lines.lastElementChild;
      $('.fw-semibold', tr).textContent = item.product_name;
      $('.small', tr).textContent = `${item.label} · ${item.sku} · ${item.stock} in stock`;
      recalc();
    };
    const renderResults = (items) => {
      results.innerHTML = '';
      if (!items.length) { results.hidden = true; return; }
      items.forEach((it) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.disabled = it.stock <= 0;
        b.innerHTML = `<img class="thumb-sm" alt="" width="40" height="52"><div class="flex-fill"><div class="fw-semibold"></div><div class="small text-secondary"></div></div><div class="text-end small"></div>`;
        $('img', b).src = it.thumb;
        $('.fw-semibold', b).textContent = it.product_name;
        $('.small.text-secondary', b).textContent = `${it.label} · ${it.sku}`;
        $('.text-end', b).textContent = it.stock > 0 ? `${it.price_label} · ${it.stock} left` : 'Sold out';
        b.onclick = () => { addLine(it); results.hidden = true; search.value = ''; search.focus(); };
        results.appendChild(b);
      });
      results.hidden = false;
    };
    search.addEventListener('input', () => {
      clearTimeout(timer);
      const q = search.value.trim();
      if (q.length < 2) { results.hidden = true; return; }
      timer = setTimeout(async () => {
        try {
          const res = await fetch(saleForm.dataset.searchUrl + '?q=' + encodeURIComponent(q), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
          const data = await res.json();
          renderResults(data.items || []);
        } catch (e) { results.hidden = true; }
      }, 250);
    });
    document.addEventListener('click', (e) => { if (!results.contains(e.target) && e.target !== search) results.hidden = true; });
    lines.addEventListener('input', recalc);
    lines.addEventListener('click', (e) => { if (e.target.closest('.js-remove-line')) { e.target.closest('tr').remove(); recalc(); } });
    $('#discount').addEventListener('input', recalc);
    recalc();
  }
})();
document.addEventListener('click', (e) => { if (e.target.closest('[data-print]')) window.print(); });
