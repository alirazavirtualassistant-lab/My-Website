<?php
/**
 * Admin login. Throttled (5 failures / 15 min per username + IP),
 * CSRF-protected, hashed passwords.
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';
header('X-Robots-Tag: noindex, nofollow');

if (Auth::check()) {
    redirect(url('admin/dashboard.php'));
}

$error = null;
$next = get('next');
// Only allow redirecting back to admin pages inside this site.
$nextOk = $next !== '' && preg_match('#^/[^\s]*admin/[a-z0-9_\-/.]*(\?.*)?$#i', $next) && !str_contains($next, '//');

if (is_post()) {
    Csrf::check();
    $result = Auth::attempt(post('username'), (string) ($_POST['password'] ?? ''), client_ip());
    if ($result === true) {
        $target = post('next');
        $ok = $target !== '' && preg_match('#^/[^\s]*admin/[a-z0-9_\-/.]*(\?.*)?$#i', $target) && !str_contains($target, '//');
        redirect($ok ? $target : url('admin/dashboard.php'));
    }
    $error = $result;
}
$flashes = get_flashes();
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin login - <?= e(setting('store_name', 'Jalal Sons')) ?></title>
<link rel="icon" href="<?= e(url('assets/img/favicon.svg')) ?>" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Jost:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="<?= e(asset('assets/css/admin.css')) ?>">
</head>
<body class="admin-login">
<main class="login-wrap">
  <div class="login-card">
    <div class="text-center mb-4">
      <img src="<?= e(url('assets/img/logo.svg')) ?>" alt="" width="84" height="84">
      <h1 class="login-title mt-3"><?= e(setting('store_name', 'Jalal Sons Cloth House')) ?></h1>
      <p class="text-secondary small mb-0">Admin panel</p>
    </div>

    <?php foreach ($flashes as $f): ?>
      <div class="alert alert-<?= e($f['type']) ?>"><?= e($f['message']) ?></div>
    <?php endforeach; ?>
    <?php if ($error): ?>
      <div class="alert alert-danger" role="alert"><?= e($error) ?></div>
    <?php endif; ?>

    <form method="post" novalidate>
      <?= Csrf::field() ?>
      <?php if ($nextOk): ?><input type="hidden" name="next" value="<?= e($next) ?>"><?php endif; ?>
      <div class="mb-3">
        <label class="form-label" for="username">Username</label>
        <input class="form-control form-control-lg" id="username" name="username" value="<?= e(post('username')) ?>" autocomplete="username" autofocus required>
      </div>
      <div class="mb-4">
        <label class="form-label" for="password">Password</label>
        <input class="form-control form-control-lg" id="password" type="password" name="password" autocomplete="current-password" required>
      </div>
      <button class="btn btn-gold btn-lg w-100" type="submit">Log in</button>
    </form>
    <p class="text-center small mt-4 mb-0"><a class="link-secondary" href="<?= e(url('')) ?>">&larr; Back to the website</a></p>
  </div>
</main>
</body>
</html>
