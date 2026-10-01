<?php
/**
 * Guest checkout, Cash on Delivery. Prices, stock and totals are
 * recalculated on the server from the database; the whole order is one
 * transaction that rolls back if any item ran out.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$items = Cart::items();
if (!$items) {
    flash('info', 'Your cart is empty.');
    redirect(url('cart.php'));
}
$errors = [];

if (is_post()) {
    Csrf::check();
    // Honeypot: real people never fill this hidden field.
    if (post('website') !== '') {
        redirect(url('cart.php'));
    }
    $v = new Validator($_POST);
    $v->required('name', 'Your name')->max('name', 120)
      ->required('phone', 'Mobile number')->phone('phone')
      ->required('address', 'Delivery address')->min('address', 10)->max('address', 255)
      ->required('city', 'City')->max('city', 80)
      ->max('notes', 1000);
    if ($v->passes()) {
        $lines = array_map(fn($i) => ['variant_id' => $i['variant_id'], 'quantity' => $i['qty']], $items);
        try {
            $order = Order::place(
                ['name' => post('name'), 'phone' => normalize_phone(post('phone')), 'address' => post('address'), 'city' => post('city'), 'notes' => post('notes')],
                $lines,
                ['channel' => 'web', 'payment_method' => 'cod']
            );
            Cart::clear();
            $_SESSION['last_order'] = ['id' => (int) $order['id'], 'number' => $order['order_number']];
            clear_old();
            redirect(url('order-success.php?n=' . rawurlencode($order['order_number'])));
        } catch (StockException $e) {
            Cart::revalidate();
            flash('danger', $e->getMessage() . ' Your cart has been updated, please review it.');
            redirect(url('cart.php'));
        } catch (InvalidArgumentException $e) {
            flash('danger', $e->getMessage());
            redirect(url('cart.php'));
        } catch (Throwable $e) {
            log_message('error', 'checkout: ' . $e->getMessage());
            $errors['general'] = 'We could not place your order. Please try again or order on WhatsApp.';
        }
    } else {
        $errors = $v->errors();
    }
    remember_old($_POST);
}

$subtotal = Cart::subtotal($items);
$delivery = Cart::deliveryCharge($subtotal);
$pageTitle = 'Checkout';
$metaDescription = 'Cash on delivery checkout at ' . setting('store_name', '') . '.';
require __DIR__ . '/includes/header.php';
$val = fn(string $k) => e((string) old($k, ''));
$cls = fn(string $k) => isset($errors[$k]) ? ' is-invalid' : '';
?>
<div class="container py-4">
  <div class="steps"><span>1. Cart</span><span>&rsaquo;</span><span class="active">2. Delivery details</span><span>&rsaquo;</span><span>3. Confirmation</span></div>
  <div class="section-head"><h1>Delivery details</h1></div>
  <?= divider() ?>
  <?php if ($errors): ?><div class="alert alert-danger"><ul class="mb-0"><?php foreach ($errors as $m): ?><li><?= e($m) ?></li><?php endforeach; ?></ul></div><?php endif; ?>

  <form method="post" class="row g-4" novalidate>
    <?= Csrf::field() ?>
    <div class="col-lg-7">
      <div class="card-dark">
        <div class="row g-3">
          <div class="col-12"><label class="form-label" for="name">Full name</label><input class="form-control<?= $cls('name') ?>" id="name" name="name" value="<?= $val('name') ?>" autocomplete="name" required></div>
          <div class="col-md-6"><label class="form-label" for="phone">Mobile number</label><input class="form-control<?= $cls('phone') ?>" id="phone" name="phone" type="tel" inputmode="tel" placeholder="03XXXXXXXXX" value="<?= $val('phone') ?>" autocomplete="tel" required><div class="form-text text-muted-js">We will confirm your order on this number (WhatsApp or call).</div></div>
          <div class="col-md-6"><label class="form-label" for="city">City</label><input class="form-control<?= $cls('city') ?>" id="city" name="city" value="<?= $val('city') ?: 'Lahore' ?>" autocomplete="address-level2" required></div>
          <div class="col-12"><label class="form-label" for="address">Delivery address</label><textarea class="form-control<?= $cls('address') ?>" id="address" name="address" rows="3" autocomplete="street-address" required placeholder="House, street, area, landmark"><?= $val('address') ?></textarea></div>
          <div class="col-12"><label class="form-label" for="notes">Notes (optional)</label><textarea class="form-control" id="notes" name="notes" rows="2" placeholder="Delivery time, stitching notes..."><?= $val('notes') ?></textarea></div>
          <div class="visually-hidden" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
        </div>
      </div>
      <div class="card-dark mt-3">
        <h2 class="h6">Payment</h2>
        <label class="filter-check"><input class="form-check-input" type="radio" name="payment" value="cod" checked> Cash on Delivery</label>
        <p class="small text-muted-js mb-0 mt-1">Pay the courier in cash when your parcel arrives. Prefer bank transfer? Order on WhatsApp and we will share the details.</p>
      </div>
    </div>
    <div class="col-lg-5">
      <div class="summary-card">
        <h2 class="h6 mb-3">Your order</h2>
        <?php foreach ($items as $it): ?>
          <div class="row-line"><span><?= e($it['name']) ?> <span class="text-muted-js small">(<?= e($it['label']) ?>) &times; <?= (int) $it['qty'] ?></span></span><span><?= e(money($it['line_total'])) ?></span></div>
        <?php endforeach; ?>
        <div class="row-line mt-2 pt-2" style="border-top:1px solid var(--js-graphite)"><span>Subtotal</span><span><?= e(money($subtotal)) ?></span></div>
        <div class="row-line"><span>Delivery</span><span><?= $delivery > 0 ? e(money($delivery)) : 'Free' ?></span></div>
        <div class="row-line total"><span>Total to pay</span><span><?= e(money($subtotal + $delivery)) ?></span></div>
        <button class="btn btn-gold w-100 mt-3" type="submit">Place order</button>
        <a class="btn btn-outline-gold w-100 mt-2" href="<?= e(url('cart.php')) ?>">Back to cart</a>
        <p class="small text-muted-js mt-3 mb-0">By placing an order you agree to our <a href="<?= e(url('policies.php')) ?>">delivery and exchange policy</a>.</p>
      </div>
    </div>
  </form>
</div>
<?php clear_old(); require __DIR__ . '/includes/footer.php'; ?>
