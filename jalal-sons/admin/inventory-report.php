<?php
/**
 * Sales & stock report: one row per variant with units sold, remaining
 * units and revenue. Searchable, sortable, filterable; totals row; and a
 * one-click download that respects the current filters.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
require_once __DIR__ . '/partials/report-filters.php';
$pageTitle = 'Inventory & sales report';

$rows = Report::inventory($filters, $sort, $dir);
$totals = Report::totals($rows);
$categories = Category::all();
$subcategories = Category::subcategories();
$brands = Product::brands();
$exportQuery = http_build_query(array_filter($filters + ['sort' => $sort, 'dir' => $dir], fn($v) => $v !== '' && $v !== null));
$xlsxAvailable = is_file(ROOT_PATH . '/vendor/autoload.php') && class_exists('\PhpOffice\PhpSpreadsheet\Spreadsheet', false) || is_dir(ROOT_PATH . '/vendor/phpoffice/phpspreadsheet');

/** Column header link that toggles sorting. */
$sortLink = static function (string $key, string $label) use ($sort, $dir): string {
    $next = ($sort === $key && $dir === 'asc') ? 'desc' : 'asc';
    $arrow = $sort === $key ? ($dir === 'asc' ? ' &uarr;' : ' &darr;') : '';
    return '<a class="' . ($sort === $key ? 'sorted' : '') . '" href="' . e(current_url_with(['sort' => $key, 'dir' => $next])) . '">' . e($label) . $arrow . '</a>';
};
require __DIR__ . '/partials/topbar.php';
?>
<form class="card mb-3" method="get" id="reportFilters">
  <div class="card-body row g-2 align-items-end">
    <div class="col-md-3"><label class="form-label small" for="q">Search</label><input class="form-control form-control-sm" id="q" name="q" value="<?= e($filters['q']) ?>" placeholder="Product, SKU or brand"></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="from">Sales from</label><input class="form-control form-control-sm" type="date" id="from" name="from" value="<?= e($filters['from']) ?>"></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="to">Sales to</label><input class="form-control form-control-sm" type="date" id="to" name="to" value="<?= e($filters['to']) ?>"></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="category">Category</label><select class="form-select form-select-sm" id="category" name="category"><option value="">All</option><?php foreach ($categories as $c): ?><option value="<?= (int) $c['id'] ?>" <?= $filters['category'] == $c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-3"><label class="form-label small" for="subcategory">Cloth type</label><select class="form-select form-select-sm" id="subcategory" name="subcategory"><option value="">All</option><?php foreach ($subcategories as $s): ?><option value="<?= (int) $s['id'] ?>" <?= $filters['subcategory'] == $s['id'] ? 'selected' : '' ?>><?= e($s['name']) ?> (<?= e($s['category_name']) ?>)</option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-3"><label class="form-label small" for="brand">Brand</label><select class="form-select form-select-sm" id="brand" name="brand"><option value="">All</option><?php foreach ($brands as $b): ?><option value="<?= e($b) ?>" <?= $filters['brand'] === $b ? 'selected' : '' ?>><?= e($b) ?></option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="stock">Stock status</label><select class="form-select form-select-sm" id="stock" name="stock"><option value="">All</option><option value="in" <?= $filters['stock'] === 'in' ? 'selected' : '' ?>>In stock</option><option value="low" <?= $filters['stock'] === 'low' ? 'selected' : '' ?>>Low stock</option><option value="out" <?= $filters['stock'] === 'out' ? 'selected' : '' ?>>Out of stock</option></select></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="channel">Sales channel</label><select class="form-select form-select-sm" id="channel" name="channel"><option value="">All</option><?php foreach (Order::CHANNELS as $k => $l): ?><option value="<?= $k ?>" <?= $filters['channel'] === $k ? 'selected' : '' ?>><?= e($l) ?></option><?php endforeach; ?></select></div>
    <input type="hidden" name="sort" value="<?= e($sort) ?>"><input type="hidden" name="dir" value="<?= e($dir) ?>">
    <div class="col-md-5 d-flex flex-wrap gap-1 justify-content-md-end">
      <button class="btn btn-sm btn-dark">Apply filters</button>
      <a class="btn btn-sm btn-outline-dark" href="<?= e(url('admin/inventory-report.php')) ?>">Reset</a>
      <a class="btn btn-sm btn-gold" href="<?= e(url('admin/export_inventory.php?' . $exportQuery)) ?>">&#8595; Download CSV</a>
      <?php if ($xlsxAvailable): ?><a class="btn btn-sm btn-outline-gold" href="<?= e(url('admin/export_inventory.php?format=xlsx&' . $exportQuery)) ?>">&#8595; Download XLSX</a><?php endif; ?>
    </div>
  </div>
</form>

<div class="row g-3 mb-3">
  <div class="col-6 col-md-3"><div class="stat-card"><div class="label">Variants listed</div><p class="value"><?= qty($totals['variants']) ?></p><div class="hint"><?= qty($totals['products']) ?> products</div></div></div>
  <div class="col-6 col-md-3"><div class="stat-card ok"><div class="label">Units sold</div><p class="value"><?= qty($totals['units_sold']) ?></p><div class="hint"><?= $filters['from'] || $filters['to'] ? 'in selected dates' : 'all time' ?></div></div></div>
  <div class="col-6 col-md-3"><div class="stat-card"><div class="label">Remaining units</div><p class="value"><?= qty($totals['remaining']) ?></p><div class="hint">current stock</div></div></div>
  <div class="col-6 col-md-3"><div class="stat-card ok"><div class="label">Revenue</div><p class="value"><?= e(money($totals['revenue'])) ?></p><div class="hint">excl. cancelled/returned</div></div></div>
</div>

<div class="card">
  <div class="table-responsive">
    <table class="table table-sm table-hover mb-0 align-middle" id="reportTable">
      <thead><tr>
        <th><?= $sortLink('product', 'Product') ?></th><th><?= $sortLink('sku', 'SKU') ?></th><th><?= $sortLink('brand', 'Brand') ?></th>
        <th><?= $sortLink('category', 'Category') ?></th><th>Subcategory</th><th><?= $sortLink('variant', 'Variant') ?></th>
        <th class="text-end"><?= $sortLink('price', 'Price') ?></th><th class="text-end"><?= $sortLink('sold', 'Units sold') ?></th>
        <th class="text-end"><?= $sortLink('remaining', 'Remaining') ?></th><th class="text-end"><?= $sortLink('revenue', 'Revenue') ?></th><th>Stock status</th>
      </tr></thead>
      <tbody>
      <?php if (!$rows): ?><tr><td colspan="11" class="text-center text-secondary py-4">No variants match these filters.</td></tr><?php endif; ?>
      <?php foreach ($rows as $r): ?>
        <tr>
          <td><a class="text-decoration-none text-dark" href="<?= e(url('admin/edit-product.php?id=' . (int) $r['product_id'])) ?>"><?= e($r['product']) ?></a></td>
          <td class="small text-secondary"><?= e($r['sku']) ?></td><td><?= e($r['brand']) ?></td><td><?= e($r['category']) ?></td><td><?= e($r['subcategory']) ?></td><td><?= e($r['variant']) ?></td>
          <td class="text-end text-nowrap"><?= e(money($r['price'])) ?></td><td class="text-end"><?= qty($r['units_sold']) ?></td><td class="text-end"><?= qty($r['remaining']) ?></td>
          <td class="text-end text-nowrap"><?= e(money($r['revenue'])) ?></td>
          <td><span class="badge badge-stock <?= $r['status']['key'] ?>"><?= e($r['status']['label']) ?></span></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
      <tfoot><tr><td colspan="7">Totals (<?= qty($totals['variants']) ?> variants)</td><td class="text-end"><?= qty($totals['units_sold']) ?></td><td class="text-end"><?= qty($totals['remaining']) ?></td><td class="text-end text-nowrap"><?= e(money($totals['revenue'])) ?></td><td></td></tr></tfoot>
    </table>
  </div>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
