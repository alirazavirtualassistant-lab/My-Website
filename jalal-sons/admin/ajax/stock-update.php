<?php
/**
 * JSON: quick +/- stock adjustment for one variant with a reason.
 * POST variant_id, delta (signed int), reason (restock|adjustment|return), note
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/auth_guard.php';

if (!is_post()) {
    json_response(['ok' => false, 'message' => 'POST required.'], 405);
}
$variantId = post_int('variant_id');
$delta = post_int('delta');
$reason = post('reason', 'adjustment');
$note = mb_substr(post('note'), 0, 255);

if ($variantId <= 0 || $delta === 0 || abs($delta) > 10000) {
    json_response(['ok' => false, 'message' => 'Please enter a quantity to add or remove.'], 422);
}
if (!in_array($reason, ['restock', 'adjustment', 'return'], true)) {
    $reason = 'adjustment';
}
try {
    $new = Variant::adjustStock($variantId, $delta, $reason, Auth::id(), $note);
    $v = Variant::find($variantId);
    $productTotal = (int) Database::fetchColumn('SELECT COALESCE(SUM(stock_quantity),0) FROM product_variants WHERE product_id = :p', ['p' => (int) $v['product_id']]);
    json_response([
        'ok' => true,
        'message' => 'Stock updated to ' . $new . '.',
        'stock_quantity' => $new,
        'product_total' => $productTotal,
        'state' => stock_state($new),
    ]);
} catch (Throwable $e) {
    log_message('error', 'stock-update: ' . $e->getMessage());
    json_response(['ok' => false, 'message' => 'Could not update stock.'], 500);
}
