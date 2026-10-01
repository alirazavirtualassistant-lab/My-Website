<?php
/**
 * Product form shared by add-product.php and edit-product.php.
 * Expects: $product (array|null), $variants (array), $images (array),
 *          $categories, $subcategories, $errors (array), $suggestedSku.
 */
declare(strict_types=1);

$val = static fn(string $key, mixed $default = '') => old($key, $product[$key] ?? $default);
$err = static fn(string $key) => isset($errors[$key]) ? '<div class="invalid-feedback d-block">' . e($errors[$key]) . '</div>' : '';
$cls = static fn(string $key) => isset($errors[$key]) ? ' is-invalid' : '';
$oldVariants = $_SESSION['_old']['variants'] ?? null;
$variantRows = is_array($oldVariants) ? array_values($oldVariants) : $variants;
if (!$variantRows) {
    $variantRows = [['size' => 'Unstitched', 'color' => 'Standard', 'color_hex' => '', 'stock_quantity' => '', 'sku' => '']];
}
$maxFiles = (int) config('uploads.max_files', 8);
$maxMb = (int) round((int) config('uploads.max_size', 5242880) / 1048576);
?>
<?php if ($errors): ?>
  <div class="alert alert-danger"><strong>Please fix the following:</strong><ul class="mb-0 mt-1"><?php foreach ($errors as $m): ?><li><?= e($m) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" id="productForm" novalidate
      data-subcategory-url="<?= e(url('admin/ajax/subcategories.php')) ?>"
      data-selected-subcategory="<?= (int) $val('subcategory_id', 0) ?>">
  <?= Csrf::field() ?>
  <input type="hidden" name="MAX_FILE_SIZE" value="<?= (int) config('uploads.max_size') ?>">

  <div class="row g-4">
    <div class="col-lg-8">
      <!-- Details -->
      <div class="card mb-4">
        <div class="card-header">Product details</div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-8">
              <label class="form-label required" for="name">Product name</label>
              <input class="form-control<?= $cls('name') ?>" id="name" name="name" maxlength="150" value="<?= e($val('name')) ?>" required>
              <?= $err('name') ?>
            </div>
            <div class="col-md-4">
              <label class="form-label required" for="sku">SKU</label>
              <input class="form-control<?= $cls('sku') ?>" id="sku" name="sku" maxlength="40" value="<?= e($val('sku', $suggestedSku ?? '')) ?>" data-suggested="<?= e($suggestedSku ?? '') ?>" required>
              <div class="form-text">Suggested automatically; you can change it.</div>
              <?= $err('sku') ?>
            </div>

            <div class="col-md-6">
              <label class="form-label required" for="category_id">Main category (gender)</label>
              <select class="form-select<?= $cls('category_id') ?>" id="category_id" name="category_id" required>
                <option value="">Choose...</option>
                <?php foreach ($categories as $c): ?>
                  <option value="<?= (int) $c['id'] ?>" <?= (int) $val('category_id') === (int) $c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?><?= $c['is_active'] ? '' : ' (hidden)' ?></option>
                <?php endforeach; ?>
              </select>
              <?= $err('category_id') ?>
            </div>
            <div class="col-md-6">
              <label class="form-label required" for="subcategory_id">Cloth type</label>
              <!-- All options are rendered (grouped) so the form works without JavaScript; JS narrows the list via AJAX. -->
              <select class="form-select<?= $cls('subcategory_id') ?>" id="subcategory_id" name="subcategory_id" required>
                <option value="">Choose...</option>
                <?php $grouped = []; foreach ($subcategories as $s) { $grouped[$s['category_name']][] = $s; } ?>
                <?php foreach ($grouped as $groupName => $list): ?>
                  <optgroup label="<?= e($groupName) ?>">
                    <?php foreach ($list as $s): ?>
                      <option value="<?= (int) $s['id'] ?>" data-category="<?= (int) $s['category_id'] ?>" <?= (int) $val('subcategory_id') === (int) $s['id'] ? 'selected' : '' ?>><?= e($s['name']) ?><?= $s['is_active'] ? '' : ' (hidden)' ?></option>
                    <?php endforeach; ?>
                  </optgroup>
                <?php endforeach; ?>
              </select>
              <?= $err('subcategory_id') ?>
            </div>

            <div class="col-md-4">
              <label class="form-label" for="brand">Brand</label>
              <input class="form-control" id="brand" name="brand" list="brandList" maxlength="80" value="<?= e($val('brand')) ?>" placeholder="e.g. Gul Ahmed">
              <datalist id="brandList"><?php foreach ($brands ?? [] as $b): ?><option value="<?= e($b) ?>"><?php endforeach; ?></datalist>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="fabric">Fabric</label>
              <input class="form-control" id="fabric" name="fabric" list="fabricList" maxlength="60" value="<?= e($val('fabric')) ?>" placeholder="Lawn, Chiffon...">
              <datalist id="fabricList"><?php foreach (Product::FABRICS as $f): ?><option value="<?= e($f) ?>"><?php endforeach; ?></datalist>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="pieces">Pieces</label>
              <select class="form-select" id="pieces" name="pieces">
                <option value="">Not applicable</option>
                <?php foreach (Product::PIECES as $p): ?><option value="<?= $p ?>" <?= $val('pieces') === $p ? 'selected' : '' ?>><?= $p ?></option><?php endforeach; ?>
              </select>
            </div>

            <div class="col-md-8">
              <label class="form-label" for="inclusions">Inclusions</label>
              <input class="form-control" id="inclusions" name="inclusions" maxlength="255" value="<?= e($val('inclusions')) ?>" placeholder="Shirt 3 m, Dupatta 2.5 m, Trouser 2.5 m">
            </div>
            <div class="col-md-4">
              <label class="form-label" for="season">Season</label>
              <select class="form-select" id="season" name="season">
                <option value="">Any</option>
                <?php foreach (Product::SEASONS as $s): ?><option value="<?= $s ?>" <?= $val('season') === $s ? 'selected' : '' ?>><?= $s ?></option><?php endforeach; ?>
              </select>
            </div>

            <div class="col-12">
              <label class="form-label" for="description">Description</label>
              <textarea class="form-control" id="description" name="description" rows="5" placeholder="Fabric feel, embroidery, occasion, care..."><?= e($val('description')) ?></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Variants & stock -->
      <div class="card mb-4">
        <div class="card-header d-flex align-items-center">Variants &amp; stock
          <span class="ms-auto small fw-normal text-secondary">Stitched items: size + color. Unstitched/fabric: size "Unstitched", one row per color.</span>
        </div>
        <div class="card-body">
          <?= $err('variants') ?>
          <div class="table-responsive">
            <table class="table table-sm align-middle variant-table" id="variantTable">
              <thead><tr><th>Size</th><th>Color</th><th>Swatch</th><th style="width:120px">Stock qty</th><th>Variant SKU</th><th></th></tr></thead>
              <tbody>
              <?php foreach ($variantRows as $i => $row): ?>
                <tr>
                  <td>
                    <input type="hidden" name="variants[<?= $i ?>][id]" value="<?= (int) ($row['id'] ?? 0) ?>">
                    <input class="form-control form-control-sm" name="variants[<?= $i ?>][size]" list="sizeList" value="<?= e($row['size'] ?? '') ?>" placeholder="M / Unstitched">
                  </td>
                  <td><input class="form-control form-control-sm" name="variants[<?= $i ?>][color]" value="<?= e($row['color'] ?? '') ?>" placeholder="Maroon"></td>
                  <td><input class="form-control form-control-sm form-control-color color-dot" type="color" name="variants[<?= $i ?>][color_hex]" value="<?= e(preg_match('/^#[0-9a-fA-F]{6}$/', (string) ($row['color_hex'] ?? '')) ? $row['color_hex'] : '#D4AF37') ?>" title="Swatch colour"></td>
                  <td><input class="form-control form-control-sm" type="number" min="0" step="1" name="variants[<?= $i ?>][stock_quantity]" value="<?= e((string) ($row['stock_quantity'] ?? '')) ?>" placeholder="0"></td>
                  <td><input class="form-control form-control-sm" name="variants[<?= $i ?>][sku]" value="<?= e($row['sku'] ?? '') ?>" placeholder="auto"></td>
                  <td class="text-end"><button class="btn btn-sm btn-outline-danger js-remove-row" type="button" aria-label="Remove row">&times;</button></td>
                </tr>
              <?php endforeach; ?>
              </tbody>
            </table>
          </div>
          <datalist id="sizeList"><?php foreach (Product::SIZES as $s): ?><option value="<?= e($s) ?>"><?php endforeach; ?></datalist>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-outline-gold" type="button" id="addVariantRow">+ Add row</button>
            <button class="btn btn-sm btn-outline-dark" type="button" id="addSizeRun">+ Add XS to XXL</button>
          </div>
          <?php if (!empty($product)): ?>
            <p class="form-text mt-2 mb-0">Changing a quantity here is logged as a manual adjustment. For quick +/- changes use the Stock button on the product list.</p>
          <?php endif; ?>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <!-- Pricing -->
      <div class="card mb-4">
        <div class="card-header">Pricing</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label required" for="base_price">Regular price (Rs.)</label>
            <input class="form-control<?= $cls('base_price') ?>" id="base_price" name="base_price" type="number" min="1" step="1" inputmode="numeric" value="<?= e($val('base_price')) ?>" required>
            <?= $err('base_price') ?>
          </div>
          <div class="mb-3">
            <label class="form-label" for="sale_price">Sale price (Rs.)</label>
            <input class="form-control<?= $cls('sale_price') ?>" id="sale_price" name="sale_price" type="number" min="0" step="1" inputmode="numeric" value="<?= e($val('sale_price')) ?>" placeholder="Leave empty when not on sale">
            <div class="form-text">Must be lower than the regular price.</div>
            <?= $err('sale_price') ?>
          </div>
          <div>
            <label class="form-label" for="sale_unit">Sold per</label>
            <select class="form-select" id="sale_unit" name="sale_unit">
              <?php foreach (Product::UNITS as $k => $lbl): ?><option value="<?= $k ?>" <?= $val('sale_unit', 'piece') === $k ? 'selected' : '' ?>><?= $lbl ?></option><?php endforeach; ?>
            </select>
          </div>
        </div>
      </div>

      <!-- Visibility -->
      <div class="card mb-4">
        <div class="card-header">Visibility</div>
        <div class="card-body">
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" id="is_active" name="is_active" <?= old('is_active', $product['is_active'] ?? 1) ? 'checked' : '' ?>>
            <label class="form-check-label" for="is_active">Active (shown on the website)</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="is_featured" name="is_featured" <?= old('is_featured', $product['is_featured'] ?? 0) ? 'checked' : '' ?>>
            <label class="form-check-label" for="is_featured">Featured on the homepage</label>
          </div>
        </div>
      </div>

      <!-- Images -->
      <div class="card mb-4">
        <div class="card-header">Images</div>
        <div class="card-body">
          <?php if (!empty($images)): ?>
            <p class="small text-secondary mb-2">Drag to reorder. Pick the primary image. Tick to delete.</p>
            <div class="row g-2 mb-3" id="existingImages">
              <?php foreach ($images as $img): ?>
                <div class="col-6" draggable="true" data-image-id="<?= (int) $img['id'] ?>">
                  <div class="image-card <?= $img['is_primary'] ? 'primary' : '' ?>">
                    <img src="<?= e(image_url($img['thumb_path'] ?: $img['image_path'])) ?>" alt="<?= e($img['alt_text']) ?>" loading="lazy" width="300" height="400">
                    <input type="hidden" name="image_order[]" value="<?= (int) $img['id'] ?>">
                    <div class="form-check mt-1 mb-0"><input class="form-check-input" type="radio" name="primary_image" value="<?= (int) $img['id'] ?>" id="pi<?= (int) $img['id'] ?>" <?= $img['is_primary'] ? 'checked' : '' ?>><label class="form-check-label small" for="pi<?= (int) $img['id'] ?>">Primary</label></div>
                    <div class="form-check mb-1"><input class="form-check-input" type="checkbox" name="delete_images[]" value="<?= (int) $img['id'] ?>" id="di<?= (int) $img['id'] ?>"><label class="form-check-label small text-danger" for="di<?= (int) $img['id'] ?>">Delete</label></div>
                    <input class="form-control form-control-sm" name="image_alt[<?= (int) $img['id'] ?>]" value="<?= e($img['alt_text']) ?>" placeholder="Alt text" maxlength="150">
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
          <label class="dropzone" id="dropzone" for="images">
            <input type="file" id="images" name="images[]" accept="image/jpeg,image/png,image/webp" multiple>
            <div><strong>Drop images here</strong> or tap to choose</div>
            <div class="small text-secondary mt-1">JPEG, PNG or WebP. Up to <?= $maxFiles ?> images, <?= $maxMb ?> MB each. Portrait 3:4 looks best.</div>
          </label>
          <div class="preview-grid" id="previewGrid" data-max-files="<?= $maxFiles ?>" data-max-size="<?= (int) config('uploads.max_size') ?>"></div>
          <?php if (empty($images)): ?><div class="form-text mt-2">The first image becomes the primary image.</div><?php endif; ?>
        </div>
      </div>

      <div class="d-grid gap-2">
        <button class="btn btn-gold" type="submit"><?= empty($product) ? 'Save product' : 'Save changes' ?></button>
        <a class="btn btn-outline-dark" href="<?= e(url('admin/products.php')) ?>">Cancel</a>
      </div>
    </div>
  </div>
</form>
