<?php
/**
 * Shared server-side validation for add-product.php and edit-product.php.
 * Returns ['errors' => [...], 'data' => [...], 'variants' => [...]].
 */
declare(strict_types=1);

function validate_product_post(?int $productId = null): array
{
    $v = new Validator($_POST);
    $v->required('name', 'Product name')->max('name', 150)
      ->required('sku', 'SKU')->max('sku', 40)->regex('sku', '/^[A-Za-z0-9][A-Za-z0-9\-_.]*$/', 'SKU may only contain letters, numbers, dashes, dots and underscores.')
      ->required('category_id', 'Main category')->integer('category_id')
      ->required('subcategory_id', 'Cloth type')->integer('subcategory_id')
      ->required('base_price', 'Regular price')->numeric('base_price')->between('base_price', 1, 9999999)
      ->numeric('sale_price')->between('sale_price', 0, 9999999)
      ->max('brand', 80)->max('fabric', 60)->max('inclusions', 255)
      ->in('pieces', array_merge([''], Product::PIECES))
      ->in('season', array_merge([''], Product::SEASONS))
      ->in('sale_unit', array_keys(Product::UNITS))
      ->custom('sale_price', function ($sale, $all) {
          if ($sale === '' || $sale === null || !is_numeric($sale) || !is_numeric($all['base_price'] ?? null)) {
              return true;
          }
          return (float) $sale < (float) $all['base_price'];
      }, 'Sale price must be lower than the regular price.');

    $sku = strtoupper(trim(post('sku')));
    if ($sku !== '' && Product::skuExists($sku, $productId)) {
        $v->addError('sku', "SKU \"$sku\" is already used by another product.");
    }
    // The chosen cloth type must belong to the chosen main category.
    $sub = Category::findSubcategory(post_int('subcategory_id'));
    if ($sub && (int) $sub['category_id'] !== post_int('category_id')) {
        $v->addError('subcategory_id', 'The selected cloth type does not belong to the selected main category.');
    } elseif (!$sub && post_int('subcategory_id')) {
        $v->addError('subcategory_id', 'Please choose a valid cloth type.');
    }

    // Variants: at least one row with a size/color; stock must be a whole number >= 0.
    $variants = [];
    $seen = [];
    foreach ((array) ($_POST['variants'] ?? []) as $row) {
        if (!is_array($row)) {
            continue;
        }
        $size = trim((string) ($row['size'] ?? ''));
        $color = trim((string) ($row['color'] ?? ''));
        $stock = trim((string) ($row['stock_quantity'] ?? ''));
        $vsku = trim((string) ($row['sku'] ?? ''));
        if ($size === '' && $color === '' && $stock === '' && $vsku === '' && empty($row['id'])) {
            continue; // blank template row
        }
        if ($stock !== '' && (filter_var($stock, FILTER_VALIDATE_INT) === false || (int) $stock < 0)) {
            $v->addError('variants', 'Stock quantity must be a whole number of 0 or more.');
        }
        $key = strtolower(($size ?: 'Unstitched') . '|' . ($color ?: 'Standard'));
        if (isset($seen[$key])) {
            $v->addError('variants', 'Two variant rows have the same size and color.');
        }
        $seen[$key] = true;
        if ($vsku !== '' && !preg_match('/^[A-Za-z0-9][A-Za-z0-9\-_.]*$/', $vsku)) {
            $v->addError('variants', 'Variant SKUs may only contain letters, numbers, dashes, dots and underscores.');
        }
        $variants[] = [
            'id'             => (int) ($row['id'] ?? 0),
            'size'           => mb_substr($size, 0, 30),
            'color'          => mb_substr($color, 0, 40),
            'color_hex'      => trim((string) ($row['color_hex'] ?? '')),
            'stock_quantity' => $stock === '' ? 0 : (int) $stock,
            'sku'            => mb_substr(strtoupper($vsku), 0, 60),
        ];
    }
    if (!$variants) {
        $v->addError('variants', 'Add at least one variant row (size / color) with its stock quantity.');
    }
    // Variant SKU uniqueness across the shop.
    foreach ($variants as $row) {
        if ($row['sku'] === '') {
            continue;
        }
        $clash = Database::fetch('SELECT id FROM product_variants WHERE sku = :s' . ($row['id'] ? ' AND id <> :id' : ''), ['s' => $row['sku']] + ($row['id'] ? ['id' => $row['id']] : []));
        if ($clash) {
            $v->addError('variants', 'Variant SKU "' . $row['sku'] . '" is already in use.');
        }
    }

    return [
        'errors'   => $v->errors(),
        'data'     => [
            'name' => post('name'), 'sku' => $sku, 'description' => post('description'),
            'base_price' => post('base_price'), 'sale_price' => post('sale_price'),
            'category_id' => post_int('category_id'), 'subcategory_id' => post_int('subcategory_id'),
            'brand' => post('brand'), 'fabric' => post('fabric'), 'pieces' => post('pieces'),
            'inclusions' => post('inclusions'), 'season' => post('season'), 'sale_unit' => post('sale_unit', 'piece'),
            'is_featured' => isset($_POST['is_featured']), 'is_active' => isset($_POST['is_active']),
        ],
        'variants' => $variants,
    ];
}
