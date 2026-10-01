<?php
/** Delivery, exchange & return, and privacy policies (admin-editable text). */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';
$pageTitle = 'Policies';
$metaDescription = 'Delivery, exchange, return and privacy policies of ' . setting('store_name', '') . '.';
require __DIR__ . '/includes/header.php';
$sections = [
    'delivery' => ['Delivery', (string) setting('delivery_policy', ''), 'truck'],
    'exchange' => ['Exchange & returns', (string) setting('exchange_policy', ''), 'refresh'],
    'privacy'  => ['Privacy', (string) setting('privacy_policy', ''), 'check'],
];
?>
<div class="container py-4">
  <div class="section-head"><span class="eyebrow">Plain and simple</span><h1>Our policies</h1></div>
  <?= divider() ?>
  <div class="row g-4 justify-content-center">
    <div class="col-lg-8">
      <?php foreach ($sections as $id => [$title, $text, $ic]): ?>
        <section class="card-dark mb-3" id="<?= e($id) ?>">
          <h2 class="h5 d-flex align-items-center gap-2"><?= icon($ic) ?> <?= e($title) ?></h2>
          <div class="prose"><?php foreach (preg_split('/\n\s*\n/', $text) ?: [] as $para): ?><p class="mb-2"><?= nl2br(e($para)) ?></p><?php endforeach; ?></div>
          <?php if ($id === 'delivery'): ?>
            <p class="mb-0 small text-muted-js">Delivery charge: <?= e(money(setting('delivery_charge', 0))) ?><?php if ((float) setting('free_delivery_threshold', 0) > 0): ?>; free on orders of <?= e(money(setting('free_delivery_threshold'))) ?> or more<?php endif; ?>.</p>
          <?php endif; ?>
        </section>
      <?php endforeach; ?>
      <p class="text-center small text-muted-js">Questions? <a href="<?= e(url('contact.php')) ?>">Contact us</a> or message us on <a href="<?= e(whatsapp_link()) ?>" target="_blank" rel="noopener">WhatsApp</a>.</p>
    </div>
  </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
