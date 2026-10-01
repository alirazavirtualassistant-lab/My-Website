<?php
/**
 * Edit product: same form as add, plus image management (primary,
 * reorder, delete, alt text), stock editing and the stock movement history.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
require_once __DIR__ . '/partials/product-validate.php';

$id = get_int('id');
$product = $id ? Product::find($id) : null;
if (!$product) {
    flash('danger', 'Product not found.');
    redirect(url('admin/products.php'));
}
$pageTitle = 'Edit product';
$errors = [];

if (is_post()) {
    $r = validate_product_post($id);
    $errors = $r['errors'];
    if (!$errors) {
        try {
            Product::update($id, $r['data'], $r['variants'], Auth::id());

            // Existing images: deletions, alt text, order, primary.
            $existing = array_column(Product::images($id), null, 'id');
            foreach ((array) ($_POST['delete_images'] ?? []) as $delId) {
                $delId = (int) $delId;
                if (isset($existing[$delId])) {
                    ImageUploader::deleteFiles($existing[$delId]);
                    Database::run('DELETE FROM product_images WHERE id = :id AND product_id = :p', ['id' => $delId, 'p' => $id]);
                    unset($existing[$delId]);
                }
            }
            $order = 0;
            foreach ((array) ($_POST['image_order'] ?? []) as $imgId) {
                $imgId = (int) $imgId;
                if (isset($existing[$imgId])) {
                    $alt = mb_substr(trim((string) ($_POST['image_alt'][$imgId] ?? '')), 0, 150);
                    Database::update('product_images', ['sort_order' => $order++, 'alt_text' => $alt ?: $r['data']['name']], $imgId);
                }
            }
            // New uploads.
            $uploader = new ImageUploader($id);
            foreach ($uploader->handle($_FILES['images'] ?? []) as $img) {
                $newId = Database::insert('product_images', [
                    'product_id' => $id, 'image_path' => $img['image_path'], 'thumb_path' => $img['thumb_path'],
                    'alt_text' => $r['data']['name'], 'is_primary' => 0, 'sort_order' => $order++,
                ]);
                $existing[$newId] = ['id' => $newId];
            }
            foreach ($uploader->errors() as $msg) {
                flash('warning', $msg);
            }
            // Primary image: chosen one, or the first remaining.
            $primary = post_int('primary_image');
            if (!isset($existing[$primary])) {
                $first = Database::fetch('SELECT id FROM product_images WHERE product_id = :p ORDER BY sort_order, id LIMIT 1', ['p' => $id]);
                $primary = (int) ($first['id'] ?? 0);
            }
            Database::run('UPDATE product_images SET is_primary = IF(id = :pid, 1, 0) WHERE product_id = :p', ['pid' => $primary, 'p' => $id]);

            clear_old();
            flash('success', 'Product updated. Changes are live on the website now.');
            redirect(url('admin/edit-product.php?id=' . $id));
        } catch (PDOException $e) {
            log_message('error', 'edit-product: ' . $e->getMessage());
            $errors['general'] = (int) ($e->errorInfo[1] ?? 0) === 1062 ? 'A SKU or variant SKU is already in use.' : 'Could not save the product. Please try again.';
        }
    }
    remember_old($_POST);
}

$variants = Product::variants($id);
$images = Product::images($id);
$categories = Category::all();
$subcategories = Category::subcategories();
$brands = Product::brands();
$movements = Variant::movements($id, 25);
$suggestedSku = $product['sku'];

require __DIR__ . '/partials/topbar.php';
?>
<div class="d-flex flex-wrap align-items-center gap-2 mb-3">
  <span class="text-secondary">SKU <strong><?= e($product['sku']) ?></strong> &middot; added <?= e(format_date($product['created_at'])) ?></span>
  <div class="ms-auto d-flex gap-2">
    <a class="btn btn-sm btn-outline-dark" href="<?= e(product_url($product)) ?>" target="_blank" rel="noopener">View on website</a>
    <a class="btn btn-sm btn-outline-gold" href="<?= e(url('admin/add-product.php')) ?>">+ Add another</a>
  </div>
</div>
<?php require __DIR__ . '/partials/product-form.php'; clear_old(); ?>

<div class="card mt-4">
  <div class="card-header">Stock history (latest 25)</div>
  <div class="table-responsive">
    <table class="table table-sm mb-0">
      <thead><tr><th>When</th><th>Variant</th><th class="text-end">Change</th><th>Reason</th><th>Order</th><th>By</th><th>Note</th></tr></thead>
      <tbody>
      <?php if (!$movements): ?><tr><td colspan="7" class="text-center text-secondary py-3">No stock movements yet.</td></tr><?php endif; ?>
      <?php foreach ($movements as $m): ?>
        <tr>
          <td class="text-nowrap"><?= e(format_date($m['created_at'])) ?></td>
          <td><?= e(Variant::label($m)) ?></td>
          <td class="text-end <?= $m['change_qty'] < 0 ? 'text-danger' : 'text-success' ?>"><?= $m['change_qty'] > 0 ? '+' : '' ?><?= (int) $m['change_qty'] ?></td>
          <td><?= e(str_replace('_', ' ', $m['reason'])) ?></td>
          <td><?php if ($m['order_number']): ?><a href="<?= e(url('admin/order-view.php?id=' . (int) $m['order_id'])) ?>"><?= e($m['order_number']) ?></a><?php endif; ?></td>
          <td><?= e($m['admin_name'] ?? ($m['reason'] === 'sale' ? 'Customer' : '')) ?></td>
          <td class="small text-secondary"><?= e($m['note']) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
