<?php
/**
 * Product card partial. Expects $p (row from Product::search/latest/...).
 * Charcoal surface, 3:4 image, badges for New / Sale / Sold Out / Low.
 */
declare(strict_types=1);

$pStock = (int) ($p['total_stock'] ?? 0);
$pState = stock_state($pStock);
$pSale = is_on_sale($p);
?>
<article class="product-card <?= $pStock <= 0 ? 'soldout' : '' ?>">
  <a class="media" href="<?= e(product_url($p)) ?>" tabindex="-1" aria-hidden="true">
    <img src="<?= e(image_url($p['thumb_path'] ?: $p['image_path'])) ?>" alt="" width="600" height="800" loading="lazy" decoding="async">
    <div class="badges">
      <?php if ($pStock <= 0): ?><span class="badge-js soldout">Sold Out</span>
      <?php else: ?>
        <?php if ($pSale): ?><span class="badge-js sale">Sale -<?= discount_percent($p) ?>%</span><?php endif; ?>
        <?php if (is_new_product($p)): ?><span class="badge-js new">New</span><?php endif; ?>
        <?php if ($pState['key'] === 'low'): ?><span class="badge-js low"><?= e($pState['label']) ?></span><?php endif; ?>
      <?php endif; ?>
    </div>
  </a>
  <div class="body">
    <?php if (!empty($p['brand'])): ?><span class="brand-label"><?= e($p['brand']) ?></span><?php endif; ?>
    <a class="name" href="<?= e(product_url($p)) ?>"><?= e($p['name']) ?></a>
    <span class="small text-muted-js"><?= e($p['subcategory_name'] ?? '') ?><?= !empty($p['fabric']) ? ' &middot; ' . e($p['fabric']) : '' ?></span>
    <div class="price-wrap">
      <span class="price"><?= e(money($p['price'] ?? effective_price($p))) ?><?php if (($p['sale_unit'] ?? '') === 'meter'): ?> <span class="unit">/ meter</span><?php endif; ?></span>
      <?php if ($pSale): ?><span class="price-old"><?= e(money($p['base_price'])) ?></span><?php endif; ?>
    </div>
  </div>
</article>
