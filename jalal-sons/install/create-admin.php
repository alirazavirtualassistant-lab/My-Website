<?php
/**
 * ONE-TIME installer: creates the first (owner) admin account.
 *
 * Refuses to run when any admin already exists. Delete the /install
 * folder as soon as the account has been created.
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

$existing = (int) Database::fetchColumn('SELECT COUNT(*) FROM admins');
$errors = [];
$done = false;

if ($existing === 0 && is_post()) {
    Csrf::check();
    $v = new Validator($_POST);
    $v->required('name', 'Name')->max('name', 100)
      ->required('username', 'Username')->regex('username', '/^[a-zA-Z0-9_.-]{3,50}$/', 'Username may contain letters, numbers, dot, dash and underscore (3-50 characters).')
      ->required('email', 'Email')->email('email')
      ->required('password', 'Password')->min('password', 8)
      ->same('password_confirm', 'password', 'Passwords do not match.');

    if ($v->passes()) {
        Database::insert('admins', [
            'name'          => post('name'),
            'username'      => post('username'),
            'email'         => post('email'),
            'password_hash' => password_hash(post('password'), PASSWORD_DEFAULT),
            'role'          => 'owner',
            'is_active'     => 1,
        ]);
        $done = true;
    } else {
        $errors = $v->errors();
    }
}
?>
<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Create owner account - Jalal Sons</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="<?= e(asset('assets/css/theme.css')) ?>">
</head>
<body class="d-flex align-items-center min-vh-100">
<main class="container" style="max-width:520px">
  <div class="card p-4 p-md-5">
    <div class="text-center mb-4">
      <img src="<?= e(url('assets/img/logo.svg')) ?>" alt="" width="72" height="72">
      <h1 class="h4 mt-3 text-gold">First-time setup</h1>
      <p class="text-muted-js mb-0">Create the owner account for the admin panel.</p>
    </div>

    <?php if ($existing > 0): ?>
      <div class="alert alert-warning">An admin account already exists. This installer is disabled.
        Please <strong>delete the <code>/install</code> folder</strong> now.</div>
      <a class="btn btn-gold w-100" href="<?= e(url('admin/login.php')) ?>">Go to admin login</a>

    <?php elseif ($done): ?>
      <div class="alert alert-success">Owner account created. You can now log in.</div>
      <div class="alert alert-danger"><strong>Security:</strong> delete the <code>/install</code> folder from the server before going live.</div>
      <a class="btn btn-gold w-100" href="<?= e(url('admin/login.php')) ?>">Go to admin login</a>

    <?php else: ?>
      <?php if ($errors): ?>
        <div class="alert alert-danger"><ul class="mb-0"><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
      <?php endif; ?>
      <form method="post" novalidate>
        <?= Csrf::field() ?>
        <div class="mb-3"><label class="form-label" for="name">Full name</label>
          <input class="form-control" id="name" name="name" value="<?= e(post('name')) ?>" required></div>
        <div class="mb-3"><label class="form-label" for="username">Username</label>
          <input class="form-control" id="username" name="username" value="<?= e(post('username')) ?>" autocomplete="username" required></div>
        <div class="mb-3"><label class="form-label" for="email">Email</label>
          <input class="form-control" id="email" type="email" name="email" value="<?= e(post('email')) ?>" required></div>
        <div class="mb-3"><label class="form-label" for="password">Password (min 8 characters)</label>
          <input class="form-control" id="password" type="password" name="password" autocomplete="new-password" required></div>
        <div class="mb-4"><label class="form-label" for="password_confirm">Confirm password</label>
          <input class="form-control" id="password_confirm" type="password" name="password_confirm" autocomplete="new-password" required></div>
        <button class="btn btn-gold w-100" type="submit">Create owner account</button>
      </form>
    <?php endif; ?>
  </div>
</main>
</body>
</html>
