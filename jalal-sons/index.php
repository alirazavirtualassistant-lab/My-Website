<?php
/**
 * Homepage: featured banner, product line quick-links, New Arrivals (live
 * from the database on every request), On Sale and Featured strips,
 * visit-us block. No caching: admin changes show on the next page load.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$newArrivals = Product::latest(8);
$onSale = Product::onSale(4);
$featured = Product::featured(4);
$lines = Category::subcategories(null, true);

$pageTitle = (string) setting('store_name', 'Jalal Sons Cloth House');
$metaDescription = (string) setting('meta_description', '');
$bannerImage = (string) setting('banner_image', '');
$bannerLink = (string) setting('banner_button_link', 'shop.php');
$bannerHref = preg_match('#^https?://#i', $bannerLink) ? $bannerLink : url($bannerLink);
require __DIR__ . '/includes/header.php';
?>

<section class="hero">
  <svg class="sprig tl" viewBox="0 0 100 100" aria-hidden="true"><path d="M10 90 Q20 40 70 20 M20 80 q-5-15 10-20 M30 65 q-4-14 12-18 M42 50 q-2-14 14-15 M20 80 q15-5 20 8 M30 65 q14-4 18 10 M42 50 q14-2 16 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  <div class="container hero-inner">
    <div class="hero-copy">
      <span class="eyebrow"><?= e(setting('proprietor', 'Ali Raza')) ?></span>
      <h1><?= e(setting('banner_heading', 'Jalal Sons Cloth House')) ?></h1>
      <div class="sub">Cloth House</div>
      <p class="tagline"><?= e(setting('banner_subheading', setting('tagline', ''))) ?></p>
      <p class="lead"><?= e(setting('banner_text', '')) ?></p>
      <div class="d-flex flex-wrap gap-2 mt-3">
        <a class="btn btn-gold" href="<?= e($bannerHref) ?>"><?= e(setting('banner_button_text', 'Shop the collection')) ?></a>
        <a class="btn btn-outline-gold" href="<?= e(whatsapp_link('Assalam o Alaikum, I would like to ask about your collection.')) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> WhatsApp us</a>
      </div>
    </div>
    <div class="hero-media">
      <div class="frame">
        <?php if ($bannerImage && is_file(ROOT_PATH . '/' . ltrim($bannerImage, '/'))): ?>
          <img src="<?= e(url($bannerImage)) ?>" alt="<?= e(setting('banner_heading', '')) ?>" width="460" height="575" fetchpriority="high">
        <?php elseif ($newArrivals): ?>
          <img src="<?= e(image_url($newArrivals[0]['image_path'])) ?>" alt="<?= e($newArrivals[0]['name']) ?>" width="460" height="575" fetchpriority="high">
        <?php else: ?>
          <div class="placeholder"><img src="<?= e(url('assets/img/logo.svg')) ?>" alt="" width="160" height="160"></div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>

<section class="section pt-4 pt-lg-5">
  <div class="container">
    <div class="section-head"><span class="eyebrow">What we carry</span><h2>Our product lines</h2></div>
    <?= divider() ?>
    <div class="line-tiles">
      <?php foreach ($lines as $line): ?>
        <a class="line-tile" href="<?= e(shop_url(['category' => $line['category_slug'], 'subcategory' => $line['slug']])) ?>">
          <span class="ring"><?= icon($line['icon'] ?: 'kameez') ?></span>
          <span class="label"><?= e($line['name']) ?></span>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section pt-0" id="new-arrivals">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Fresh on the shelves</span><h2>New Arrivals</h2></div>
    <?= divider() ?>
    <?php if ($newArrivals): ?>
      <div class="product-grid">
        <?php foreach ($newArrivals as $p) { require __DIR__ . '/includes/product-card.php'; } ?>
      </div>
      <div class="text-center mt-4"><a class="btn btn-outline-gold" href="<?= e(shop_url(['sort' => 'newest'])) ?>">View all products</a></div>
    <?php else: ?>
      <div class="empty-state">New stock is being added. Please check back soon or <a href="<?= e(whatsapp_link()) ?>">ask on WhatsApp</a>.</div>
    <?php endif; ?>
  </div>
</section>

<?php if ($onSale): ?>
<section class="section pt-0" id="sale">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Limited time</span><h2>On Sale</h2></div>
    <?= divider() ?>
    <div class="product-grid">
      <?php foreach ($onSale as $p) { require __DIR__ . '/includes/product-card.php'; } ?>
    </div>
    <div class="text-center mt-4"><a class="btn btn-outline-gold" href="<?= e(shop_url(['on_sale' => 1])) ?>">All sale items</a></div>
  </div>
</section>
<?php endif; ?>

<?php if ($featured): ?>
<section class="section pt-0" id="featured">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Hand-picked by Ali Raza</span><h2>Featured</h2></div>
    <?= divider() ?>
    <div class="product-grid">
      <?php foreach ($featured as $p) { require __DIR__ . '/includes/product-card.php'; } ?>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="section pt-0" id="visit">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Madina Park, Bhatta Chowk</span><h2>Visit the shop</h2></div>
    <?= divider() ?>
    <div class="visit-grid">
      <div class="card-dark">
        <ul class="contact-list">
          <li><?= icon('pin') ?><div><strong>Address</strong><br><?= e(setting('address', '')) ?></div></li>
          <li><?= icon('phone') ?><div><strong>Phone</strong><br><a href="<?= e(tel_link()) ?>"><?= e(setting('phone', '')) ?></a></div></li>
          <li><?= icon('whatsapp') ?><div><strong>WhatsApp</strong><br><a href="<?= e(whatsapp_link()) ?>" target="_blank" rel="noopener">+<?= e(phone_to_intl((string) setting('whatsapp_number', ''))) ?></a></div></li>
          <li><?= icon('clock') ?><div><strong>Opening hours</strong><br><?= nl2br(e(setting('opening_hours', ''))) ?></div></li>
          <li><?= icon('truck') ?><div><strong>Delivery</strong><br>Cash on Delivery across Pakistan<?php if ((float) setting('free_delivery_threshold', 0) > 0): ?>, free above <?= e(money(setting('free_delivery_threshold'))) ?><?php endif; ?>.</div></li>
        </ul>
      </div>
      <div class="map-frame">
        <iframe src="<?= e(setting('map_embed_url', '')) ?>" title="Map to <?= e(setting('store_name', '')) ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
    </div>
  </div>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
