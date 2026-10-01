<?php
/** XML sitemap generated from the database (static pages, categories, live products). */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';
header('Content-Type: application/xml; charset=utf-8');

$urls = [
    [url(''), date('c'), 'daily', '1.0'],
    [url('shop.php'), date('c'), 'daily', '0.9'],
    [url('about.php'), null, 'monthly', '0.5'],
    [url('contact.php'), null, 'monthly', '0.5'],
    [url('policies.php'), null, 'yearly', '0.3'],
];
foreach (Category::navTree() as $cat) {
    $urls[] = [shop_url(['category' => $cat['slug']]), null, 'weekly', '0.8'];
    foreach ($cat['subcategories'] as $sub) {
        $urls[] = [shop_url(['category' => $cat['slug'], 'subcategory' => $sub['slug']]), null, 'weekly', '0.8'];
    }
}
$products = Database::fetchAll(
    'SELECT p.slug, p.updated_at FROM products p JOIN categories c ON c.id = p.category_id JOIN subcategories s ON s.id = p.subcategory_id
     WHERE p.is_active = 1 AND p.deleted_at IS NULL AND c.is_active = 1 AND s.is_active = 1 ORDER BY p.updated_at DESC'
);
foreach ($products as $p) {
    $urls[] = [product_url($p), date('c', strtotime((string) $p['updated_at'])), 'weekly', '0.7'];
}
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as [$loc, $mod, $freq, $prio]) {
    echo "  <url><loc>" . e($loc) . "</loc>" . ($mod ? "<lastmod>" . e($mod) . "</lastmod>" : '') . "<changefreq>$freq</changefreq><priority>$prio</priority></url>\n";
}
echo "</urlset>\n";
