<?php
/**
 * Admin layout opener: <head>, sidebar and top bar. Expects $pageTitle.
 * Every admin page includes this after auth_guard.php and closes with
 * partials/footer.php.
 */
declare(strict_types=1);

$pageTitle = $pageTitle ?? 'Admin';
$flashes = get_flashes();
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="csrf-token" content="<?= e(Csrf::token()) ?>">
<title><?= e($pageTitle) ?> - Admin - <?= e(setting('store_short_name', 'Jalal Sons')) ?></title>
<link rel="icon" href="<?= e(url('assets/img/favicon.svg')) ?>" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Jost:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="<?= e(asset('assets/css/admin.css')) ?>">
</head>
<body class="admin" data-base-url="<?= e(url('')) ?>">
<a class="visually-hidden-focusable" href="#main">Skip to content</a>

<?php require __DIR__ . '/sidebar.php'; ?>

<div class="admin-main">
  <header class="admin-topbar">
    <button class="btn btn-icon d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#adminSidebar" aria-controls="adminSidebar" aria-label="Open menu">
      <?= icon('menu') ?>
    </button>
    <h1 class="admin-page-title"><?= e($pageTitle) ?></h1>
    <div class="ms-auto d-flex align-items-center gap-2">
      <a class="btn btn-sm btn-outline-dark d-none d-sm-inline-flex" href="<?= e(url('')) ?>" target="_blank" rel="noopener">View website</a>
      <div class="dropdown">
        <button class="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <?= e($adminUser['name'] ?? '') ?> <span class="badge text-bg-secondary ms-1"><?= e(ucfirst($adminUser['role'] ?? '')) ?></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="<?= e(url('admin/change-password.php')) ?>">Change password</a></li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <form method="post" action="<?= e(url('admin/logout.php')) ?>"><?= Csrf::field() ?>
              <button class="dropdown-item" type="submit">Log out</button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <main id="main" class="admin-content">
    <?php foreach ($flashes as $f): ?>
      <div class="alert alert-<?= e($f['type']) ?> alert-dismissible fade show" role="alert">
        <?= e($f['message']) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    <?php endforeach; ?>
