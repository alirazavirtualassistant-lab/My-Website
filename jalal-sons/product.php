<?php
/**
 * Product detail: gallery, price, specs, size/colour selectors (unavailable
 * combinations disabled), live stock indicator (always from the database),
 * quantity, Add to Cart, Order on WhatsApp, size guide, related products.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$slug = get('slug');
$product = $slug !== '' ? Product::findBySlug($slug) : null;
if (!$product) {
    render_404();
}
$images = Product::images((int) $product['id']);
$variants = Product::variants((int) $product['id']);
$related = Product::related($product, 4);

$price = effective_price($product);
$onSale = is_on_sale($product);
$totalStock = (int) $product['total_stock'];
$lowThreshold = (int) setting('low_stock_threshold', 3);
$isStitched = (bool) array_filter($variants, fn($v) => $v['size'] !== 'Unstitched');
$sizes = array_values(array_unique(array_column($variants, 'size')));
$colors = array_values(array_unique(array_column($variants, 'color')));
$colorHex = [];
foreach ($variants as $v) {
    if ($v['color_hex']) {
        $colorHex[$v['color']] = $v['color_hex'];
    }
}
$variantJson = array_map(fn($v) => ['id' => (int) $v['id'], 'size' => $v['size'], 'color' => $v['color'], 'stock' => (int) $v['stock_quantity'], 'sku' => $v['sku']], $variants);
$productUrl = product_url($product);
$waBase = "Assalam o Alaikum, I want to order:\n{$product['name']}\nSKU: {$product['sku']}\nPrice: " . money($price) . unit_suffix($product);

$pageTitle = $product['name'];
$metaDescription = excerpt($product['description'] ?: $product['name'] . ' from ' . setting('store_name', ''), 155);
$metaImage = image_url($images[0]['image_path'] ?? null);
$ogType = 'product';
$ogExtra = ['product:price:amount' => number_format($price, 2, '.', ''), 'product:price:currency' => 'PKR'];
$canonical = $productUrl;
$jsonLd = [
    '@context' => 'https://schema.org', '@type' => 'Product',
    'name' => $product['name'], 'sku' => $product['sku'], 'description' => $metaDescription, 'url' => $productUrl,
    'image' => array_map(fn($i) => image_url($i['image_path']), $images ?: [['image_path' => null]]),
    'brand' => $product['brand'] ? ['@type' => 'Brand', 'name' => $product['brand']] : null,
    'offers' => ['@type' => 'Offer', 'priceCurrency' => 'PKR', 'price' => number_format($price, 2, '.', ''), 'url' => $productUrl,
        'availability' => $totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', 'itemCondition' => 'https://schema.org/NewCondition'],
];
$jsonLd = array_filter($jsonLd, fn($v) => $v !== null);
$bodyClass = 'has-mobile-cta';
require __DIR__ . '/includes/header.php';
?>
<div class="container py-4">
  <nav aria-label="Breadcrumb"><ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="<?= e(url('')) ?>">Home</a></li>
    <li class="breadcrumb-item"><a href="<?= e(shop_url(['category' => $product['category_slug']])) ?>"><?= e($product['category_name']) ?></a></li>
    <li class="breadcrumb-item"><a href="<?= e(shop_url(['category' => $product['category_slug'], 'subcategory' => $product['subcategory_slug']])) ?>"><?= e($product['subcategory_name']) ?></a></li>
    <li class="breadcrumb-item active" aria-current="page"><?= e($product['name']) ?></li>
  </ol></nav>

  <div class="row g-4 g-lg-5">
    <div class="col-lg-6">
      <div class="gallery" id="gallery">
        <div class="main" id="galleryMain">
          <img id="galleryImage" src="<?= e(image_url($images[0]['image_path'] ?? null)) ?>" alt="<?= e($images[0]['alt_text'] ?? $product['name']) ?>" width="900" height="1200" fetchpriority="high">
          <?php if ($totalStock <= 0): ?><span class="badge-js soldout position-absolute top-0 start-0 m-2">Sold Out</span>
          <?php elseif ($onSale): ?><span class="badge-js sale position-absolute top-0 start-0 m-2">Sale -<?= discount_percent($product) ?>%</span><?php endif; ?>
        </div>
        <?php if (count($images) > 1): ?>
          <div class="thumbs" role="tablist" aria-label="Product images">
            <?php foreach ($images as $i => $img): ?>
              <button type="button" class="<?= $i === 0 ? 'active' : '' ?>" data-full="<?= e(image_url($img['image_path'])) ?>" data-alt="<?= e($img['alt_text'] ?: $product['name']) ?>" aria-label="Image <?= $i + 1 ?>">
                <img src="<?= e(image_url($img['thumb_path'] ?: $img['image_path'])) ?>" alt="" width="64" height="85" loading="lazy">
              </button>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>

    <div class="col-lg-6">
      <?php if ($product['brand']): ?><span class="brand-label text-muted-js small text-uppercase" style="letter-spacing:.16em"><?= e($product['brand']) ?></span><?php endif; ?>
      <h1 class="product-title mt-1"><?= e($product['name']) ?></h1>
      <p class="text-muted-js small mb-3">SKU <?= e($product['sku']) ?> &middot; <?= e($product['subcategory_name']) ?></p>

      <div class="price-wrap mb-3" style="font-size:1.25rem">
        <span class="price" style="font-size:1.6rem"><?= e(money($price)) ?><?php if ($product['sale_unit'] === 'meter'): ?> <span class="unit">/ meter</span><?php elseif ($product['sale_unit'] === 'suit'): ?> <span class="unit">/ suit</span><?php endif; ?></span>
        <?php if ($onSale): ?><span class="price-old"><?= e(money($product['base_price'])) ?></span><span class="badge-js sale ms-2"><?= discount_percent($product) ?>% off</span><?php endif; ?>
      </div>

      <form method="post" action="<?= e(url('cart.php')) ?>" id="buyForm" class="mb-4 buy-box" data-low="<?= $lowThreshold ?>" data-wa-base="<?= e($waBase) ?>" data-wa-number="<?= e(phone_to_intl((string) setting('whatsapp_number', ''))) ?>" data-url="<?= e($productUrl) ?>">
        <?= Csrf::field() ?>
        <input type="hidden" name="action" value="add">
        <script type="application/json" id="variantData"><?= json_encode($variantJson, JSON_UNESCAPED_UNICODE) ?></script>

        <?php if ($isStitched): ?>
          <div class="option-group" data-option="size">
            <span class="label" id="sizeLabel">Size <strong data-selected></strong></span>
            <div class="swatches" role="group" aria-labelledby="sizeLabel">
              <?php foreach ($sizes as $s): ?><button type="button" class="swatch" data-value="<?= e($s) ?>" aria-pressed="false"><?= e($s) ?></button><?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>
        <?php if (count($colors) > 1 || $colors[0] !== 'Standard'): ?>
          <div class="option-group" data-option="color">
            <span class="label" id="colorLabel">Color <strong data-selected></strong></span>
            <div class="swatches" role="group" aria-labelledby="colorLabel">
              <?php foreach ($colors as $c): ?>
                <button type="button" class="swatch" data-value="<?= e($c) ?>" aria-pressed="false"><?php if (!empty($colorHex[$c])): ?><span class="dot" style="background:<?= e($colorHex[$c]) ?>"></span><?php endif; ?><?= e($c) ?></button>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>

        <!-- No-JS fallback: plain select of variants (hidden when JS runs) -->
        <div class="option-group" id="variantSelectWrap">
          <label class="label" for="variantSelect">Choose option</label>
          <select class="form-select" id="variantSelect" name="variant_id" <?= count($variants) === 1 ? '' : 'required' ?>>
            <?php foreach ($variants as $v): ?>
              <option value="<?= (int) $v['id'] ?>" <?= (int) $v['stock_quantity'] <= 0 ? 'disabled' : '' ?> <?= count($variants) === 1 ? 'selected' : '' ?>><?= e(Variant::label($v)) ?> - <?= e(stock_state((int) $v['stock_quantity'])['label']) ?></option>
            <?php endforeach; ?>
          </select>
        </div>

        <p class="mb-3"><span class="stock-indicator <?= stock_state($totalStock)['key'] ?>" id="stockIndicator" aria-live="polite"><?= e(count($variants) === 1 ? stock_state($totalStock)['label'] : ($totalStock > 0 ? 'Select an option to see availability' : 'Out of Stock')) ?></span></p>

        <div class="buy-row">
          <div class="qty-input" aria-label="Quantity">
            <button type="button" data-qty="-1" aria-label="Decrease quantity">&minus;</button>
            <input class="form-control" type="number" name="qty" id="qty" value="1" min="1" max="<?= max(1, $totalStock) ?>" inputmode="numeric" aria-label="Quantity<?= $product['sale_unit'] === 'meter' ? ' in meters' : '' ?>">
            <button type="button" data-qty="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-gold" type="submit" id="addToCart" <?= $totalStock <= 0 ? 'disabled' : '' ?>><?= icon('cart') ?> <?= $totalStock <= 0 ? 'Sold Out' : 'Add to Cart' ?></button>
          <a class="btn btn-whatsapp" id="waOrder" href="<?= e(whatsapp_link($waBase . "\n" . $productUrl)) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> Order on WhatsApp</a>
        </div>
        <?php if ($product['sale_unit'] === 'meter'): ?><p class="small text-muted-js mt-2 mb-0">Quantity is in whole meters.</p><?php endif; ?>
      </form>

      <dl class="spec-list mb-4">
        <?php if ($product['fabric']): ?><dt>Fabric</dt><dd><?= e($product['fabric']) ?></dd><?php endif; ?>
        <?php if ($product['pieces']): ?><dt>Pieces</dt><dd><?= e($product['pieces']) ?></dd><?php endif; ?>
        <?php if ($product['inclusions']): ?><dt>Includes</dt><dd><?= e($product['inclusions']) ?></dd><?php endif; ?>
        <?php if ($product['season']): ?><dt>Season</dt><dd><?= e($product['season']) ?></dd><?php endif; ?>
        <dt>Sold</dt><dd><?= e(Product::UNITS[$product['sale_unit']] ?? 'Per piece') ?></dd>
      </dl>

      <div class="accordion" id="productInfo">
        <?php if ($product['description']): ?>
        <div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#descr" aria-expanded="true">Description</button></h2>
          <div id="descr" class="accordion-collapse collapse show" data-bs-parent="#productInfo"><div class="accordion-body"><?= nl2br(e($product['description'])) ?></div></div>
        </div>
        <?php endif; ?>
        <?php if ($isStitched): ?>
        <div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sizeGuide" aria-expanded="false">Size guide</button></h2>
          <div id="sizeGuide" class="accordion-collapse collapse" data-bs-parent="#productInfo"><div class="accordion-body">
            <div class="table-responsive"><table class="table table-sm size-guide-table mb-2">
              <thead><tr><th>Size</th><th>Bust (in)</th><th>Waist (in)</th><th>Hip (in)</th><th>Shirt length (in)</th></tr></thead>
              <tbody>
                <tr><td>XS</td><td>32</td><td>26</td><td>36</td><td>38</td></tr><tr><td>S</td><td>34</td><td>28</td><td>38</td><td>39</td></tr>
                <tr><td>M</td><td>36</td><td>30</td><td>40</td><td>40</td></tr><tr><td>L</td><td>38</td><td>32</td><td>42</td><td>41</td></tr>
                <tr><td>XL</td><td>40</td><td>34</td><td>44</td><td>42</td></tr><tr><td>XXL</td><td>42</td><td>36</td><td>46</td><td>43</td></tr>
              </tbody></table></div>
            <p class="small text-muted-js mb-0">Measurements are of the garment with 1 to 2 inches of ease. Unsure? Send us your measurements on WhatsApp.</p>
          </div></div>
        </div>
        <?php endif; ?>
        <div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#delivery" aria-expanded="false">Delivery &amp; exchange</button></h2>
          <div id="delivery" class="accordion-collapse collapse" data-bs-parent="#productInfo"><div class="accordion-body">
            <p><?= e(setting('delivery_policy', '')) ?> Delivery charge <?= e(money(setting('delivery_charge', 0))) ?><?php if ((float) setting('free_delivery_threshold', 0) > 0): ?>, free on orders above <?= e(money(setting('free_delivery_threshold'))) ?><?php endif; ?>.</p>
            <p class="mb-0"><?= e(setting('exchange_policy', '')) ?></p>
          </div></div>
        </div>
      </div>
    </div>
  </div>

  <?= ad_slot('product_bottom') ?>

  <?php if ($related): ?>
  <section class="section pb-0">
    <div class="section-head"><span class="eyebrow">You may also like</span><h2>More <?= e($product['subcategory_name']) ?></h2></div>
    <?= divider() ?>
    <div class="product-grid">
      <?php foreach ($related as $p) { require __DIR__ . '/includes/product-card.php'; } ?>
    </div>
  </section>
  <?php endif; ?>
</div>

<div class="mobile-cta">
  <a class="btn btn-whatsapp" id="waOrderMobile" href="<?= e(whatsapp_link($waBase . "\n" . $productUrl)) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> WhatsApp</a>
  <button class="btn btn-gold" type="submit" form="buyForm" id="addToCartMobile" <?= $totalStock <= 0 ? 'disabled' : '' ?>><?= icon('cart') ?> <?= $totalStock <= 0 ? 'Sold Out' : 'Add to Cart' ?></button>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
