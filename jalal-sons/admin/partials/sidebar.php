<?php
/** Admin sidebar: black with gold active states, JS monogram, pending-orders badge. */
declare(strict_types=1);

$current = basename((string) ($_SERVER['SCRIPT_NAME'] ?? ''));
$isOwner = Auth::isOwner();
$nav = [
    ['Dashboard',       'dashboard.php',        ['dashboard.php']],
    ['Products',        'products.php',         ['products.php', 'add-product.php', 'edit-product.php']],
    ['Categories',      'categories.php',       ['categories.php']],
    ['Orders',          'orders.php',           ['orders.php', 'order-view.php'], 'badge'],
    ['Shop sale',       'shop-sale.php',        ['shop-sale.php']],
    ['Inventory report','inventory-report.php', ['inventory-report.php']],
    ['Messages',        'messages.php',         ['messages.php']],
];
if ($isOwner) {
    $nav[] = ['Admin users', 'admins.php',   ['admins.php']];
    $nav[] = ['Settings',    'settings.php', ['settings.php']];
}
?>
<nav class="admin-sidebar offcanvas-lg offcanvas-start" tabindex="-1" id="adminSidebar" aria-label="Admin navigation">
  <div class="sidebar-brand">
    <img src="<?= e(url('assets/img/logo.svg')) ?>" alt="" width="44" height="44">
    <div>
      <span class="brand-name"><?= e(setting('store_short_name', 'Jalal Sons')) ?></span>
      <span class="brand-sub">Admin panel</span>
    </div>
    <button type="button" class="btn-close btn-close-white d-lg-none ms-auto" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar" aria-label="Close"></button>
  </div>
  <ul class="sidebar-nav">
    <?php foreach ($nav as $item): ?>
      <li>
        <a class="<?= in_array($current, $item[2], true) ? 'active' : '' ?>" href="<?= e(url('admin/' . $item[1])) ?>">
          <span><?= e($item[0]) ?></span>
          <?php if (($item[3] ?? '') === 'badge' && $pendingOrders > 0): ?>
            <span class="badge rounded-pill text-bg-warning ms-auto" title="Pending web orders"><?= (int) $pendingOrders ?></span>
          <?php endif; ?>
        </a>
      </li>
    <?php endforeach; ?>
  </ul>
  <div class="sidebar-foot">
    <a href="<?= e(url('admin/add-product.php')) ?>" class="btn btn-gold btn-sm w-100">+ Add product</a>
  </div>
</nav>
