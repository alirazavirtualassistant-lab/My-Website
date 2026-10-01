<?php
/**
 * Add product: details, dependent category dropdowns, pricing, variants
 * with opening stock, and multi-image upload. The product is live on the
 * storefront as soon as it is saved (when Active is on).
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
require_once __DIR__ . '/partials/product-validate.php';
$pageTitle = 'Add product';

$errors = [];
if (is_post()) {
    $r = validate_product_post(null);
    $errors = $r['errors'];
    if (!$errors) {
        try {
            $productId = Product::create($r['data'], $r['variants'], Auth::id());

            // Images: validated + re-encoded by ImageUploader.
            $uploader = new ImageUploader($productId);
            $saved = $uploader->handle($_FILES['images'] ?? []);
            foreach ($saved as $i => $img) {
                Database::insert('product_images', [
                    'product_id' => $productId, 'image_path' => $img['image_path'], 'thumb_path' => $img['thumb_path'],
                    'alt_text' => $r['data']['name'], 'is_primary' => $i === 0 ? 1 : 0, 'sort_order' => $i,
                ]);
            }
            foreach ($uploader->errors() as $msg) {
                flash('warning', $msg);
            }
            clear_old();
            flash('success', 'Product "' . $r['data']['name'] . '" saved' . ($r['data']['is_active'] ? ' and live on the website.' : ' (inactive).'));
            redirect(url('admin/edit-product.php?id=' . $productId));
        } catch (PDOException $e) {
            log_message('error', 'add-product: ' . $e->getMessage());
            $errors['general'] = (int) ($e->errorInfo[1] ?? 0) === 1062 ? 'A SKU or variant SKU is already in use.' : 'Could not save the product. Please try again.';
        }
    }
    remember_old($_POST);
}

$product = null;
$variants = [];
$images = [];
$categories = Category::all();
$subcategories = Category::subcategories();
$brands = Product::brands();
$suggestedSku = Product::nextSku(post_int('subcategory_id') ?: (int) ($subcategories[0]['id'] ?? 0));

require __DIR__ . '/partials/topbar.php';
require __DIR__ . '/partials/product-form.php';
clear_old();
require __DIR__ . '/partials/footer.php';
