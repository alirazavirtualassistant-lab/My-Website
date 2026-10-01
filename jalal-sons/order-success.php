<?php
/**
 * Order confirmation. Only shown to the session that placed the order
 * (no order-number guessing), with a "Send order on WhatsApp" button.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$number = get('n');
$last = $_SESSION['last_order'] ?? null;
if (!$last || $number === '' || !hash_equals((string) $last['number'], $number)) {
    flash('info', 'That order confirmation is no longer available. Call or WhatsApp us to check an order.');
    redirect(url(''));
}
$order = Order::find((int) $last['id']);
if (!$order) {
    redirect(url(''));
}
$items = Order::items((int) $order['id']);
$waText = Order::whatsappSummary($order, $items);

$pageTitle = 'Order ' . $order['order_number'] . ' received';
$metaDescription = 'Thank you for your order.';
require __DIR__ . '/includes/header.php';
?>
<div class="container py-4">
  <div class="steps"><span>1. Cart</span><span>&rsaquo;</span><span>2. Delivery details</span><span>&rsaquo;</span><span class="active">3. Confirmation</span></div>
  <div class="section-head"><span class="eyebrow">Shukriya!</span><h1>Order received</h1></div>
  <?= divider() ?>
  <div class="row g-4 justify-content-center">
    <div class="col-lg-7">
      <div class="summary-card text-center mb-3">
        <p class="mb-1 text-muted-js">Your order number</p>
        <p class="h3 text-gold mb-2"><?= e($order['order_number']) ?></p>
        <p class="mb-0">We will confirm it on <strong><?= e($order['phone']) ?></strong> shortly. Payment is Cash on Delivery: <strong><?= e(money($order['total'])) ?></strong>.</p>
      </div>
      <div class="card-dark">
        <h2 class="h6 mb-3">Summary</h2>
        <?php foreach ($items as $it): ?>
          <div class="row-line d-flex justify-content-between py-1"><span><?= e($it['product_name']) ?> <span class="text-muted-js small">(<?= e($it['variant_label']) ?>) &times; <?= (int) $it['quantity'] ?></span></span><span><?= e(money($it['line_total'])) ?></span></div>
        <?php endforeach; ?>
        <div class="d-flex justify-content-between pt-2 mt-2" style="border-top:1px solid var(--js-graphite)"><span>Subtotal</span><span><?= e(money($order['subtotal'])) ?></span></div>
        <div class="d-flex justify-content-between"><span>Delivery</span><span><?= (float) $order['delivery_charge'] > 0 ? e(money($order['delivery_charge'])) : 'Free' ?></span></div>
        <div class="d-flex justify-content-between text-gold fw-semibold fs-5 mt-1"><span>Total</span><span><?= e(money($order['total'])) ?></span></div>
        <hr style="border-color:var(--js-graphite)">
        <p class="small mb-1"><strong>Deliver to:</strong> <?= e($order['customer_name']) ?>, <?= e($order['address']) ?>, <?= e($order['city']) ?></p>
        <?php if ($order['notes']): ?><p class="small mb-0"><strong>Notes:</strong> <?= e($order['notes']) ?></p><?php endif; ?>
      </div>
      <div class="d-grid gap-2 mt-3">
        <a class="btn btn-whatsapp" href="<?= e(whatsapp_link($waText)) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> Send order on WhatsApp</a>
        <a class="btn btn-outline-gold" href="<?= e(url('shop.php')) ?>">Continue shopping</a>
      </div>
      <p class="small text-muted-js mt-3 text-center mb-0">Sending the order on WhatsApp helps us confirm it faster. <?= e(setting('delivery_policy', '')) ?></p>
    </div>
  </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
