<?php
/**
 * Product listing with filters (gender, cloth type, price, availability,
 * brand, fabric, size, color, on sale), sorting and pagination. Every view
 * is a shareable URL (GET parameters). Sold-out items stay visible, last.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$filters = [
    'q'            => mb_substr(get('q'), 0, 100),
    'category'     => mb_substr(get('category'), 0, 90),
    'subcategory'  => mb_substr(get('subcategory'), 0, 90),
    'brand'        => mb_substr(get('brand'), 0, 80),
    'fabric'       => mb_substr(get('fabric'), 0, 60),
    'size'         => mb_substr(get('size'), 0, 30),
    'color'        => mb_substr(get('color'), 0, 40),
    'min_price'    => is_numeric(get('min_price')) ? get('min_price') : '',
    'max_price'    => is_numeric(get('max_price')) ? get('max_price') : '',
    'availability' => in_array(get('availability'), ['in', 'out'], true) ? get('availability') : '',
    'on_sale'      => get('on_sale') !== '' ? 1 : '',
    'sort'         => in_array(get('sort'), ['newest', 'price_asc', 'price_desc', 'name'], true) ? get('sort') : 'newest',
];

$category = $filters['category'] !== '' ? Category::findBySlug($filters['category']) : null;
if ($filters['category'] !== '' && !$category) {
    render_404();
}
$subcategory = ($category && $filters['subcategory'] !== '') ? Category::findSubcategoryBySlug((int) $category['id'], $filters['subcategory']) : null;
if ($category && $filters['subcategory'] !== '' && !$subcategory) {
    render_404();
}
if (!$category) {
    $filters['subcategory'] = '';
}

$result = Product::search($filters, get_int('page', 1), 12);
$products = $result['items'];
$pg = $result['pagination'];
$options = Product::filterOptions();
$navTree = Category::navTree();

// Page heading & meta
if ($subcategory) {
    $heading = $subcategory['name'];
    $eyebrow = $category['name'];
} elseif ($category) {
    $heading = $category['name'];
    $eyebrow = 'Collection';
} elseif ($filters['on_sale']) {
    $heading = 'Sale';
    $eyebrow = 'Reduced prices';
} elseif ($filters['q'] !== '') {
    $heading = 'Search results';
    $eyebrow = 'for "' . $filters['q'] . '"';
} else {
    $heading = 'All products';
    $eyebrow = setting('tagline', '');
}
$pageTitle = $heading;
$metaDescription = ($subcategory ? $subcategory['name'] . ' for women at ' : 'Shop women\'s clothing at ') . setting('store_name', '') . ', Lahore. Cash on delivery across Pakistan.';
$canonical = shop_url(array_filter(['category' => $filters['category'], 'subcategory' => $filters['subcategory']]));

// Active filter chips (label => url without that filter)
$chips = [];
foreach (['brand' => 'Brand', 'fabric' => 'Fabric', 'size' => 'Size', 'color' => 'Color', 'availability' => 'Availability', 'q' => 'Search'] as $k => $label) {
    if ($filters[$k] !== '') {
        $chips[] = ['label' => $label . ': ' . ($k === 'availability' ? ($filters[$k] === 'in' ? 'In stock' : 'Sold out') : $filters[$k]), 'url' => current_url_with([], [$k, 'page'])];
    }
}
if ($filters['min_price'] !== '' || $filters['max_price'] !== '') {
    $chips[] = ['label' => 'Price: ' . ($filters['min_price'] !== '' ? money($filters['min_price']) : 'Any') . ' - ' . ($filters['max_price'] !== '' ? money($filters['max_price']) : 'Any'), 'url' => current_url_with([], ['min_price', 'max_price', 'page'])];
}
if ($filters['on_sale']) {
    $chips[] = ['label' => 'On sale', 'url' => current_url_with([], ['on_sale', 'page'])];
}
require __DIR__ . '/includes/header.php';
?>
<div class="container py-4">
  <nav aria-label="Breadcrumb"><ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="<?= e(url('')) ?>">Home</a></li>
    <li class="breadcrumb-item <?= !$category ? 'active' : '' ?>"><?php if ($category): ?><a href="<?= e(url('shop.php')) ?>">Shop</a><?php else: ?>Shop<?php endif; ?></li>
    <?php if ($category): ?><li class="breadcrumb-item <?= !$subcategory ? 'active' : '' ?>"><?php if ($subcategory): ?><a href="<?= e(shop_url(['category' => $category['slug']])) ?>"><?= e($category['name']) ?></a><?php else: ?><?= e($category['name']) ?><?php endif; ?></li><?php endif; ?>
    <?php if ($subcategory): ?><li class="breadcrumb-item active"><?= e($subcategory['name']) ?></li><?php endif; ?>
  </ol></nav>

  <div class="section-head text-start text-md-center mb-3"><span class="eyebrow"><?= e($eyebrow) ?></span><h1><?= e($heading) ?></h1></div>
  <?= divider() ?>

  <div class="shop-layout">
    <!-- Filters: a drawer on mobile, a sidebar on desktop -->
    <aside>
      <button class="btn btn-outline-gold w-100 d-lg-none mb-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#filterDrawer" aria-controls="filterDrawer">Filter &amp; sort<?= $chips ? ' (' . count($chips) . ')' : '' ?></button>
      <div class="offcanvas-lg offcanvas-start" tabindex="-1" id="filterDrawer" aria-labelledby="filterDrawerLabel">
        <div class="offcanvas-header d-lg-none"><h2 class="offcanvas-title h6 mb-0" id="filterDrawerLabel">Filters</h2><button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#filterDrawer" aria-label="Close"></button></div>
        <div class="offcanvas-body d-block p-3 p-lg-0">
          <form class="filter-panel" method="get" action="<?= e(url('shop.php')) ?>" id="filterForm">
            <?php if ($filters['q'] !== ''): ?><input type="hidden" name="q" value="<?= e($filters['q']) ?>"><?php endif; ?>
            <input type="hidden" name="sort" value="<?= e($filters['sort']) ?>">

            <div class="filter-group">
              <h3>Collection</h3>
              <select class="form-select form-select-sm" name="category" aria-label="Gender" data-autosubmit>
                <option value="">All</option>
                <?php foreach ($navTree as $c): ?><option value="<?= e($c['slug']) ?>" <?= $filters['category'] === $c['slug'] ? 'selected' : '' ?>><?= e($c['name']) ?></option><?php endforeach; ?>
              </select>
              <select class="form-select form-select-sm mt-2" name="subcategory" aria-label="Cloth type" data-autosubmit>
                <option value="">All cloth types</option>
                <?php foreach ($navTree as $c): foreach ($c['subcategories'] as $s): ?>
                  <?php if ($category && (int) $c['id'] !== (int) $category['id']) continue; ?>
                  <option value="<?= e($s['slug']) ?>" <?= $subcategory && $subcategory['id'] == $s['id'] ? 'selected' : '' ?>><?= e($s['name']) ?><?= count($navTree) > 1 ? ' (' . e($c['name']) . ')' : '' ?></option>
                <?php endforeach; endforeach; ?>
              </select>
            </div>

            <div class="filter-group">
              <h3>Price (Rs.)</h3>
              <div class="d-flex gap-2 align-items-center">
                <input class="form-control form-control-sm" type="number" name="min_price" min="0" step="50" placeholder="Min <?= (int) $options['min_price'] ?>" value="<?= e($filters['min_price']) ?>" aria-label="Minimum price">
                <span class="text-muted-js">-</span>
                <input class="form-control form-control-sm" type="number" name="max_price" min="0" step="50" placeholder="Max <?= (int) $options['max_price'] ?>" value="<?= e($filters['max_price']) ?>" aria-label="Maximum price">
              </div>
            </div>

            <div class="filter-group">
              <h3>Availability</h3>
              <label class="filter-check"><input class="form-check-input" type="radio" name="availability" value="" <?= $filters['availability'] === '' ? 'checked' : '' ?> data-autosubmit> All</label>
              <label class="filter-check"><input class="form-check-input" type="radio" name="availability" value="in" <?= $filters['availability'] === 'in' ? 'checked' : '' ?> data-autosubmit> In stock</label>
              <label class="filter-check"><input class="form-check-input" type="checkbox" name="on_sale" value="1" <?= $filters['on_sale'] ? 'checked' : '' ?> data-autosubmit> On sale</label>
            </div>

            <?php if ($options['brands']): ?>
            <div class="filter-group">
              <h3>Brand</h3>
              <select class="form-select form-select-sm" name="brand" aria-label="Brand" data-autosubmit><option value="">All brands</option>
                <?php foreach ($options['brands'] as $b): ?><option value="<?= e($b) ?>" <?= $filters['brand'] === $b ? 'selected' : '' ?>><?= e($b) ?></option><?php endforeach; ?></select>
            </div>
            <?php endif; ?>
            <?php if ($options['fabrics']): ?>
            <div class="filter-group">
              <h3>Fabric</h3>
              <select class="form-select form-select-sm" name="fabric" aria-label="Fabric" data-autosubmit><option value="">All fabrics</option>
                <?php foreach ($options['fabrics'] as $f): ?><option value="<?= e($f) ?>" <?= $filters['fabric'] === $f ? 'selected' : '' ?>><?= e($f) ?></option><?php endforeach; ?></select>
            </div>
            <?php endif; ?>
            <?php if ($options['sizes']): ?>
            <div class="filter-group">
              <h3>Size</h3>
              <div class="chips">
                <?php foreach ($options['sizes'] as $s): ?>
                  <label class="swatch btn-sm" style="min-height:38px"><input class="visually-hidden" type="radio" name="size" value="<?= e($s) ?>" <?= $filters['size'] === $s ? 'checked' : '' ?> data-autosubmit><?= e($s) ?></label>
                <?php endforeach; ?>
              </div>
            </div>
            <?php endif; ?>
            <?php if ($options['colors']): ?>
            <div class="filter-group">
              <h3>Color</h3>
              <select class="form-select form-select-sm" name="color" aria-label="Color" data-autosubmit><option value="">All colors</option>
                <?php foreach ($options['colors'] as $c): ?><option value="<?= e($c) ?>" <?= $filters['color'] === $c ? 'selected' : '' ?>><?= e($c) ?></option><?php endforeach; ?></select>
            </div>
            <?php endif; ?>

            <div class="d-grid gap-2 mt-4">
              <button class="btn btn-gold btn-sm" type="submit">Apply filters</button>
              <a class="btn btn-outline-gold btn-sm" href="<?= e($category ? shop_url(array_filter(['category' => $filters['category'], 'subcategory' => $filters['subcategory']])) : url('shop.php')) ?>">Clear all</a>
            </div>
          </form>
        </div>
      </div>
    </aside>

    <div>
      <div class="shop-toolbar">
        <span class="text-muted-js small"><?= $pg['total'] ? "Showing {$pg['from']}-{$pg['to']} of {$pg['total']}" : 'No products' ?></span>
        <?php if ($chips): ?>
          <div class="chips">
            <?php foreach ($chips as $chip): ?><span class="chip"><?= e($chip['label']) ?> <a href="<?= e($chip['url']) ?>" aria-label="Remove filter <?= e($chip['label']) ?>">&times;</a></span><?php endforeach; ?>
          </div>
        <?php endif; ?>
        <form class="ms-auto d-flex align-items-center gap-2" method="get" action="<?= e(url('shop.php')) ?>">
          <?php foreach ($filters as $k => $v): if ($k !== 'sort' && $v !== ''): ?><input type="hidden" name="<?= e($k) ?>" value="<?= e((string) $v) ?>"><?php endif; endforeach; ?>
          <label class="form-label mb-0 small" for="sort">Sort</label>
          <select class="form-select form-select-sm" id="sort" name="sort" data-autosubmit>
            <option value="newest" <?= $filters['sort'] === 'newest' ? 'selected' : '' ?>>Newest</option>
            <option value="price_asc" <?= $filters['sort'] === 'price_asc' ? 'selected' : '' ?>>Price: low to high</option>
            <option value="price_desc" <?= $filters['sort'] === 'price_desc' ? 'selected' : '' ?>>Price: high to low</option>
            <option value="name" <?= $filters['sort'] === 'name' ? 'selected' : '' ?>>Name</option>
          </select>
        </form>
      </div>

      <?php if ($products): ?>
        <div class="product-grid cols-3">
          <?php foreach ($products as $p) { require __DIR__ . '/includes/product-card.php'; } ?>
        </div>
        <?= pagination_links($pg) ?>
      <?php else: ?>
        <div class="empty-state">
          <p class="h5 text-gold">Nothing matches these filters yet</p>
          <p class="mb-3">Try removing a filter, or ask us on WhatsApp. New stock arrives every week.</p>
          <a class="btn btn-outline-gold btn-sm" href="<?= e(url('shop.php')) ?>">See all products</a>
          <a class="btn btn-whatsapp btn-sm" href="<?= e(whatsapp_link('Assalam o Alaikum, I am looking for ' . ($filters['q'] ?: ($subcategory['name'] ?? 'something')) . '. Can you help?')) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> Ask on WhatsApp</a>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
