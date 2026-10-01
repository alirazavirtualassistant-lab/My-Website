<?php
/**
 * Order detail: status changes (cancel/return restore stock once), payment
 * status, WhatsApp link to the customer, printable invoice & packing slip.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';

$id = get_int('id');
$order = $id ? Order::find($id) : null;
if (!$order) {
    flash('danger', 'Order not found.');
    redirect(url('admin/orders.php'));
}

if (is_post()) {
    try {
        if (post('action') === 'status') {
            Order::updateStatus($id, post('status'), Auth::id());
            $msg = 'Status updated.';
            if (in_array(post('status'), ['cancelled', 'returned'], true)) {
                $msg .= ' Stock has been restored.';
            }
            flash('success', $msg);
        } elseif (post('action') === 'payment') {
            Order::updatePayment($id, post('payment_status'));
            flash('success', 'Payment status updated.');
        }
    } catch (StockException $e) {
        flash('danger', 'Cannot re-activate: ' . $e->getMessage());
    } catch (Throwable $e) {
        log_message('error', 'order-view: ' . $e->getMessage());
        flash('danger', 'Could not update the order.');
    }
    redirect(url('admin/order-view.php?id=' . $id));
}

$items = Order::items($id);
$print = in_array(get('print'), ['invoice', 'packing'], true) ? get('print') : '';
$pageTitle = 'Order ' . $order['order_number'];
$waText = "Assalam o Alaikum {$order['customer_name']}, this is " . setting('store_name', 'Jalal Sons') . " about your order {$order['order_number']} (" . money($order['total']) . ").";
require __DIR__ . '/partials/topbar.php';
?>
<?php if ($print): ?>
  <div class="card mx-auto" style="max-width:800px">
    <div class="card-body p-4">
      <div class="invoice-brand mb-4">
        <img src="<?= e(url('assets/img/logo.svg')) ?>" alt="" width="64" height="64">
        <div>
          <div class="h5 mb-0" style="font-family:Cinzel,serif;letter-spacing:.1em"><?= e(setting('store_name', '')) ?></div>
          <div class="small"><?= e(setting('address', '')) ?><br>Phone <?= e(setting('phone', '')) ?> &middot; WhatsApp +<?= e(phone_to_intl((string) setting('whatsapp_number', ''))) ?></div>
        </div>
        <div class="ms-auto text-end">
          <div class="h5 mb-0"><?= $print === 'invoice' ? 'INVOICE' : 'PACKING SLIP' ?></div>
          <div><?= e($order['order_number']) ?></div>
          <div class="small text-secondary"><?= e(format_date($order['created_at'])) ?></div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6"><strong>Customer</strong><br><?= e($order['customer_name']) ?><br><?= e($order['phone']) ?><?php if ($order['address']): ?><br><?= e($order['address']) ?><?= $order['city'] ? ', ' . e($order['city']) : '' ?><?php endif; ?></div>
        <div class="col-6 text-end"><strong>Channel:</strong> <?= e(Order::CHANNELS[$order['channel']] ?? '') ?><br><strong>Payment:</strong> <?= e(Order::PAYMENT_METHODS[$order['payment_method']] ?? '') ?> (<?= e($order['payment_status']) ?>)<br><strong>Status:</strong> <?= e(ucfirst($order['status'])) ?></div>
      </div>
      <table class="table table-sm">
        <thead><tr><th>Item</th><th>SKU</th><th class="text-end">Qty</th><?php if ($print === 'invoice'): ?><th class="text-end">Price</th><th class="text-end">Total</th><?php else: ?><th>Packed</th><?php endif; ?></tr></thead>
        <tbody>
        <?php foreach ($items as $it): ?>
          <tr><td><?= e($it['product_name']) ?> <span class="text-secondary">(<?= e($it['variant_label']) ?>)</span></td><td><?= e($it['sku']) ?></td><td class="text-end"><?= (int) $it['quantity'] ?></td>
            <?php if ($print === 'invoice'): ?><td class="text-end"><?= e(money($it['unit_price'])) ?></td><td class="text-end"><?= e(money($it['line_total'])) ?></td><?php else: ?><td>&#9744;</td><?php endif; ?></tr>
        <?php endforeach; ?>
        </tbody>
        <?php if ($print === 'invoice'): ?>
        <tfoot>
          <tr><td colspan="4" class="text-end">Subtotal</td><td class="text-end"><?= e(money($order['subtotal'])) ?></td></tr>
          <tr><td colspan="4" class="text-end">Delivery</td><td class="text-end"><?= e(money($order['delivery_charge'])) ?></td></tr>
          <?php if ((float) $order['discount'] > 0): ?><tr><td colspan="4" class="text-end">Discount</td><td class="text-end">- <?= e(money($order['discount'])) ?></td></tr><?php endif; ?>
          <tr><td colspan="4" class="text-end"><strong>Total</strong></td><td class="text-end"><strong><?= e(money($order['total'])) ?></strong></td></tr>
        </tfoot>
        <?php endif; ?>
      </table>
      <?php if ($order['notes']): ?><p class="small"><strong>Notes:</strong> <?= e($order['notes']) ?></p><?php endif; ?>
      <p class="small text-secondary mb-0"><?= e(setting('exchange_policy', '')) ?></p>
      <div class="no-print mt-3 d-flex gap-2"><button class="btn btn-gold btn-sm" type="button" data-print>Print</button><a class="btn btn-outline-dark btn-sm" href="<?= e(url('admin/order-view.php?id=' . $id)) ?>">Back to order</a></div>
    </div>
  </div>
  <script src="<?= e(asset('assets/js/admin.js')) ?>"></script>
<?php else: ?>
<div class="row g-4">
  <div class="col-lg-8">
    <div class="card mb-4">
      <div class="card-header d-flex flex-wrap align-items-center gap-2">
        <span>Items</span>
        <span class="ms-auto small text-secondary"><?= e(Order::CHANNELS[$order['channel']] ?? '') ?> &middot; <?= e(format_date($order['created_at'])) ?><?= $order['admin_name'] ? ' &middot; by ' . e($order['admin_name']) : '' ?></span>
      </div>
      <div class="table-responsive"><table class="table mb-0 align-middle">
        <thead><tr><th></th><th>Product</th><th>SKU</th><th class="text-end">Price</th><th class="text-end">Qty</th><th class="text-end">Total</th></tr></thead>
        <tbody>
        <?php foreach ($items as $it): ?>
          <tr><td><img class="thumb-sm" src="<?= e(image_url($it['thumb_path'])) ?>" alt="" width="48" height="64"></td>
            <td><?php if ($it['product_slug']): ?><a class="text-dark" href="<?= e(url('admin/edit-product.php?id=' . (int) $it['product_id'])) ?>"><?= e($it['product_name']) ?></a><?php else: ?><?= e($it['product_name']) ?><?php endif; ?><div class="small text-secondary"><?= e($it['variant_label']) ?></div></td>
            <td class="small"><?= e($it['sku']) ?></td><td class="text-end"><?= e(money($it['unit_price'])) ?></td><td class="text-end"><?= (int) $it['quantity'] ?></td><td class="text-end"><?= e(money($it['line_total'])) ?></td></tr>
        <?php endforeach; ?>
        </tbody>
        <tfoot>
          <tr><td colspan="5" class="text-end">Subtotal</td><td class="text-end"><?= e(money($order['subtotal'])) ?></td></tr>
          <tr><td colspan="5" class="text-end">Delivery</td><td class="text-end"><?= e(money($order['delivery_charge'])) ?></td></tr>
          <?php if ((float) $order['discount'] > 0): ?><tr><td colspan="5" class="text-end">Discount</td><td class="text-end">- <?= e(money($order['discount'])) ?></td></tr><?php endif; ?>
          <tr><td colspan="5" class="text-end">Total</td><td class="text-end"><?= e(money($order['total'])) ?></td></tr>
        </tfoot>
      </table></div>
    </div>
    <div class="card">
      <div class="card-header">Customer</div>
      <div class="card-body">
        <p class="mb-1"><strong><?= e($order['customer_name']) ?></strong></p>
        <p class="mb-1"><a href="tel:+<?= e(phone_to_intl($order['phone'])) ?>"><?= e($order['phone']) ?></a>
          <?php if ($order['phone']): ?> &middot; <a class="btn btn-sm btn-outline-gold" href="<?= e(whatsapp_link($waText, $order['phone'])) ?>" target="_blank" rel="noopener">WhatsApp customer</a><?php endif; ?></p>
        <?php if ($order['address']): ?><p class="mb-1"><?= e($order['address']) ?><?= $order['city'] ? ', ' . e($order['city']) : '' ?></p><?php endif; ?>
        <?php if ($order['notes']): ?><p class="mb-0 small text-secondary"><strong>Notes:</strong> <?= e($order['notes']) ?></p><?php endif; ?>
      </div>
    </div>
  </div>
  <div class="col-lg-4">
    <div class="card mb-3">
      <div class="card-header">Status</div>
      <div class="card-body">
        <p class="mb-3">Current: <span class="badge badge-status <?= e($order['status']) ?> fs-6"><?= e($order['status']) ?></span><?php if ($order['stock_restored_at']): ?><br><span class="small text-secondary">Stock restored <?= e(format_date($order['stock_restored_at'])) ?></span><?php endif; ?></p>
        <form method="post" class="d-flex gap-2"><?= Csrf::field() ?><input type="hidden" name="action" value="status">
          <select class="form-select" name="status" aria-label="New status">
            <?php foreach (Order::STATUSES as $s): ?><option value="<?= $s ?>" <?= $order['status'] === $s ? 'selected' : '' ?>><?= ucfirst($s) ?></option><?php endforeach; ?>
          </select>
          <button class="btn btn-gold" data-confirm="Change the order status?">Update</button>
        </form>
        <p class="small text-secondary mt-2 mb-0">Cancelled or returned orders put their stock back automatically and are excluded from sales reports.</p>
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-header">Payment</div>
      <div class="card-body">
        <p class="mb-2"><?= e(Order::PAYMENT_METHODS[$order['payment_method']] ?? $order['payment_method']) ?> &middot; <span class="badge <?= $order['payment_status'] === 'paid' ? 'text-bg-success' : 'text-bg-light border' ?>"><?= e(ucfirst($order['payment_status'])) ?></span></p>
        <form method="post" class="d-flex gap-2"><?= Csrf::field() ?><input type="hidden" name="action" value="payment">
          <select class="form-select" name="payment_status" aria-label="Payment status"><option value="unpaid" <?= $order['payment_status'] === 'unpaid' ? 'selected' : '' ?>>Unpaid</option><option value="paid" <?= $order['payment_status'] === 'paid' ? 'selected' : '' ?>>Paid</option></select>
          <button class="btn btn-outline-dark">Save</button>
        </form>
      </div>
    </div>
    <div class="card">
      <div class="card-header">Print</div>
      <div class="card-body d-grid gap-2">
        <a class="btn btn-outline-gold" href="<?= e(url('admin/order-view.php?id=' . $id . '&print=invoice')) ?>">Invoice</a>
        <a class="btn btn-outline-gold" href="<?= e(url('admin/order-view.php?id=' . $id . '&print=packing')) ?>">Packing slip</a>
        <a class="btn btn-light" href="<?= e(url('admin/orders.php')) ?>">&larr; All orders</a>
      </div>
    </div>
  </div>
</div>
<?php endif; ?>
<?php require __DIR__ . '/partials/footer.php'; ?>
