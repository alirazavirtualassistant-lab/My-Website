<?php
/**
 * Walk-in (counter) sale: search by name or SKU, pick variants and
 * quantities, optional price override and discount, cash payment. Saves an
 * order with channel "shop", status "delivered", and deducts stock exactly
 * like a web order.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
$pageTitle = 'Shop sale (walk-in)';

if (is_post()) {
    $lines = [];
    foreach ((array) ($_POST['lines'] ?? []) as $l) {
        if (is_array($l) && (int) ($l['variant_id'] ?? 0) > 0 && (int) ($l['quantity'] ?? 0) > 0) {
            $lines[] = ['variant_id' => (int) $l['variant_id'], 'quantity' => (int) $l['quantity'], 'unit_price' => $l['unit_price'] ?? null];
        }
    }
    $v = new Validator($_POST);
    $v->max('customer_name', 120)->phone('phone')->max('notes', 500)->numeric('discount')->between('discount', 0, 9999999)
      ->in('payment_method', array_keys(Order::PAYMENT_METHODS));
    if (!$lines) {
        $v->addError('lines', 'Add at least one item to the sale.');
    }
    if ($v->passes()) {
        try {
            $order = Order::place(
                ['name' => post('customer_name') ?: 'Walk-in customer', 'phone' => post('phone') ? normalize_phone(post('phone')) : '', 'notes' => post('notes')],
                $lines,
                ['channel' => 'shop', 'payment_method' => post('payment_method', 'cash'), 'payment_status' => 'paid', 'status' => 'delivered',
                 'discount' => (float) post('discount', '0'), 'delivery_charge' => 0, 'admin_id' => Auth::id()]
            );
            flash('success', 'Sale ' . $order['order_number'] . ' recorded (' . money($order['total']) . '). Stock has been updated.');
            redirect(url('admin/order-view.php?id=' . (int) $order['id']));
        } catch (StockException $e) {
            flash('danger', $e->getMessage() . ' The sale was not saved.');
        } catch (Throwable $e) {
            log_message('error', 'shop-sale: ' . $e->getMessage());
            flash('danger', 'Could not save the sale. Please try again.');
        }
    } else {
        flash('danger', implode(' ', $v->errors()));
    }
    redirect(url('admin/shop-sale.php'));
}
require __DIR__ . '/partials/topbar.php';
?>
<form method="post" id="shopSaleForm" data-search-url="<?= e(url('admin/ajax/product-search.php')) ?>">
  <?= Csrf::field() ?>
  <div class="row g-4">
    <div class="col-lg-8">
      <div class="card mb-3">
        <div class="card-body position-relative">
          <label class="form-label" for="saleSearch">Find a product (name or SKU)</label>
          <input class="form-control form-control-lg" id="saleSearch" placeholder="Start typing, e.g. lawn or JS-PW-0001" autocomplete="off" autofocus>
          <div class="search-results mt-1" id="saleResults" hidden></div>
          <div class="form-text">Tap a result to add it. Tap again to increase the quantity.</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">Items in this sale</div>
        <div class="table-responsive"><table class="table mb-0 align-middle">
          <thead><tr><th>Product</th><th>Qty</th><th>Unit price</th><th class="text-end">Total</th><th></th></tr></thead>
          <tbody id="saleLines"></tbody>
        </table></div>
        <div class="card-body text-secondary text-center" id="saleEmpty">No items yet. Search above to add products.</div>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card">
        <div class="card-header">Payment &amp; customer</div>
        <div class="card-body">
          <div class="mb-3"><label class="form-label" for="payment_method">Payment</label>
            <select class="form-select" id="payment_method" name="payment_method"><option value="cash">Cash</option><option value="bank_transfer">Bank transfer</option></select></div>
          <div class="mb-3"><label class="form-label" for="discount">Discount (Rs.)</label><input class="form-control" type="number" min="0" step="1" id="discount" name="discount" value="0"></div>
          <div class="mb-3"><label class="form-label" for="customer_name">Customer name (optional)</label><input class="form-control" id="customer_name" name="customer_name" maxlength="120"></div>
          <div class="mb-3"><label class="form-label" for="phone">Phone (optional)</label><input class="form-control" id="phone" name="phone" type="tel" placeholder="03XXXXXXXXX"></div>
          <div class="mb-3"><label class="form-label" for="notes">Notes</label><input class="form-control" id="notes" name="notes" maxlength="500"></div>
          <div class="d-flex justify-content-between"><span>Subtotal</span><strong id="saleSubtotal">Rs. 0</strong></div>
          <div class="d-flex justify-content-between fs-5 mt-1 border-top pt-2"><span>Total</span><strong class="text-gold" id="saleTotal">Rs. 0</strong></div>
          <button class="btn btn-gold w-100 mt-3" type="submit" id="saleSubmit" disabled>Complete sale</button>
          <p class="small text-secondary mt-2 mb-0">The sale is saved as delivered and paid; stock is deducted immediately.</p>
        </div>
      </div>
    </div>
  </div>
</form>
<?php require __DIR__ . '/partials/footer.php'; ?>
