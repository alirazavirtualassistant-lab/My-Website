<?php
/** Logs the admin out. POST only (a GET just shows a confirm button). */
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

if (is_post()) {
    Csrf::check();
    Auth::logout();
    flash('success', 'You have been logged out.');
    redirect(url('admin/login.php'));
}
?>
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Log out</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="<?= e(asset('assets/css/admin.css')) ?>"></head>
<body class="admin-login"><main class="login-wrap"><div class="login-card text-center">
<p>Do you want to log out of the admin panel?</p>
<form method="post"><?= Csrf::field() ?><button class="btn btn-gold" type="submit">Log out</button>
<a class="btn btn-outline-secondary ms-2" href="<?= e(url('admin/dashboard.php')) ?>">Cancel</a></form>
</div></main></body></html>
