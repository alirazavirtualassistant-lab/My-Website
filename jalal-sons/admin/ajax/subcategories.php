<?php
/**
 * JSON: subcategories for a category id (dependent dropdown).
 * GET ?category_id=1  ->  {"ok":true,"items":[{"id":1,"name":"Party Wear"},...]}
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/auth_guard.php';

$categoryId = get_int('category_id');
if ($categoryId <= 0) {
    json_response(['ok' => false, 'message' => 'category_id is required.'], 422);
}
$items = array_map(
    fn(array $s) => ['id' => (int) $s['id'], 'name' => $s['name'], 'is_active' => (int) $s['is_active']],
    Category::subcategories($categoryId, false)
);
json_response(['ok' => true, 'items' => $items]);
