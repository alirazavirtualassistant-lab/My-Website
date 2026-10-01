<?php
/**
 * Store settings (owner only): details, WhatsApp number, delivery charge,
 * free-delivery threshold, low-stock threshold, homepage banner, opening
 * hours, policies, social links. Read everywhere via setting().
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
Auth::requireOwner();
$pageTitle = 'Settings';

$fields = [
    'Store details' => [
        'store_name' => ['Store name', 'text'], 'store_short_name' => ['Short name (header)', 'text'], 'proprietor' => ['Proprietor', 'text'],
        'tagline' => ['Tagline', 'text'], 'phone' => ['Phone (as shown)', 'text'], 'phone_intl' => ['Phone, international format', 'text'],
        'whatsapp_number' => ['WhatsApp number (digits, e.g. 923454371509)', 'text'], 'email' => ['Email', 'email'],
        'address' => ['Address', 'text'], 'city' => ['City', 'text'], 'map_embed_url' => ['Google Maps embed URL', 'url'], 'opening_hours' => ['Opening hours (one line per entry)', 'textarea'],
    ],
    'Selling' => [
        'delivery_charge' => ['Delivery charge (Rs.)', 'number'], 'free_delivery_threshold' => ['Free delivery above (Rs., 0 = never)', 'number'],
        'low_stock_threshold' => ['Low-stock threshold (units)', 'number'], 'currency_prefix' => ['Currency prefix', 'text'],
    ],
    'Homepage banner' => [
        'banner_heading' => ['Heading', 'text'], 'banner_subheading' => ['Sub-heading (italic line)', 'text'], 'banner_text' => ['Short text', 'textarea'],
        'banner_button_text' => ['Button text', 'text'], 'banner_button_link' => ['Button link (e.g. shop.php?subcategory=party-wear)', 'text'],
    ],
    'Policies & SEO' => [
        'delivery_policy' => ['Delivery policy', 'textarea'], 'exchange_policy' => ['Exchange & return policy', 'textarea'],
        'privacy_policy' => ['Privacy policy', 'textarea'], 'about_text' => ['About us text', 'textarea'], 'meta_description' => ['Default meta description', 'textarea'],
    ],
    'Social links' => ['facebook_url' => ['Facebook URL', 'url'], 'instagram_url' => ['Instagram URL', 'url'], 'tiktok_url' => ['TikTok URL', 'url']],
];

if (is_post()) {
    $v = new Validator($_POST);
    $v->required('store_name', 'Store name')->max('store_name', 120)->required('phone', 'Phone')
      ->regex('whatsapp_number', '/^\d{10,15}$/', 'WhatsApp number must be digits only, e.g. 923454371509.')
      ->numeric('delivery_charge')->numeric('free_delivery_threshold')->integer('low_stock_threshold')->between('low_stock_threshold', 0, 1000)
      ->email('email');
    foreach (['map_embed_url', 'facebook_url', 'instagram_url', 'tiktok_url'] as $u) {
        $v->custom($u, fn($val) => $val === '' || $val === null || filter_var($val, FILTER_VALIDATE_URL), ucfirst(str_replace('_', ' ', $u)) . ' must be a full URL starting with https://');
    }
    if ($v->passes()) {
        $pairs = [];
        foreach ($fields as $group) {
            foreach ($group as $key => $meta) {
                $pairs[$key] = mb_substr(post($key), 0, 5000);
            }
        }
        // Banner image upload (optional, same validation as product images).
        if (!empty($_FILES['banner_image']['name'])) {
            $tmpFiles = ['name' => [$_FILES['banner_image']['name']], 'type' => [$_FILES['banner_image']['type']], 'tmp_name' => [$_FILES['banner_image']['tmp_name']], 'error' => [$_FILES['banner_image']['error']], 'size' => [$_FILES['banner_image']['size']]];
            $uploader = new ImageUploader(0); // stored under uploads/products/0 (banner)
            $saved = $uploader->handle($tmpFiles);
            if ($saved) {
                $pairs['banner_image'] = $saved[0]['image_path'];
            }
            foreach ($uploader->errors() as $m) {
                flash('warning', $m);
            }
        }
        if (isset($_POST['remove_banner'])) {
            $pairs['banner_image'] = '';
        }
        Settings::saveMany($pairs);
        flash('success', 'Settings saved.');
        redirect(url('admin/settings.php'));
    }
    flash('danger', implode(' ', $v->errors()));
    remember_old($_POST);
    redirect(url('admin/settings.php'));
}
$all = Settings::all();
require __DIR__ . '/partials/topbar.php';
?>
<form method="post" enctype="multipart/form-data">
  <?= Csrf::field() ?>
  <div class="row g-4">
    <?php foreach ($fields as $groupName => $group): ?>
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header"><?= e($groupName) ?></div>
          <div class="card-body">
            <?php foreach ($group as $key => [$label, $type]): $value = (string) old($key, $all[$key] ?? ''); ?>
              <div class="mb-3">
                <label class="form-label" for="<?= e($key) ?>"><?= e($label) ?></label>
                <?php if ($type === 'textarea'): ?>
                  <textarea class="form-control" id="<?= e($key) ?>" name="<?= e($key) ?>" rows="3"><?= e($value) ?></textarea>
                <?php else: ?>
                  <input class="form-control" id="<?= e($key) ?>" name="<?= e($key) ?>" type="<?= $type === 'number' ? 'number' : 'text' ?>" <?= $type === 'number' ? 'min="0" step="1"' : '' ?> value="<?= e($value) ?>">
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
            <?php if ($groupName === 'Homepage banner'): ?>
              <div class="mb-2">
                <label class="form-label" for="banner_image">Banner image (JPEG/PNG/WebP, portrait 4:5 looks best)</label>
                <?php if (!empty($all['banner_image'])): ?><div class="mb-2"><img src="<?= e(image_url($all['banner_image'])) ?>" alt="" style="max-height:160px;border-radius:4px"><div class="form-check mt-1"><input class="form-check-input" type="checkbox" name="remove_banner" id="remove_banner"><label class="form-check-label small" for="remove_banner">Remove banner image (uses the newest product photo instead)</label></div></div><?php endif; ?>
                <input class="form-control" type="file" id="banner_image" name="banner_image" accept="image/jpeg,image/png,image/webp">
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
  <div class="mt-4 d-flex gap-2"><button class="btn btn-gold">Save settings</button><a class="btn btn-outline-dark" href="<?= e(url('')) ?>" target="_blank" rel="noopener">Preview website</a></div>
</form>
<?php clear_old(); require __DIR__ . '/partials/footer.php'; ?>
