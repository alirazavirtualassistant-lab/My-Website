<?php
/** Messages sent from the website contact form. */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
$pageTitle = 'Messages';

if (is_post()) {
    $id = post_int('id');
    if (post('action') === 'read' && $id) {
        Database::run('UPDATE contact_messages SET is_read = 1 WHERE id = :id', ['id' => $id]);
    } elseif (post('action') === 'delete' && $id && Auth::isOwner()) {
        Database::run('DELETE FROM contact_messages WHERE id = :id', ['id' => $id]);
        flash('success', 'Message deleted.');
    }
    redirect(url('admin/messages.php'));
}
$total = (int) Database::fetchColumn('SELECT COUNT(*) FROM contact_messages');
$pg = paginate($total, get_int('page', 1), 20);
$messages = Database::fetchAll("SELECT * FROM contact_messages ORDER BY is_read, created_at DESC LIMIT {$pg['per_page']} OFFSET {$pg['offset']}");
require __DIR__ . '/partials/topbar.php';
?>
<div class="card">
  <div class="card-header"><?= qty($total) ?> message<?= $total === 1 ? '' : 's' ?></div>
  <div class="list-group list-group-flush">
    <?php if (!$messages): ?><div class="list-group-item text-secondary text-center py-4">No messages yet.</div><?php endif; ?>
    <?php foreach ($messages as $m): ?>
      <div class="list-group-item <?= $m['is_read'] ? '' : 'bg-light' ?>">
        <div class="d-flex flex-wrap gap-2 align-items-center mb-1">
          <strong><?= e($m['name']) ?></strong>
          <a href="tel:+<?= e(phone_to_intl($m['phone'])) ?>"><?= e($m['phone']) ?></a>
          <a class="btn btn-sm btn-outline-gold" href="<?= e(whatsapp_link('Assalam o Alaikum ' . $m['name'] . ', this is ' . setting('store_name', '') . ' replying to your message.', $m['phone'])) ?>" target="_blank" rel="noopener">WhatsApp</a>
          <?php if ($m['email']): ?><a href="mailto:<?= e($m['email']) ?>"><?= e($m['email']) ?></a><?php endif; ?>
          <span class="ms-auto small text-secondary"><?= e(format_date($m['created_at'])) ?><?= $m['is_read'] ? '' : ' &middot; <span class="badge text-bg-warning">New</span>' ?></span>
        </div>
        <p class="mb-2" style="white-space:pre-wrap"><?= e($m['message']) ?></p>
        <div class="d-flex gap-2">
          <?php if (!$m['is_read']): ?><form method="post"><?= Csrf::field() ?><input type="hidden" name="id" value="<?= (int) $m['id'] ?>"><button class="btn btn-sm btn-outline-dark" name="action" value="read">Mark as read</button></form><?php endif; ?>
          <?php if (Auth::isOwner()): ?><form method="post"><?= Csrf::field() ?><input type="hidden" name="id" value="<?= (int) $m['id'] ?>"><button class="btn btn-sm btn-outline-danger" name="action" value="delete" data-confirm="Delete this message?">Delete</button></form><?php endif; ?>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
  <?php if ($pg['pages'] > 1): ?><div class="card-body border-top"><?= pagination_links($pg) ?></div><?php endif; ?>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
