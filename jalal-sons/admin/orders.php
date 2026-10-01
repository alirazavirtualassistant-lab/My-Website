<?php
/** Orders list with status and channel filters, search by order number, phone or name. */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
$pageTitle = 'Orders';

$dateOk = static fn(string $d): string => preg_match('/^\d{4}-\d{2}-\d{2}$/', $d) && strtotime($d) ? $d : '';
$filters = [
    'status'  => in_array(get('status'), Order::STATUSES, true) ? get('status') : '',
    'channel' => array_key_exists(get('channel'), Order::CHANNELS) ? get('channel') : '',
    'q'       => mb_substr(get('q'), 0, 60),
    'from'    => $dateOk(get('from')),
    'to'      => $dateOk(get('to')),
];
$result = Order::list($filters, get_int('page', 1), 20);
$orders = $result['items'];
$pg = $result['pagination'];
require __DIR__ . '/partials/topbar.php';
?>
<form class="card mb-3" method="get">
  <div class="card-body row g-2 align-items-end">
    <div class="col-md-3"><label class="form-label small" for="q">Search</label><input class="form-control form-control-sm" id="q" name="q" value="<?= e($filters['q']) ?>" placeholder="Order number, phone or name"></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="status">Status</label><select class="form-select form-select-sm" id="status" name="status"><option value="">All</option><?php foreach (Order::STATUSES as $s): ?><option value="<?= $s ?>" <?= $filters['status'] === $s ? 'selected' : '' ?>><?= ucfirst($s) ?></option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="channel">Channel</label><select class="form-select form-select-sm" id="channel" name="channel"><option value="">All</option><?php foreach (Order::CHANNELS as $k => $l): ?><option value="<?= $k ?>" <?= $filters['channel'] === $k ? 'selected' : '' ?>><?= e($l) ?></option><?php endforeach; ?></select></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="from">From</label><input class="form-control form-control-sm" type="date" id="from" name="from" value="<?= e($filters['from']) ?>"></div>
    <div class="col-6 col-md-2"><label class="form-label small" for="to">To</label><input class="form-control form-control-sm" type="date" id="to" name="to" value="<?= e($filters['to']) ?>"></div>
    <div class="col-md-1 d-flex gap-1"><button class="btn btn-sm btn-gold flex-fill">Go</button><a class="btn btn-sm btn-outline-dark" href="<?= e(url('admin/orders.php')) ?>" title="Reset">&times;</a></div>
  </div>
</form>

<div class="card">
  <div class="card-header d-flex align-items-center"><?= qty($pg['total']) ?> order<?= $pg['total'] === 1 ? '' : 's' ?>
    <a class="btn btn-sm btn-gold ms-auto" href="<?= e(url('admin/shop-sale.php')) ?>">+ Record shop sale</a></div>
  <div class="table-responsive">
    <table class="table mb-0 align-middle">
      <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Channel</th><th class="text-end">Items</th><th class="text-end">Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
      <tbody>
      <?php if (!$orders): ?><tr><td colspan="9" class="text-center text-secondary py-4">No orders match.</td></tr><?php endif; ?>
      <?php foreach ($orders as $o): ?>
        <tr>
          <td><a class="fw-semibold" href="<?= e(url('admin/order-view.php?id=' . (int) $o['id'])) ?>"><?= e($o['order_number']) ?></a></td>
          <td class="small text-nowrap"><?= e(format_date($o['created_at'])) ?></td>
          <td><?= e($o['customer_name']) ?><div class="small text-secondary"><?= e($o['phone']) ?><?= $o['city'] ? ' &middot; ' . e($o['city']) : '' ?></div></td>
          <td class="small"><?= e(Order::CHANNELS[$o['channel']] ?? $o['channel']) ?></td>
          <td class="text-end"><?= qty($o['item_count']) ?></td>
          <td class="text-end text-nowrap"><?= e(money($o['total'])) ?></td>
          <td><span class="badge <?= $o['payment_status'] === 'paid' ? 'text-bg-success' : 'text-bg-light border' ?>"><?= e(ucfirst($o['payment_status'])) ?></span></td>
          <td><span class="badge badge-status <?= e($o['status']) ?>"><?= e($o['status']) ?></span></td>
          <td class="text-end"><a class="btn btn-sm btn-outline-gold" href="<?= e(url('admin/order-view.php?id=' . (int) $o['id'])) ?>">Open</a></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php if ($pg['pages'] > 1): ?><div class="card-body border-top"><?= pagination_links($pg) ?></div><?php endif; ?>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
