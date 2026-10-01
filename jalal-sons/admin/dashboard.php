<?php
/**
 * Analytics dashboard: Total Products, Total Items Sold, Total Remaining
 * Stock, revenue, pending orders, low stock, with a period switch, a 30-day
 * sales chart (Chart.js), top sellers, low-stock list and recent orders.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
$pageTitle = 'Dashboard';

$period = in_array(get('period'), ['today', '7d', '30d', 'all'], true) ? get('period') : '30d';
$periodLabels = ['today' => 'Today', '7d' => 'Last 7 days', '30d' => 'Last 30 days', 'all' => 'All time'];
$stats = Report::dashboard($period);
$chart = Report::salesByDay(30);
$top = Report::topSellers(5, $period);
$low = Report::lowStock(10);
$recent = Report::recentOrders(8);
$extraScripts = ['https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'];

require __DIR__ . '/partials/topbar.php';
?>
<div class="d-flex flex-wrap align-items-center gap-2 mb-3">
  <p class="mb-0 text-secondary">Welcome back, <?= e($adminUser['name']) ?>. Sales figures below are for <strong><?= e(strtolower($periodLabels[$period])) ?></strong>.</p>
  <div class="btn-group btn-group-sm ms-auto" role="group" aria-label="Period">
    <?php foreach ($periodLabels as $k => $l): ?>
      <a class="btn <?= $k === $period ? 'btn-dark' : 'btn-outline-dark' ?>" href="<?= e(url('admin/dashboard.php?period=' . $k)) ?>"><?= e($l) ?></a>
    <?php endforeach; ?>
  </div>
</div>

<div class="row g-3 mb-4">
  <div class="col-6 col-xl-2"><div class="stat-card"><div class="label">Total products</div><p class="value"><?= qty($stats['total_products']) ?></p><div class="hint"><?= qty($stats['active_products']) ?> live on site</div></div></div>
  <div class="col-6 col-xl-2"><div class="stat-card ok"><div class="label">Total items sold</div><p class="value"><?= qty($stats['items_sold']) ?></p><div class="hint"><?= qty($stats['orders']) ?> orders</div></div></div>
  <div class="col-6 col-xl-2"><div class="stat-card"><div class="label">Remaining stock</div><p class="value"><?= qty($stats['remaining_stock']) ?></p><div class="hint">units across all variants</div></div></div>
  <div class="col-6 col-xl-2"><div class="stat-card ok"><div class="label">Revenue</div><p class="value"><?= e(money($stats['revenue'])) ?></p><div class="hint">excl. cancelled/returned</div></div></div>
  <div class="col-6 col-xl-2"><div class="stat-card <?= $stats['pending_orders'] ? 'warn' : '' ?>"><div class="label">Pending web orders</div><p class="value"><?= qty($stats['pending_orders']) ?></p><div class="hint"><a href="<?= e(url('admin/orders.php?status=pending')) ?>">Open orders</a></div></div></div>
  <div class="col-6 col-xl-2"><div class="stat-card <?= $stats['out_of_stock_count'] ? 'danger' : ($stats['low_stock_count'] ? 'warn' : '') ?>"><div class="label">Low / out of stock</div><p class="value"><?= qty($stats['low_stock_count']) ?> / <?= qty($stats['out_of_stock_count']) ?></p><div class="hint">variants &le; <?= (int) setting('low_stock_threshold', 3) ?> / at 0</div></div></div>
</div>

<div class="row g-4">
  <div class="col-xl-8">
    <div class="card h-100">
      <div class="card-header d-flex align-items-center">Sales, last 30 days <span class="ms-auto small fw-normal text-secondary">units sold per day</span></div>
      <div class="card-body">
        <div class="chart-wrap"><canvas id="salesChart" aria-label="Units sold per day for the last 30 days" role="img"></canvas></div>
        <script type="application/json" id="salesChartData"><?= json_encode(['labels' => array_column($chart, 'label'), 'units' => array_column($chart, 'units'), 'revenue' => array_column($chart, 'revenue')], JSON_UNESCAPED_UNICODE) ?></script>
      </div>
    </div>
  </div>
  <div class="col-xl-4">
    <div class="card h-100">
      <div class="card-header">Top 5 sellers</div>
      <ul class="list-group list-group-flush">
        <?php if (!$top): ?><li class="list-group-item text-secondary">No sales in this period yet.</li><?php endif; ?>
        <?php foreach ($top as $t): ?>
          <li class="list-group-item d-flex align-items-center gap-2">
            <img class="thumb-sm" src="<?= e(image_url($t['thumb_path'])) ?>" alt="" width="48" height="64">
            <div class="flex-fill"><div class="fw-semibold"><?= e($t['product_name']) ?></div><div class="small text-secondary"><?= e($t['sku']) ?></div></div>
            <div class="text-end"><div class="fw-semibold"><?= qty($t['units']) ?> sold</div><div class="small text-secondary"><?= e(money($t['revenue'])) ?></div></div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>

  <div class="col-xl-6">
    <div class="card">
      <div class="card-header d-flex">Low stock <a class="ms-auto small" href="<?= e(url('admin/products.php?stock=low')) ?>">See all</a></div>
      <div class="table-responsive"><table class="table mb-0">
        <thead><tr><th>Product</th><th>Variant</th><th class="text-end">Left</th><th></th></tr></thead>
        <tbody>
        <?php if (!$low): ?><tr><td colspan="4" class="text-secondary text-center py-3">Everything is well stocked.</td></tr><?php endif; ?>
        <?php foreach ($low as $v): $st = stock_state((int) $v['stock_quantity']); ?>
          <tr><td><?= e($v['product_name']) ?></td><td><?= e(Variant::label($v)) ?></td>
            <td class="text-end"><span class="badge badge-stock <?= $st['key'] ?>"><?= (int) $v['stock_quantity'] ?></span></td>
            <td class="text-end"><a class="btn btn-sm btn-outline-gold" href="<?= e(url('admin/edit-product.php?id=' . (int) $v['product_id'])) ?>">Restock</a></td></tr>
        <?php endforeach; ?>
        </tbody></table></div>
    </div>
  </div>
  <div class="col-xl-6">
    <div class="card">
      <div class="card-header d-flex">Recent orders <a class="ms-auto small" href="<?= e(url('admin/orders.php')) ?>">All orders</a></div>
      <div class="table-responsive"><table class="table mb-0">
        <thead><tr><th>Order</th><th>Customer</th><th>Channel</th><th>Status</th><th class="text-end">Total</th></tr></thead>
        <tbody>
        <?php if (!$recent): ?><tr><td colspan="5" class="text-secondary text-center py-3">No orders yet. Record a walk-in sale from <a href="<?= e(url('admin/shop-sale.php')) ?>">Shop sale</a>.</td></tr><?php endif; ?>
        <?php foreach ($recent as $o): ?>
          <tr><td><a href="<?= e(url('admin/order-view.php?id=' . (int) $o['id'])) ?>"><?= e($o['order_number']) ?></a><div class="small text-secondary"><?= e(format_date($o['created_at'], 'j M, g:i a')) ?></div></td>
            <td><?= e($o['customer_name']) ?></td><td class="small"><?= e(Order::CHANNELS[$o['channel']] ?? $o['channel']) ?></td>
            <td><span class="badge badge-status <?= e($o['status']) ?>"><?= e($o['status']) ?></span></td>
            <td class="text-end"><?= e(money($o['total'])) ?></td></tr>
        <?php endforeach; ?>
        </tbody></table></div>
    </div>
  </div>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
