<?php
/** Admin layout closer. Add page JS via $extraScripts (array of URLs) before including. */
declare(strict_types=1);
?>
  </main>
  <footer class="admin-footer">
    <?= e(setting('store_name', 'Jalal Sons Cloth House')) ?> &middot; <?= date('Y') ?>
  </footer>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<?php foreach (($extraScripts ?? []) as $src): ?>
<script src="<?= e($src) ?>"></script>
<?php endforeach; ?>
<script src="<?= e(asset('assets/js/admin.js')) ?>"></script>
</body>
</html>
