<?php
/**
 * JSON: product/variant search by name or SKU for the shop-sale screen.
 * GET ?q=lawn  ->  {"ok":true,"items":[{variant_id, product_name, label, sku, price, stock}]}
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/auth_guard.php';

$q = mb_substr(get('q'), 0, 60);
if (mb_strlen($q) < 2) {
    json_response(['ok' => true, 'items' => []]);
}
$rows = Database::fetchAll(
    'SELECT v.id AS variant_id, v.size, v.color, v.sku, v.stock_quantity, p.name AS product_name, p.base_price, p.sale_price, p.sale_unit,
            (SELECT thumb_path FROM product_images i WHERE i.product_id = p.id ORDER BY is_primary DESC, sort_order LIMIT 1) AS thumb_path
     FROM product_variants v JOIN products p ON p.id = v.product_id
     WHERE p.deleted_at IS NULL AND (p.name LIKE :q1 OR p.sku LIKE :q2 OR v.sku LIKE :q3 OR p.brand LIKE :q4)
     ORDER BY p.name, v.id LIMIT 25',
    ['q1' => '%' . $q . '%', 'q2' => '%' . $q . '%', 'q3' => '%' . $q . '%', 'q4' => '%' . $q . '%']
);
$items = array_map(fn(array $r) => [
    'variant_id'   => (int) $r['variant_id'],
    'product_name' => $r['product_name'],
    'label'        => Variant::label($r),
    'sku'          => $r['sku'],
    'price'        => effective_price($r),
    'price_label'  => money(effective_price($r)) . unit_suffix($r),
    'stock'        => (int) $r['stock_quantity'],
    'thumb'        => image_url($r['thumb_path']),
], $rows);
json_response(['ok' => true, 'items' => $items]);
