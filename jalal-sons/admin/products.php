<?php
/**
 * Product list: search by name/SKU/brand, filter by category, cloth type,
 * status and stock; pagination; edit, activate/deactivate, quick stock
 * +/- (modal) and soft delete (owner only).
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
$pageTitle = 'Products';

if (is_post()) {
    $id = post_int('id');
    $action = post('action');
    if ($id && $action === 'toggle') {
        Product::toggleActive($id);
        flash('success', 'Product visibility updated.');
    } elseif ($id && $action === 'delete') {
        Auth::requireOwner();
        Product::softDelete($id);
        flash('success', 'Product deleted. Past orders keep their history.');
    }
    back('admin/products.php');
}

$filters = [
    'q' => mb_substr(get('q'), 0, 100), 'category' => get_int('category') ?: '', 'subcategory' => get_int('subcategory') ?: '',
    'status' => in_array(get('status'), ['active', 'inactive'], true) ? get('status') : '',
    'stock' => in_array(get('stock'), ['in', 'low', 'out'], true) ? get('stock') : '',
    'sort' => in_array(get('sort'), ['newest', 'name', 'price_asc', 'price_desc', 'stock_asc', 'updated'], true) ? get('sort') : 'updated',
];
$result = Product::search($filters, get_int('page', 1), 20, true);
$products = $result['items'];
$pg = $result['pagination'];
$categories = Category::all();
$subcategories = Category::subcategories();

// Variants for the quick-stock modal of each product on this page.
$variantsByProduct = [];
if ($products) {
    $ids = array_map('intval', array_column($products, 'id'));
    $in = implode(',', $ids);
    foreach (Database::fetchAll("SELECT * FROM product_variants WHERE product_id IN ($in) ORDER BY FIELD(size,'XS','S','M','L','XL','XXL','Free Size','Unstitched'), size, color") as $v) {
        $variantsByProduct[$v['product_id']][] = $v;
    }
}
require __DIR__ . '/partials/topbar.php';
?>
<form class="card mb-3" method="get">
  <div class="card-body row g-2 align-items-end">
    <div class="col-md-4 col-xl-3"><label class="form-label small" for="q">Search</label><input class="form-control form-control-sm" id="q" name="q" value="<?= e($filters['q']) ?>" placeholder="Name, SKU or brand"></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="fcat">Category</label>
      <select class="form-select form-select-sm" id="fcat" name="category"><option value="">All</option><?php foreach ($categories as $c): ?><option value="<?= (int) $c['id'] ?>" <?= $filters['category'] == $c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="fsub">Cloth type</label>
      <select class="form-select form-select-sm" id="fsub" name="subcategory"><option value="">All</option><?php foreach ($subcategories as $s): ?><option value="<?= (int) $s['id'] ?>" <?= $filters['subcategory'] == $s['id'] ? 'selected' : '' ?>><?= e($s['name']) ?> (<?= e($s['category_name']) ?>)</option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-2 col-xl-1"><label class="form-label small" for="fstatus">Status</label>
      <select class="form-select form-select-sm" id="fstatus" name="status"><option value="">All</option><option value="active" <?= $filters['status'] === 'active' ? 'selected' : '' ?>>Active</option><option value="inactive" <?= $filters['status'] === 'inactive' ? 'selected' : '' ?>>Inactive</option></select></div>
    <div class="col-6 col-md-2 col-xl-1"><label class="form-label small" for="fstock">Stock</label>
      <select class="form-select form-select-sm" id="fstock" name="stock"><option value="">All</option><option value="in" <?= $filters['stock'] === 'in' ? 'selected' : '' ?>>In stock</option><option value="low" <?= $filters['stock'] === 'low' ? 'selected' : '' ?>>Low</option><option value="out" <?= $filters['stock'] === 'out' ? 'selected' : '' ?>>Sold out</option></select></div>
    <div class="col-6 col-md-2 col-xl-1"><label class="form-label small" for="fsort">Sort</label>
      <select class="form-select form-select-sm" id="fsort" name="sort"><?php foreach (['updated' => 'Last updated', 'newest' => 'Newest', 'name' => 'Name', 'price_asc' => 'Price low-high', 'price_desc' => 'Price high-low', 'stock_asc' => 'Stock low-high'] as $k => $l): ?><option value="<?= $k ?>" <?= $filters['sort'] === $k ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-2 col-xl-2 d-flex gap-1"><button class="btn btn-sm btn-gold flex-fill">Filter</button><a class="btn btn-sm btn-outline-dark" href="<?= e(url('admin/products.php')) ?>">Reset</a></div>
  </div>
</form>

<div class="card">
  <div class="card-header d-flex align-items-center">
    <span><?= qty($pg['total']) ?> product<?= $pg['total'] === 1 ? '' : 's' ?></span>
    <a class="btn btn-sm btn-gold ms-auto" href="<?= e(url('admin/add-product.php')) ?>">+ Add product</a>
  </div>
  <div class="table-responsive">
    <table class="table mb-0 align-middle">
      <thead><tr><th></th><th>Product</th><th>Category</th><th class="text-end">Price</th><th class="text-end">Stock</th><th>Status</th><th class="text-end">Actions</th></tr></thead>
      <tbody>
      <?php if (!$products): ?><tr><td colspan="7" class="text-center text-secondary py-4">No products match these filters.</td></tr><?php endif; ?>
      <?php foreach ($products as $p): $st = stock_state((int) $p['total_stock']); ?>
        <tr data-product-row="<?= (int) $p['id'] ?>">
          <td><img class="thumb-sm" src="<?= e(image_url($p['thumb_path'] ?: $p['image_path'])) ?>" alt="" width="48" height="64" loading="lazy"></td>
          <td>
            <a class="fw-semibold text-decoration-none text-dark" href="<?= e(url('admin/edit-product.php?id=' . (int) $p['id'])) ?>"><?= e($p['name']) ?></a>
            <div class="small text-secondary"><?= e($p['sku']) ?><?= $p['brand'] ? ' &middot; ' . e($p['brand']) : '' ?><?= $p['is_featured'] ? ' &middot; <span class="text-gold">Featured</span>' : '' ?></div>
          </td>
          <td class="small"><?= e($p['category_name']) ?><br><span class="text-secondary"><?= e($p['subcategory_name']) ?></span></td>
          <td class="text-end text-nowrap"><?= e(money($p['price'])) ?><?= is_on_sale($p) ? '<br><s class="small text-secondary">' . e(money($p['base_price'])) . '</s>' : '' ?></td>
          <td class="text-end"><span class="badge badge-stock <?= $st['key'] ?>" data-product-total="<?= (int) $p['id'] ?>"><?= qty($p['total_stock']) ?></span></td>
          <td><span class="badge <?= $p['is_active'] ? 'text-bg-success' : 'text-bg-secondary' ?>"><?= $p['is_active'] ? 'Active' : 'Inactive' ?></span></td>
          <td class="text-end text-nowrap">
            <button class="btn btn-sm btn-outline-gold" type="button" data-bs-toggle="modal" data-bs-target="#stock-<?= (int) $p['id'] ?>">Stock</button>
            <a class="btn btn-sm btn-outline-dark" href="<?= e(url('admin/edit-product.php?id=' . (int) $p['id'])) ?>">Edit</a>
            <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="id" value="<?= (int) $p['id'] ?>"><button class="btn btn-sm btn-light" name="action" value="toggle"><?= $p['is_active'] ? 'Deactivate' : 'Activate' ?></button></form>
            <?php if (Auth::isOwner()): ?><form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="id" value="<?= (int) $p['id'] ?>"><button class="btn btn-sm btn-outline-danger" name="action" value="delete" data-confirm="Delete &quot;<?= e($p['name']) ?>&quot;? It will disappear from the website.">Delete</button></form><?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php if ($pg['pages'] > 1): ?><div class="card-body border-top"><?= pagination_links($pg) ?></div><?php endif; ?>
</div>

<?php foreach ($products as $p): ?>
<div class="modal fade" id="stock-<?= (int) $p['id'] ?>" tabindex="-1" aria-labelledby="stockTitle<?= (int) $p['id'] ?>" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content">
    <div class="modal-header"><h2 class="modal-title h6" id="stockTitle<?= (int) $p['id'] ?>">Stock: <?= e($p['name']) ?></h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
    <div class="modal-body">
      <div class="table-responsive"><table class="table table-sm align-middle mb-2">
        <thead><tr><th>Variant</th><th>SKU</th><th class="text-end">In stock</th><th style="width:300px">Adjust</th></tr></thead>
        <tbody>
        <?php foreach ($variantsByProduct[$p['id']] ?? [] as $v): ?>
          <tr data-variant-id="<?= (int) $v['id'] ?>">
            <td><?= e(Variant::label($v)) ?></td>
            <td class="small text-secondary"><?= e($v['sku']) ?></td>
            <td class="text-end fw-semibold" data-variant-stock><?= (int) $v['stock_quantity'] ?></td>
            <td>
              <form class="js-stock-form d-flex gap-1" action="<?= e(url('admin/ajax/stock-update.php')) ?>" method="post">
                <?= Csrf::field() ?><input type="hidden" name="variant_id" value="<?= (int) $v['id'] ?>">
                <input class="form-control form-control-sm" type="number" name="delta" step="1" placeholder="+/-" aria-label="Quantity to add or remove" required style="width:80px">
                <select class="form-select form-select-sm" name="reason" aria-label="Reason"><option value="restock">Restock</option><option value="adjustment">Correction</option><option value="return">Return</option></select>
                <input class="form-control form-control-sm" name="note" placeholder="Note" aria-label="Note" maxlength="255">
                <button class="btn btn-sm btn-gold">Apply</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table></div>
      <p class="small text-secondary mb-0">Enter a positive number to add stock or a negative number (e.g. -2) to remove it. Every change is logged.</p>
    </div>
  </div></div>
</div>
<?php endforeach; ?>
<?php require __DIR__ . '/partials/footer.php'; ?>
