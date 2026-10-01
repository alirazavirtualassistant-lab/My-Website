<?php
/**
 * Categories (gender) and subcategories (cloth type): add, rename,
 * reorder, activate/deactivate. Deleting is owner-only and blocked when
 * products use the row.
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
$pageTitle = 'Categories';

if (is_post()) {
    $action = post('action');
    $table = post('table') === 'subcategories' ? 'subcategories' : 'categories';
    $id = post_int('id');
    try {
        switch ($action) {
            case 'save':
                $v = new Validator($_POST);
                $v->required('name', 'Name')->max('name', 80);
                if ($table === 'subcategories') {
                    $v->required('category_id', 'Main category')->integer('category_id');
                }
                if ($v->fails()) {
                    flash('danger', implode(' ', $v->errors()));
                    break;
                }
                $data = ['name' => post('name'), 'is_active' => isset($_POST['is_active']), 'sort_order' => post_int('sort_order'), 'icon' => post('icon'), 'category_id' => post_int('category_id')];
                if (!$id) {
                    $data['sort_order'] = 1 + (int) Database::fetchColumn("SELECT COALESCE(MAX(sort_order),0) FROM `$table`" . ($table === 'subcategories' ? ' WHERE category_id = :c' : ''), $table === 'subcategories' ? ['c' => $data['category_id']] : []);
                }
                $table === 'subcategories' ? Category::saveSubcategory($data, $id ?: null) : Category::save($data, $id ?: null);
                flash('success', 'Saved.');
                break;
            case 'toggle':
                Category::toggle($table, $id);
                flash('success', 'Visibility updated. The storefront reflects it immediately.');
                break;
            case 'move':
                Category::move($table, $id, post('direction') === 'up' ? 'up' : 'down');
                break;
            case 'delete':
                Auth::requireOwner();
                if (Category::delete($table, $id)) {
                    flash('success', 'Deleted.');
                } else {
                    flash('danger', 'Cannot delete: products are using it. Deactivate it instead.');
                }
                break;
        }
    } catch (Throwable $e) {
        log_message('error', 'categories: ' . $e->getMessage());
        flash('danger', 'Something went wrong. Please try again.');
    }
    redirect(url('admin/categories.php'));
}

$categories = Category::all();
$subs = Category::subcategories();
$icons = ['dress' => 'Dress (party wear)', 'kameez' => 'Kameez (casual / stitched)', 'dupatta' => 'Dupatta (unstitched)', 'fabric' => 'Fabric stack'];
require __DIR__ . '/partials/topbar.php';
?>
<div class="row g-4">
  <div class="col-lg-5">
    <div class="card">
      <div class="card-header">Main categories (gender)</div>
      <div class="table-responsive">
        <table class="table mb-0 align-middle">
          <thead><tr><th>Name</th><th>Status</th><th class="text-end">Actions</th></tr></thead>
          <tbody>
          <?php foreach ($categories as $i => $c): ?>
            <tr>
              <td><strong><?= e($c['name']) ?></strong><div class="small text-secondary">/<?= e($c['slug']) ?></div></td>
              <td><span class="badge <?= $c['is_active'] ? 'text-bg-success' : 'text-bg-secondary' ?>"><?= $c['is_active'] ? 'Live' : 'Hidden' ?></span></td>
              <td class="text-end text-nowrap">
                <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="table" value="categories"><input type="hidden" name="id" value="<?= (int) $c['id'] ?>">
                  <button class="btn btn-sm btn-light" name="action" value="move" title="Move up" <?= $i === 0 ? 'disabled' : '' ?>><input type="hidden" name="direction" value="up">&uarr;</button>
                </form>
                <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="table" value="categories"><input type="hidden" name="id" value="<?= (int) $c['id'] ?>"><input type="hidden" name="direction" value="down">
                  <button class="btn btn-sm btn-light" name="action" value="move" title="Move down" <?= $i === count($categories) - 1 ? 'disabled' : '' ?>>&darr;</button>
                </form>
                <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="table" value="categories"><input type="hidden" name="id" value="<?= (int) $c['id'] ?>">
                  <button class="btn btn-sm btn-outline-dark" name="action" value="toggle"><?= $c['is_active'] ? 'Hide' : 'Show' ?></button>
                </form>
                <button class="btn btn-sm btn-outline-gold" type="button" data-bs-toggle="collapse" data-bs-target="#cat-<?= (int) $c['id'] ?>">Edit</button>
              </td>
            </tr>
            <tr class="collapse" id="cat-<?= (int) $c['id'] ?>"><td colspan="3" class="bg-light">
              <form method="post" class="row g-2 align-items-end"><?= Csrf::field() ?>
                <input type="hidden" name="table" value="categories"><input type="hidden" name="id" value="<?= (int) $c['id'] ?>"><input type="hidden" name="sort_order" value="<?= (int) $c['sort_order'] ?>">
                <div class="col-sm-6"><label class="form-label small">Name</label><input class="form-control form-control-sm" name="name" value="<?= e($c['name']) ?>" required></div>
                <div class="col-sm-3"><div class="form-check"><input class="form-check-input" type="checkbox" name="is_active" id="ca<?= (int) $c['id'] ?>" <?= $c['is_active'] ? 'checked' : '' ?>><label class="form-check-label small" for="ca<?= (int) $c['id'] ?>">Live</label></div></div>
                <div class="col-sm-3 d-flex gap-1"><button class="btn btn-sm btn-gold" name="action" value="save">Save</button>
                  <?php if (Auth::isOwner()): ?><button class="btn btn-sm btn-outline-danger" name="action" value="delete" data-confirm="Delete this category?">Delete</button><?php endif; ?></div>
              </form>
            </td></tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
      <div class="card-body border-top">
        <form method="post" class="row g-2 align-items-end"><?= Csrf::field() ?><input type="hidden" name="table" value="categories">
          <div class="col-sm-7"><label class="form-label small">New main category</label><input class="form-control form-control-sm" name="name" placeholder="e.g. Men" required></div>
          <div class="col-sm-2"><div class="form-check"><input class="form-check-input" type="checkbox" name="is_active" id="newcat"><label class="form-check-label small" for="newcat">Live</label></div></div>
          <div class="col-sm-3"><button class="btn btn-sm btn-gold w-100" name="action" value="save">Add</button></div>
        </form>
      </div>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card">
      <div class="card-header">Cloth types (subcategories)</div>
      <div class="table-responsive">
        <table class="table mb-0 align-middle">
          <thead><tr><th>Name</th><th>Main category</th><th>Status</th><th class="text-end">Actions</th></tr></thead>
          <tbody>
          <?php foreach ($subs as $s): ?>
            <tr>
              <td><strong><?= e($s['name']) ?></strong><div class="small text-secondary"><?= e($icons[$s['icon']] ?? $s['icon']) ?></div></td>
              <td><?= e($s['category_name']) ?></td>
              <td><span class="badge <?= $s['is_active'] ? 'text-bg-success' : 'text-bg-secondary' ?>"><?= $s['is_active'] ? 'Live' : 'Hidden' ?></span></td>
              <td class="text-end text-nowrap">
                <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="table" value="subcategories"><input type="hidden" name="id" value="<?= (int) $s['id'] ?>"><input type="hidden" name="direction" value="up"><button class="btn btn-sm btn-light" name="action" value="move" title="Move up">&uarr;</button></form>
                <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="table" value="subcategories"><input type="hidden" name="id" value="<?= (int) $s['id'] ?>"><input type="hidden" name="direction" value="down"><button class="btn btn-sm btn-light" name="action" value="move" title="Move down">&darr;</button></form>
                <form method="post" class="d-inline"><?= Csrf::field() ?><input type="hidden" name="table" value="subcategories"><input type="hidden" name="id" value="<?= (int) $s['id'] ?>"><button class="btn btn-sm btn-outline-dark" name="action" value="toggle"><?= $s['is_active'] ? 'Hide' : 'Show' ?></button></form>
                <button class="btn btn-sm btn-outline-gold" type="button" data-bs-toggle="collapse" data-bs-target="#sub-<?= (int) $s['id'] ?>">Edit</button>
              </td>
            </tr>
            <tr class="collapse" id="sub-<?= (int) $s['id'] ?>"><td colspan="4" class="bg-light">
              <form method="post" class="row g-2 align-items-end"><?= Csrf::field() ?>
                <input type="hidden" name="table" value="subcategories"><input type="hidden" name="id" value="<?= (int) $s['id'] ?>"><input type="hidden" name="sort_order" value="<?= (int) $s['sort_order'] ?>">
                <div class="col-sm-4"><label class="form-label small">Name</label><input class="form-control form-control-sm" name="name" value="<?= e($s['name']) ?>" required></div>
                <div class="col-sm-3"><label class="form-label small">Main category</label><select class="form-select form-select-sm" name="category_id"><?php foreach ($categories as $c): ?><option value="<?= (int) $c['id'] ?>" <?= $c['id'] == $s['category_id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option><?php endforeach; ?></select></div>
                <div class="col-sm-3"><label class="form-label small">Icon</label><select class="form-select form-select-sm" name="icon"><?php foreach ($icons as $k => $lbl): ?><option value="<?= $k ?>" <?= $k === $s['icon'] ? 'selected' : '' ?>><?= e($lbl) ?></option><?php endforeach; ?></select></div>
                <div class="col-sm-2"><div class="form-check"><input class="form-check-input" type="checkbox" name="is_active" id="sa<?= (int) $s['id'] ?>" <?= $s['is_active'] ? 'checked' : '' ?>><label class="form-check-label small" for="sa<?= (int) $s['id'] ?>">Live</label></div></div>
                <div class="col-12 d-flex gap-1"><button class="btn btn-sm btn-gold" name="action" value="save">Save</button>
                  <?php if (Auth::isOwner()): ?><button class="btn btn-sm btn-outline-danger" name="action" value="delete" data-confirm="Delete this cloth type?">Delete</button><?php endif; ?></div>
              </form>
            </td></tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
      <div class="card-body border-top">
        <form method="post" class="row g-2 align-items-end"><?= Csrf::field() ?><input type="hidden" name="table" value="subcategories">
          <div class="col-sm-4"><label class="form-label small">New cloth type</label><input class="form-control form-control-sm" name="name" placeholder="e.g. Pret" required></div>
          <div class="col-sm-3"><label class="form-label small">Main category</label><select class="form-select form-select-sm" name="category_id"><?php foreach ($categories as $c): ?><option value="<?= (int) $c['id'] ?>"><?= e($c['name']) ?></option><?php endforeach; ?></select></div>
          <div class="col-sm-3"><label class="form-label small">Icon</label><select class="form-select form-select-sm" name="icon"><?php foreach ($icons as $k => $lbl): ?><option value="<?= $k ?>"><?= e($lbl) ?></option><?php endforeach; ?></select></div>
          <div class="col-sm-2"><div class="form-check mb-1"><input class="form-check-input" type="checkbox" name="is_active" id="newsub" checked><label class="form-check-label small" for="newsub">Live</label></div><button class="btn btn-sm btn-gold w-100" name="action" value="save">Add</button></div>
        </form>
      </div>
    </div>
  </div>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
