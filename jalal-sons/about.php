<?php
/** About the shop. Text comes from settings (admin-editable). */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';
$lines = Category::subcategories(null, true);
$pageTitle = 'About us';
$metaDescription = excerpt((string) setting('about_text', ''), 155);
require __DIR__ . '/includes/header.php';
?>
<div class="container py-4">
  <div class="section-head"><span class="eyebrow"><?= e(setting('proprietor', '')) ?></span><h1><?= e(setting('store_name', '')) ?></h1></div>
  <?= divider() ?>
  <div class="row g-4 align-items-start">
    <div class="col-lg-7">
      <div class="prose">
        <p class="tagline"><?= e(setting('tagline', '')) ?></p>
        <?php foreach (preg_split('/\n\s*\n/', (string) setting('about_text', '')) ?: [] as $para): ?><p><?= nl2br(e($para)) ?></p><?php endforeach; ?>
        <p>Every item on this website is on the shelves at the shop too: when you order online you are buying the same stock a walk-in customer sees, so what you see in stock is really in stock.</p>
        <h2 class="h5 mt-4">How to buy</h2>
        <ol>
          <li>Choose your size or colour and add to cart, or tap <strong>Order on WhatsApp</strong> on any product.</li>
          <li>Check out with Cash on Delivery. We confirm every order by phone or WhatsApp.</li>
          <li>Receive your parcel in 2 to 4 working days anywhere in Pakistan, or collect from the shop.</li>
        </ol>
      </div>
    </div>
    <div class="col-lg-5">
      <div class="card-dark">
        <h2 class="h6">Our product lines</h2>
        <div class="line-tiles" style="grid-template-columns:repeat(2,1fr)">
          <?php foreach ($lines as $line): ?>
            <a class="line-tile" href="<?= e(shop_url(['category' => $line['category_slug'], 'subcategory' => $line['slug']])) ?>"><span class="ring"><?= icon($line['icon'] ?: 'kameez') ?></span><span class="label"><?= e($line['name']) ?></span></a>
          <?php endforeach; ?>
        </div>
        <hr style="border-color:var(--js-graphite)">
        <ul class="contact-list">
          <li><?= icon('pin') ?><span><?= e(setting('address', '')) ?></span></li>
          <li><?= icon('phone') ?><a href="<?= e(tel_link()) ?>"><?= e(setting('phone', '')) ?></a></li>
          <li><?= icon('clock') ?><span><?= nl2br(e(setting('opening_hours', ''))) ?></span></li>
        </ul>
      </div>
    </div>
  </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
