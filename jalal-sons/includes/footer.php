<?php
/** Storefront layout closer: footer with product lines, policies, contact, social links. */
declare(strict_types=1);

$navTree = $navTree ?? Category::navTree();
$socials = array_filter([
    'Facebook'  => (string) setting('facebook_url', ''),
    'Instagram' => (string) setting('instagram_url', ''),
    'TikTok'    => (string) setting('tiktok_url', ''),
]);
?>
</main>

<footer class="site-footer">
  <svg class="sprig tl" viewBox="0 0 100 100" aria-hidden="true"><path d="M10 90 Q20 40 70 20 M20 80 q-5-15 10-20 M30 65 q-4-14 12-18 M42 50 q-2-14 14-15 M20 80 q15-5 20 8 M30 65 q14-4 18 10 M42 50 q14-2 16 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  <svg class="sprig br" viewBox="0 0 100 100" aria-hidden="true"><path d="M10 90 Q20 40 70 20 M20 80 q-5-15 10-20 M30 65 q-4-14 12-18 M42 50 q-2-14 14-15 M20 80 q15-5 20 8 M30 65 q14-4 18 10 M42 50 q14-2 16 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  <div class="container">
    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4">
        <a class="brand mb-3" href="<?= e(url('')) ?>"><img src="<?= e(url('assets/img/logo.svg')) ?>" alt="" width="46" height="46"><span class="brand-text"><span class="brand-name"><?= e(setting('store_short_name', 'Jalal Sons')) ?></span><span class="brand-sub">Cloth House</span></span></a>
        <p class="tagline mt-3 mb-2"><?= e(setting('tagline', '')) ?></p>
        <p class="mb-0 small">Proprietor: <?= e(setting('proprietor', '')) ?></p>
      </div>
      <div class="col-6 col-md-3 col-lg-2">
        <h4>Shop</h4>
        <ul class="footer-links">
          <?php foreach ($navTree as $cat): foreach ($cat['subcategories'] as $sub): ?>
            <li><a href="<?= e(shop_url(['category' => $cat['slug'], 'subcategory' => $sub['slug']])) ?>"><?= e($sub['name']) ?></a></li>
          <?php endforeach; endforeach; ?>
          <li><a href="<?= e(shop_url(['on_sale' => 1])) ?>">Sale</a></li>
        </ul>
      </div>
      <div class="col-6 col-md-3 col-lg-2">
        <h4>Information</h4>
        <ul class="footer-links">
          <li><a href="<?= e(url('about.php')) ?>">About us</a></li>
          <li><a href="<?= e(url('policies.php#delivery')) ?>">Delivery</a></li>
          <li><a href="<?= e(url('policies.php#exchange')) ?>">Exchange &amp; returns</a></li>
          <li><a href="<?= e(url('policies.php#privacy')) ?>">Privacy</a></li>
          <li><a href="<?= e(url('contact.php')) ?>">Contact</a></li>
        </ul>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <h4>Visit us</h4>
        <ul class="contact-list">
          <li><?= icon('pin') ?><span><?= e(setting('address', '')) ?></span></li>
          <li><?= icon('phone') ?><a href="<?= e(tel_link()) ?>"><?= e(setting('phone', '')) ?></a></li>
          <li><?= icon('whatsapp') ?><a href="<?= e(whatsapp_link()) ?>" target="_blank" rel="noopener">Chat on WhatsApp</a></li>
          <li><?= icon('clock') ?><span><?= nl2br(e(setting('opening_hours', ''))) ?></span></li>
        </ul>
        <?php if ($socials): ?>
          <div class="social-links mt-3">
            <?php foreach ($socials as $name => $href): ?><a class="btn btn-outline-gold btn-sm" href="<?= e($href) ?>" target="_blank" rel="noopener"><?= e($name) ?></a><?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <?= date('Y') ?> <?= e(setting('store_name', '')) ?>. All rights reserved.</span>
      <span>Cash on Delivery across Pakistan &middot; Prices in Pakistani Rupees</span>
    </div>
  </div>
</footer>

<div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastWrap" aria-live="polite"></div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= e(asset('assets/js/app.js')) ?>"></script>
</body>
</html>
