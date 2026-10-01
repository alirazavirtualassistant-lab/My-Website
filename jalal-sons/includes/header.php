<?php
/**
 * Storefront layout opener: <head> with SEO/Open Graph/JSON-LD, top strip,
 * sticky header with navigation, search, cart badge, and off-canvas menu.
 *
 * Variables (set before including):
 *   $pageTitle       string  page title (store name appended)
 *   $metaDescription string  optional
 *   $metaImage       string  optional absolute image URL for Open Graph
 *   $ogType          string  optional, default "website"
 *   $jsonLd          array   optional extra JSON-LD object (e.g. Product)
 *   $bodyClass       string  optional
 *   $canonical       string  optional absolute URL
 */
declare(strict_types=1);

$storeName = (string) setting('store_name', 'Jalal Sons Cloth House');
$pageTitle = $pageTitle ?? $storeName;
$fullTitle = $pageTitle === $storeName ? $storeName . ' - ' . setting('tagline', '') : $pageTitle . ' - ' . $storeName;
$metaDescription = $metaDescription ?? (string) setting('meta_description', '');
$metaImage = $metaImage ?? url('assets/img/logo.svg');
$ogType = $ogType ?? 'website';
$canonical = $canonical ?? url(ltrim((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/'));
$navTree = Category::navTree();
$cartCount = Cart::count();
$flashes = get_flashes();

$storeLd = [
    '@context' => 'https://schema.org',
    '@type' => 'ClothingStore',
    'name' => $storeName,
    'url' => url(''),
    'telephone' => (string) setting('phone_intl', setting('phone', '')),
    'image' => url('assets/img/logo.svg'),
    'address' => ['@type' => 'PostalAddress', 'streetAddress' => (string) setting('address', ''), 'addressLocality' => (string) setting('city', 'Lahore'), 'addressCountry' => 'PK'],
    'priceRange' => 'Rs.',
];
?>
<!doctype html>
<html lang="en" data-bs-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?= e($fullTitle) ?></title>
<meta name="description" content="<?= e($metaDescription) ?>">
<link rel="canonical" href="<?= e($canonical) ?>">
<meta name="theme-color" content="#0B0B0C">
<?php if (ads_enabled() && adsense_client() !== ''): ?>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=<?= e(adsense_client()) ?>" crossorigin="anonymous"></script>
<?php endif; ?>
<meta property="og:type" content="<?= e($ogType) ?>">
<meta property="og:site_name" content="<?= e($storeName) ?>">
<meta property="og:title" content="<?= e($fullTitle) ?>">
<meta property="og:description" content="<?= e($metaDescription) ?>">
<meta property="og:image" content="<?= e($metaImage) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta name="twitter:card" content="summary_large_image">
<?php foreach (($ogExtra ?? []) as $prop => $val): ?>
<meta property="<?= e($prop) ?>" content="<?= e($val) ?>">
<?php endforeach; ?>
<link rel="icon" href="<?= e(url('assets/img/favicon.svg')) ?>" type="image/svg+xml">
<link rel="apple-touch-icon" href="<?= e(url('assets/img/logo.svg')) ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Jost:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="<?= e(asset('assets/css/theme.css')) ?>">
<script type="application/ld+json"><?= json_encode($storeLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?></script>
<?php if (!empty($jsonLd)): ?>
<script type="application/ld+json"><?= json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?></script>
<?php endif; ?>
</head>
<body class="<?= e($bodyClass ?? '') ?>" data-base-url="<?= e(url('')) ?>" data-csrf="<?= e(Csrf::token()) ?>">
<a class="visually-hidden-focusable" href="#main">Skip to content</a>

<?php if (setting('announcement_text')): ?>
<div class="announcement-bar"><?= e(setting('announcement_text')) ?></div>
<?php endif; ?>
<div class="top-strip d-none d-sm-block">
  <div class="container">
    <a href="<?= e(tel_link()) ?>"><?= icon('phone') ?> <?= e(setting('phone', '')) ?></a>
    <a href="<?= e(whatsapp_link('Assalam o Alaikum, I would like to ask about your collection.')) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> WhatsApp</a>
    <span class="ms-auto d-none d-md-inline"><?= e(setting('address', '')) ?></span>
  </div>
</div>

<header class="site-header">
  <div class="container header-row">
    <a class="brand" href="<?= e(url('')) ?>" aria-label="<?= e($storeName) ?> home">
      <img src="<?= e(url('assets/img/logo.svg')) ?>" alt="" width="46" height="46">
      <span class="brand-text"><span class="brand-name"><?= e(setting('store_short_name', 'Jalal Sons')) ?></span><span class="brand-sub">Cloth House</span></span>
    </a>

    <nav class="main-nav" aria-label="Main">
      <?php foreach ($navTree as $cat): ?>
        <?php if (count($navTree) === 1): ?>
          <?php foreach ($cat['subcategories'] as $sub): ?>
            <a href="<?= e(shop_url(['category' => $cat['slug'], 'subcategory' => $sub['slug']])) ?>"><?= e($sub['name']) ?></a>
          <?php endforeach; ?>
        <?php else: ?>
          <div class="dropdown">
            <a href="<?= e(shop_url(['category' => $cat['slug']])) ?>" class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><?= e($cat['name']) ?></a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="<?= e(shop_url(['category' => $cat['slug']])) ?>">All <?= e($cat['name']) ?></a></li>
              <?php foreach ($cat['subcategories'] as $sub): ?>
                <li><a class="dropdown-item" href="<?= e(shop_url(['category' => $cat['slug'], 'subcategory' => $sub['slug']])) ?>"><?= e($sub['name']) ?></a></li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>
      <?php endforeach; ?>
      <a href="<?= e(shop_url(['sort' => 'newest'])) ?>">New Arrivals</a>
      <a class="sale" href="<?= e(shop_url(['on_sale' => 1])) ?>">Sale</a>
      <a href="<?= e(url('contact.php')) ?>">Contact</a>
    </nav>

    <div class="header-actions">
      <form class="search-form" role="search" action="<?= e(url('shop.php')) ?>" method="get">
        <label class="visually-hidden" for="headerSearch">Search products</label>
        <input class="form-control form-control-sm" type="search" id="headerSearch" name="q" placeholder="Search..." value="<?= e(get('q')) ?>">
      </form>
      <a class="btn-icon d-none d-sm-inline-flex" href="<?= e(tel_link()) ?>" aria-label="Call us"><?= icon('phone') ?></a>
      <a class="btn-icon" href="<?= e(whatsapp_link('Assalam o Alaikum, I would like to ask about your collection.')) ?>" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><?= icon('whatsapp') ?></a>
      <a class="btn-icon" href="<?= e(url('cart.php')) ?>" aria-label="Cart, <?= $cartCount ?> items"><?= icon('cart') ?><span class="cart-count" data-cart-count data-count="<?= $cartCount ?>"><?= $cartCount ?: '' ?></span></a>
      <button class="btn-icon d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu" aria-label="Open menu"><?= icon('menu') ?></button>
    </div>
  </div>
</header>

<div class="offcanvas offcanvas-end" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
  <div class="offcanvas-header">
    <h2 class="offcanvas-title h6 mb-0" id="mobileMenuLabel">Menu</h2>
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <form role="search" action="<?= e(url('shop.php')) ?>" method="get" class="mb-3">
      <label class="visually-hidden" for="mobileSearch">Search products</label>
      <div class="input-group"><input class="form-control" type="search" id="mobileSearch" name="q" placeholder="Search products"><button class="btn btn-gold" type="submit" aria-label="Search"><?= icon('search') ?></button></div>
    </form>
    <nav class="nav flex-column" aria-label="Mobile">
      <?php foreach ($navTree as $cat): ?>
        <?php if (count($navTree) > 1): ?><a class="nav-link" href="<?= e(shop_url(['category' => $cat['slug']])) ?>"><?= e($cat['name']) ?></a><?php endif; ?>
        <?php foreach ($cat['subcategories'] as $sub): ?>
          <a class="nav-link <?= count($navTree) > 1 ? 'sub' : '' ?>" href="<?= e(shop_url(['category' => $cat['slug'], 'subcategory' => $sub['slug']])) ?>"><?= e($sub['name']) ?></a>
        <?php endforeach; ?>
      <?php endforeach; ?>
      <a class="nav-link" href="<?= e(shop_url(['sort' => 'newest'])) ?>">New Arrivals</a>
      <a class="nav-link" href="<?= e(shop_url(['on_sale' => 1])) ?>">Sale</a>
      <a class="nav-link" href="<?= e(url('about.php')) ?>">About</a>
      <a class="nav-link" href="<?= e(url('contact.php')) ?>">Contact</a>
    </nav>
    <div class="d-grid gap-2 mt-4">
      <a class="btn btn-outline-gold" href="<?= e(tel_link()) ?>"><?= icon('phone') ?> <?= e(setting('phone', '')) ?></a>
      <a class="btn btn-whatsapp" href="<?= e(whatsapp_link('Assalam o Alaikum, I would like to ask about your collection.')) ?>" target="_blank" rel="noopener"><?= icon('whatsapp') ?> Order on WhatsApp</a>
    </div>
  </div>
</div>

<main id="main">
<?php if ($flashes): ?>
  <div class="container mt-3">
    <?php foreach ($flashes as $f): ?>
      <div class="alert alert-<?= e($f['type']) ?> alert-dismissible fade show" role="alert"><?= e($f['message']) ?><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>
