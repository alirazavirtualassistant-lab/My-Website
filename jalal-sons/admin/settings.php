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
    'Ads & income' => [
        'ads_enabled' => ['Show ads on the website (1 = yes, 0 = no)', 'number'],
        'adsense_client' => ['Google AdSense publisher id (ca-pub-XXXXXXXXXXXXXXXX)', 'text'],
        'adsense_slot_home_top' => ['AdSense slot id: homepage, under trust badges', 'text'],
        'adsense_slot_home_mid' => ['AdSense slot id: homepage, after New Arrivals', 'text'],
        'adsense_slot_shop_feed' => ['AdSense slot id: shop page, inside the product grid', 'text'],
        'adsense_slot_shop_side' => ['AdSense slot id: shop page, under filters (desktop)', 'text'],
        'adsense_slot_product_bottom' => ['AdSense slot id: product page, above related items', 'text'],
        'adsense_slot_footer' => ['AdSense slot id: above the footer (all pages)', 'text'],
        'sponsor_banner_link' => ['Sponsor banner link (sell this space to a brand)', 'url'],
        'sponsor_banner_alt' => ['Sponsor banner text / brand name', 'text'],
        'sponsor_banner_positions' => ['Sponsor banner positions (comma list of: home_top, home_mid, shop_feed, shop_side, product_bottom, footer)', 'text'],
    ],
];

if (is_post()) {
    $v = new Validator($_POST);
    $v->required('store_name', 'Store name')->max('store_name', 120)->required('phone', 'Phone')
      ->regex('whatsapp_number', '/^\d{10,15}$/', 'WhatsApp number must be digits only, e.g. 923454371509.')
      ->numeric('delivery_charge')->numeric('free_delivery_threshold')->integer('low_stock_threshold')->between('low_stock_threshold', 0, 1000)
      ->email('email')->in('ads_enabled', ['0', '1', ''])
      ->regex('adsense_client', '/^(ca-pub-\d{10,20})?$/', 'AdSense publisher id must look like ca-pub-1234567890123456.')
      ->regex('sponsor_banner_positions', '/^[a-z_,\s]*$/', 'Sponsor positions must be a comma-separated list.');
    foreach (['adsense_slot_home_top', 'adsense_slot_home_mid', 'adsense_slot_shop_feed', 'adsense_slot_shop_side', 'adsense_slot_product_bottom', 'adsense_slot_footer'] as $slot) {
        $v->regex($slot, '/^\d{6,16}$|^$/', 'AdSense slot ids are numbers only.');
    }
    foreach (['map_embed_url', 'facebook_url', 'instagram_url', 'tiktok_url', 'sponsor_banner_link'] as $u) {
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
        // Sponsor banner image (JPEG/PNG/WebP, 970x250 or similar landscape).
        if (!empty($_FILES['sponsor_banner_image']['name'])) {
            $sf = $_FILES['sponsor_banner_image'];
            $uploader = new ImageUploader(0);
            $saved = $uploader->handle(['name' => [$sf['name']], 'type' => [$sf['type']], 'tmp_name' => [$sf['tmp_name']], 'error' => [$sf['error']], 'size' => [$sf['size']]]);
            if ($saved) {
                $pairs['sponsor_banner_image'] = $saved[0]['image_path'];
            }
            foreach ($uploader->errors() as $m) {
                flash('warning', $m);
            }
        }
        if (isset($_POST['remove_sponsor_banner'])) {
            $pairs['sponsor_banner_image'] = '';
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
            <?php if ($groupName === 'Ads & income'): ?>
              <div class="alert alert-info small">
                <strong>How to earn:</strong> 1) Apply at <a href="https://www.google.com/adsense" target="_blank" rel="noopener">google.com/adsense</a> with this website, paste your publisher id and create one ad unit per position; the site also serves <code>/ads.txt</code> automatically.
                2) Or sell the sponsor banner space directly to a fabric brand or boutique and upload their banner below. Keep ads away from the Add to Cart button so they do not cost you sales.
              </div>
              <div class="mb-2">
                <label class="form-label" for="sponsor_banner_image">Sponsor banner image (landscape, e.g. 970 x 250)</label>
                <?php if (!empty($all['sponsor_banner_image'])): ?><div class="mb-2"><img src="<?= e(image_url($all['sponsor_banner_image'])) ?>" alt="" style="max-height:120px;border-radius:4px"><div class="form-check mt-1"><input class="form-check-input" type="checkbox" name="remove_sponsor_banner" id="remove_sponsor_banner"><label class="form-check-label small" for="remove_sponsor_banner">Remove sponsor banner</label></div></div><?php endif; ?>
                <input class="form-control" type="file" id="sponsor_banner_image" name="sponsor_banner_image" accept="image/jpeg,image/png,image/webp">
              </div>
            <?php endif; ?>
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
