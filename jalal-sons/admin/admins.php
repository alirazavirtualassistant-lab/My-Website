<?php
/** Admin users (owner only): add staff/owner accounts, activate/deactivate, reset passwords. */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
Auth::requireOwner();
$pageTitle = 'Admin users';

if (is_post()) {
    $action = post('action');
    $id = post_int('id');
    if ($action === 'create') {
        $v = new Validator($_POST);
        $v->required('name', 'Name')->max('name', 100)->required('username', 'Username')->regex('username', '/^[a-zA-Z0-9_.-]{3,50}$/', 'Username: 3-50 letters, numbers, dot, dash or underscore.')
          ->required('email', 'Email')->email('email')->required('password', 'Password')->min('password', 8)->in('role', ['owner', 'staff']);
        if (Database::fetch('SELECT id FROM admins WHERE username = :u OR email = :e', ['u' => post('username'), 'e' => post('email')])) {
            $v->addError('username', 'That username or email is already in use.');
        }
        if ($v->passes()) {
            Database::insert('admins', ['name' => post('name'), 'username' => post('username'), 'email' => post('email'), 'password_hash' => password_hash((string) $_POST['password'], PASSWORD_DEFAULT), 'role' => post('role', 'staff'), 'is_active' => 1]);
            flash('success', 'Admin account created.');
        } else {
            flash('danger', implode(' ', $v->errors()));
        }
    } elseif ($action === 'toggle' && $id && $id !== Auth::id()) {
        Database::run('UPDATE admins SET is_active = 1 - is_active WHERE id = :id', ['id' => $id]);
        flash('success', 'Account updated.');
    } elseif ($action === 'reset' && $id) {
        $pw = (string) ($_POST['password'] ?? '');
        if (mb_strlen($pw) < 8) {
            flash('danger', 'New password must be at least 8 characters.');
        } else {
            Database::update('admins', ['password_hash' => password_hash($pw, PASSWORD_DEFAULT)], $id);
            flash('success', 'Password reset.');
        }
    }
    redirect(url('admin/admins.php'));
}
$admins = Database::fetchAll('SELECT * FROM admins ORDER BY role, name');
require __DIR__ . '/partials/topbar.php';
?>
<div class="row g-4">
  <div class="col-lg-7">
    <div class="card">
      <div class="card-header">Accounts</div>
      <div class="table-responsive"><table class="table mb-0 align-middle">
        <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Last login</th><th>Status</th><th class="text-end">Actions</th></tr></thead>
        <tbody>
        <?php foreach ($admins as $a): ?>
          <tr>
            <td><?= e($a['name']) ?><div class="small text-secondary"><?= e($a['email']) ?></div></td><td><?= e($a['username']) ?></td>
            <td><span class="badge <?= $a['role'] === 'owner' ? 'text-bg-dark' : 'text-bg-light border' ?>"><?= e(ucfirst($a['role'])) ?></span></td>
            <td class="small"><?= e(format_date($a['last_login_at']) ?: 'Never') ?></td>
            <td><span class="badge <?= $a['is_active'] ? 'text-bg-success' : 'text-bg-secondary' ?>"><?= $a['is_active'] ? 'Active' : 'Disabled' ?></span></td>
            <td class="text-end text-nowrap">
              <?php if ((int) $a['id'] !== Auth::id()): ?>
                <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="id" value="<?= (int) $a['id'] ?>"><button class="btn btn-sm btn-outline-dark" name="action" value="toggle"><?= $a['is_active'] ? 'Disable' : 'Enable' ?></button></form>
              <?php endif; ?>
              <button class="btn btn-sm btn-outline-gold" type="button" data-bs-toggle="collapse" data-bs-target="#pw<?= (int) $a['id'] ?>">Reset password</button>
            </td>
          </tr>
          <tr class="collapse" id="pw<?= (int) $a['id'] ?>"><td colspan="6" class="bg-light">
            <form method="post" class="d-flex gap-2 align-items-center"><?= Csrf::field() ?><input type="hidden" name="id" value="<?= (int) $a['id'] ?>"><input type="hidden" name="action" value="reset">
              <input class="form-control form-control-sm" type="password" name="password" placeholder="New password (min 8)" autocomplete="new-password" required style="max-width:280px"><button class="btn btn-sm btn-gold">Set</button></form>
          </td></tr>
        <?php endforeach; ?>
        </tbody></table></div>
    </div>
  </div>
  <div class="col-lg-5">
    <div class="card">
      <div class="card-header">Add admin</div>
      <div class="card-body">
        <form method="post" novalidate><?= Csrf::field() ?><input type="hidden" name="action" value="create">
          <div class="mb-3"><label class="form-label" for="name">Name</label><input class="form-control" id="name" name="name" required></div>
          <div class="mb-3"><label class="form-label" for="username">Username</label><input class="form-control" id="username" name="username" autocomplete="off" required></div>
          <div class="mb-3"><label class="form-label" for="email">Email</label><input class="form-control" id="email" name="email" type="email" required></div>
          <div class="mb-3"><label class="form-label" for="password">Password (min 8)</label><input class="form-control" id="password" name="password" type="password" autocomplete="new-password" required></div>
          <div class="mb-3"><label class="form-label" for="role">Role</label><select class="form-select" id="role" name="role"><option value="staff">Staff: products, stock, orders, shop sales</option><option value="owner">Owner: everything incl. settings &amp; deletions</option></select></div>
          <button class="btn btn-gold w-100">Create account</button>
        </form>
      </div>
    </div>
  </div>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
