<?php
/** Branded 404 page. Also used by render_404() and the .htaccess ErrorDocument. */
declare(strict_types=1);

if (!defined('ROOT_PATH')) {
    require_once __DIR__ . '/includes/bootstrap.php';
}
http_response_code(404);
$pageTitle = 'Page not found';
$metaDescription = 'The page you were looking for does not exist.';
require ROOT_PATH . '/includes/header.php';
?>
<div class="container error-page">
  <div class="code" aria-hidden="true">404</div>
  <h1 class="mt-2">Page not found</h1>
  <?= divider() ?>
  <p class="text-muted-js">That item may have sold out or moved. Try the collection or ask us on WhatsApp.</p>
  <div class="d-flex flex-wrap gap-2 justify-content-center mt-3">
    <a class="btn btn-gold" href="<?= e(url('shop.php')) ?>">Browse the shop</a>
    <a class="btn btn-outline-gold" href="<?= e(url('')) ?>">Go home</a>
  </div>
</div>
<?php require ROOT_PATH . '/includes/footer.php'; ?>
