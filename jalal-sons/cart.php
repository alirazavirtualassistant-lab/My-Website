<?php
/**
 * Session cart. POST actions: add, update, remove (CSRF protected, stock
 * re-checked on every change). AJAX callers receive JSON; others are
 * redirected back with a flash message.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

if (is_post()) {
    Csrf::check();
    $action = post('action');
    $variantId = post_int('variant_id');
    $qty = post_int('qty', 1);
    $result = ['ok' => false, 'message' => 'Unknown action.'];

    if ($action === 'add' && $variantId > 0) {
        $result = Cart::add($variantId, $qty);
    } elseif ($action === 'update' && $variantId > 0) {
        $result = Cart::update($variantId, $qty);
    } elseif ($action === 'remove' && $variantId > 0) {
        Cart::remove($variantId);
        $result = ['ok' => true, 'message' => 'Item removed.'];
    }
    $result['count'] = Cart::count();
    if ($variantId > 0) {
        $v = Variant::find($variantId);
        $result['stock'] = $v ? (int) $v['stock_quantity'] : 0;
    }
    if (is_ajax()) {
        json_response($result);
    }
    flash($result['ok'] ? 'success' : 'danger', $result['message']);
    redirect($action === 'add' ? url('cart.php') : url('cart.php'));
}

$messages = Cart::revalidate();
foreach ($messages as $m) {
    flash('warning', $m);
}
$items = Cart::items();
$subtotal = Cart::subtotal($items);
$delivery = Cart::deliveryCharge($subtotal);
$freeAbove = (float) setting('free_delivery_threshold', 0);

$pageTitle = 'Your cart';
$metaDescription = 'Review your cart at ' . setting('store_name', '') . '.';
require __DIR__ . '/includes/header.php';
?>
<div class="container py-4">
  <div class="steps"><span class="active">1. Cart</span><span>&rsaquo;</span><span>2. Delivery details</span><span>&rsaquo;</span><span>3. Confirmation</span></div>
  <div class="section-head"><h1>Your cart</h1></div>
  <?= divider() ?>

  <?php if (!$items): ?>
    <div class="empty-state">
      <p class="h5 text-gold">Your cart is empty</p>
      <p>Browse the collection and add something you love.</p>
      <a class="btn btn-gold" href="<?= e(url('shop.php')) ?>">Start shopping</a>
    </div>
  <?php else: ?>
    <div class="row g-4">
      <div class="col-lg-8">
        <?php foreach ($items as $it): ?>
          <div class="cart-line">
            <a href="<?= e(product_url(['slug' => $it['slug']])) ?>"><img src="<?= e(image_url($it['image'])) ?>" alt="" width="90" height="120" loading="lazy"></a>
            <div>
              <a class="fw-semibold text-ivory" href="<?= e(product_url(['slug' => $it['slug']])) ?>" style="color:var(--js-ivory)"><?= e($it['name']) ?></a>
              <div class="small text-muted-js"><?= e($it['label']) ?> &middot; <?= e($it['sku']) ?></div>
              <div class="price mt-1"><?= e(money($it['price'])) ?><?= $it['sale_unit'] === 'meter' ? ' <span class="unit">/ meter</span>' : '' ?><?php if ($it['price'] < $it['base_price']): ?><span class="price-old"><?= e(money($it['base_price'])) ?></span><?php endif; ?></div>
              <?php $st = stock_state($it['stock']); if ($st['key'] !== 'in'): ?><div class="stock-indicator <?= $st['key'] ?> small mt-1"><?= e($st['label']) ?></div><?php endif; ?>
            </div>
            <form method="post" data-cart-line class="d-flex align-items-center gap-2">
              <?= Csrf::field() ?><input type="hidden" name="action" value="update"><input type="hidden" name="variant_id" value="<?= (int) $it['variant_id'] ?>">
              <div class="qty-input">
                <button type="button" data-qty-step="-1" aria-label="Decrease">&minus;</button>
                <input class="form-control" type="number" name="qty" value="<?= (int) $it['qty'] ?>" min="0" max="<?= (int) $it['stock'] ?>" aria-label="Quantity">
                <button type="button" data-qty-step="1" aria-label="Increase">+</button>
              </div>
              <noscript><button class="btn btn-outline-gold btn-sm" type="submit">Update</button></noscript>
            </form>
            <div class="d-flex flex-md-column align-items-md-end justify-content-between gap-2">
              <span class="price"><?= e(money($it['line_total'])) ?></span>
              <form method="post"><?= Csrf::field() ?><input type="hidden" name="action" value="remove"><input type="hidden" name="variant_id" value="<?= (int) $it['variant_id'] ?>"><button class="btn btn-link btn-sm p-0 text-muted-js text-decoration-underline" type="submit" style="min-height:auto;text-transform:none;letter-spacing:0">Remove</button></form>
            </div>
          </div>
        <?php endforeach; ?>
        <div class="mt-3"><a class="btn btn-outline-gold btn-sm" href="<?= e(url('shop.php')) ?>">&larr; Continue shopping</a></div>
      </div>
      <div class="col-lg-4">
        <div class="summary-card">
          <h2 class="h6 mb-3">Order summary</h2>
          <div class="row-line"><span>Subtotal</span><span><?= e(money($subtotal)) ?></span></div>
          <div class="row-line"><span>Delivery</span><span><?= $delivery > 0 ? e(money($delivery)) : 'Free' ?></span></div>
          <?php if ($delivery > 0 && $freeAbove > 0): ?><div class="small text-muted-js">Add <?= e(money($freeAbove - $subtotal)) ?> more for free delivery.</div><?php endif; ?>
          <div class="row-line total"><span>Total</span><span><?= e(money($subtotal + $delivery)) ?></span></div>
          <a class="btn btn-gold w-100 mt-3" href="<?= e(url('checkout.php')) ?>">Checkout - Cash on Delivery</a>
          <a class="btn btn-whatsapp w-100 mt-2" href="<?= e(whatsapp_link("Assalam o Alaikum, I want to order:\n" . implode("\n", array_map(fn($i) => "- {$i['name']} ({$i['label']}) x{$i['qty']}", $items)) . "\nTotal: " . money($subtotal + $delivery))) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> Order on WhatsApp instead</a>
          <p class="small text-muted-js mt-3 mb-0"><?= icon('truck') ?> <?= e(setting('delivery_policy', '')) ?></p>
        </div>
      </div>
    </div>
  <?php endif; ?>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
