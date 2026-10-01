<?php
/**
 * Reads and sanitises the inventory report filters from $_GET.
 * Shared by inventory-report.php and export_inventory.php so the export
 * always matches the on-screen table. Sets $filters, $sort, $dir.
 */
declare(strict_types=1);

$dateOk = static fn(string $d): string => preg_match('/^\d{4}-\d{2}-\d{2}$/', $d) && strtotime($d) ? $d : '';
$filters = [
    'q'           => mb_substr(get('q'), 0, 100),
    'from'        => $dateOk(get('from')),
    'to'          => $dateOk(get('to')),
    'category'    => get_int('category') ?: '',
    'subcategory' => get_int('subcategory') ?: '',
    'brand'       => mb_substr(get('brand'), 0, 80),
    'stock'       => in_array(get('stock'), ['in', 'low', 'out'], true) ? get('stock') : '',
    'channel'     => array_key_exists(get('channel'), Order::CHANNELS) ? get('channel') : '',
];
$sort = array_key_exists(get('sort'), Report::SORTS) ? get('sort') : 'product';
$dir = get('dir') === 'desc' ? 'desc' : 'asc';
