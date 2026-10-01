<?php
/** Contact page: details, map, and a message form with CSRF and a honeypot field. */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$errors = [];
if (is_post()) {
    Csrf::check();
    if (post('website') !== '') { // honeypot
        redirect(url('contact.php'));
    }
    $v = new Validator($_POST);
    $v->required('name', 'Your name')->max('name', 120)->required('phone', 'Mobile number')->phone('phone')->email('email')
      ->required('message', 'Message')->min('message', 10)->max('message', 2000);
    // Simple rate limit: one message per minute per IP.
    $recent = (int) Database::fetchColumn('SELECT COUNT(*) FROM contact_messages WHERE ip_address = :ip AND created_at > (NOW() - INTERVAL 1 MINUTE)', ['ip' => client_ip()]);
    if ($recent > 0) {
        $v->addError('message', 'Please wait a minute before sending another message.');
    }
    if ($v->passes()) {
        Database::insert('contact_messages', ['name' => post('name'), 'phone' => normalize_phone(post('phone')), 'email' => post('email') ?: null, 'message' => post('message'), 'ip_address' => client_ip()]);
        clear_old();
        flash('success', 'Thank you! Your message has been received. We usually reply within a few hours during opening times.');
        redirect(url('contact.php'));
    }
    $errors = $v->errors();
    remember_old($_POST);
}
$pageTitle = 'Contact us';
$metaDescription = 'Visit or contact ' . setting('store_name', '') . ' at ' . setting('address', '') . '. Call ' . setting('phone', '') . ' or message us on WhatsApp.';
require __DIR__ . '/includes/header.php';
?>
<div class="container py-4">
  <div class="section-head"><span class="eyebrow">We would love to hear from you</span><h1>Contact us</h1></div>
  <?= divider() ?>
  <div class="row g-4">
    <div class="col-lg-5">
      <div class="card-dark h-100">
        <ul class="contact-list">
          <li><?= icon('pin') ?><div><strong>Address</strong><br><?= e(setting('address', '')) ?></div></li>
          <li><?= icon('phone') ?><div><strong>Phone</strong><br><a href="<?= e(tel_link()) ?>"><?= e(setting('phone', '')) ?></a></div></li>
          <li><?= icon('whatsapp') ?><div><strong>WhatsApp</strong><br><a href="<?= e(whatsapp_link('Assalam o Alaikum, I have a question.')) ?>" target="_blank" rel="noopener">+<?= e(phone_to_intl((string) setting('whatsapp_number', ''))) ?></a></div></li>
          <?php if (setting('email')): ?><li><?= icon('star') ?><div><strong>Email</strong><br><a href="mailto:<?= e(setting('email')) ?>"><?= e(setting('email')) ?></a></div></li><?php endif; ?>
          <li><?= icon('clock') ?><div><strong>Opening hours</strong><br><?= nl2br(e(setting('opening_hours', ''))) ?></div></li>
        </ul>
        <div class="map-frame mt-4"><iframe src="<?= e(setting('map_embed_url', '')) ?>" title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
      </div>
    </div>
    <div class="col-lg-7">
      <div class="card-dark">
        <h2 class="h5 mb-3">Send a message</h2>
        <?php if ($errors): ?><div class="alert alert-danger"><ul class="mb-0"><?php foreach ($errors as $m): ?><li><?= e($m) ?></li><?php endforeach; ?></ul></div><?php endif; ?>
        <form method="post" novalidate class="row g-3"><?= Csrf::field() ?>
          <div class="col-md-6"><label class="form-label" for="name">Name</label><input class="form-control" id="name" name="name" value="<?= e((string) old('name')) ?>" required></div>
          <div class="col-md-6"><label class="form-label" for="phone">Mobile number</label><input class="form-control" id="phone" name="phone" type="tel" placeholder="03XXXXXXXXX" value="<?= e((string) old('phone')) ?>" required></div>
          <div class="col-12"><label class="form-label" for="email">Email (optional)</label><input class="form-control" id="email" name="email" type="email" value="<?= e((string) old('email')) ?>"></div>
          <div class="col-12"><label class="form-label" for="message">Message</label><textarea class="form-control" id="message" name="message" rows="5" required><?= e((string) old('message')) ?></textarea></div>
          <div class="visually-hidden" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
          <div class="col-12 d-flex flex-wrap gap-2"><button class="btn btn-gold">Send message</button><a class="btn btn-whatsapp" href="<?= e(whatsapp_link('Assalam o Alaikum, I have a question.')) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> Or WhatsApp us</a></div>
        </form>
      </div>
    </div>
  </div>
</div>
<?php clear_old(); require __DIR__ . '/includes/footer.php'; ?>
