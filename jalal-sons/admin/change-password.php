<?php
/** Change the logged-in admin's password (current password required). */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
$pageTitle = 'Change password';
$errors = [];

if (is_post()) {
    $v = new Validator($_POST);
    $v->required('current', 'Current password')->required('password', 'New password')->min('password', 8)->max('password', 200)
      ->same('password_confirm', 'password', 'The new passwords do not match.');
    if ($v->passes()) {
        $r = Auth::changePassword(Auth::id(), (string) $_POST['current'], (string) $_POST['password']);
        if ($r === true) {
            flash('success', 'Password changed.');
            redirect(url('admin/dashboard.php'));
        }
        $errors[] = $r;
    } else {
        $errors = $v->errors();
    }
}
require __DIR__ . '/partials/topbar.php';
?>
<div class="card mx-auto" style="max-width:480px">
  <div class="card-body p-4">
    <?php if ($errors): ?><div class="alert alert-danger"><ul class="mb-0"><?php foreach ($errors as $m): ?><li><?= e($m) ?></li><?php endforeach; ?></ul></div><?php endif; ?>
    <form method="post" novalidate><?= Csrf::field() ?>
      <div class="mb-3"><label class="form-label" for="current">Current password</label><input class="form-control" type="password" id="current" name="current" autocomplete="current-password" required></div>
      <div class="mb-3"><label class="form-label" for="password">New password (min 8 characters)</label><input class="form-control" type="password" id="password" name="password" autocomplete="new-password" required></div>
      <div class="mb-4"><label class="form-label" for="password_confirm">Confirm new password</label><input class="form-control" type="password" id="password_confirm" name="password_confirm" autocomplete="new-password" required></div>
      <button class="btn btn-gold w-100">Change password</button>
    </form>
  </div>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
