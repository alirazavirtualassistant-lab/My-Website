<?php
/**
 * Session shopping cart keyed by variant id. Prices and stock are always
 * re-read from the database; the browser is never trusted for either.
 */
declare(strict_types=1);

final class Cart
{
    private const KEY = 'cart';

    /** Raw map of variant_id => quantity. */
    private static function raw(): array
    {
        return $_SESSION[self::KEY] ?? [];
    }

    private static function store(array $cart): void
    {
        $_SESSION[self::KEY] = $cart;
    }

    /** Adds units of a variant after checking it is live and in stock. */
    public static function add(int $variantId, int $qty): array
    {
        $qty = max(1, min(99, $qty));
        $v = Variant::find($variantId);
        if (!$v || !Variant::isLive($v)) {
            return ['ok' => false, 'message' => 'That item is no longer available.'];
        }
        $cart = self::raw();
        $wanted = ($cart[$variantId] ?? 0) + $qty;
        $stock = (int) $v['stock_quantity'];
        if ($stock <= 0) {
            return ['ok' => false, 'message' => 'Sorry, this item is out of stock.'];
        }
        if ($wanted > $stock) {
            $wanted = $stock;
            $cart[$variantId] = $wanted;
            self::store($cart);
            return ['ok' => true, 'message' => "Only $stock left, so your cart now holds $stock.", 'count' => self::count()];
        }
        $cart[$variantId] = $wanted;
        self::store($cart);
        return ['ok' => true, 'message' => 'Added to your cart.', 'count' => self::count()];
    }

    /** Sets a quantity (0 removes). Caps at available stock. */
    public static function update(int $variantId, int $qty): array
    {
        $cart = self::raw();
        if ($qty <= 0) {
            unset($cart[$variantId]);
            self::store($cart);
            return ['ok' => true, 'message' => 'Item removed.'];
        }
        $v = Variant::find($variantId);
        if (!$v || !Variant::isLive($v)) {
            unset($cart[$variantId]);
            self::store($cart);
            return ['ok' => false, 'message' => 'That item is no longer available and was removed.'];
        }
        $stock = (int) $v['stock_quantity'];
        $message = 'Cart updated.';
        if ($qty > $stock) {
            $qty = $stock;
            $message = $stock > 0 ? "Only $stock left; quantity adjusted." : 'That item just sold out and was removed.';
        }
        if ($qty <= 0) {
            unset($cart[$variantId]);
        } else {
            $cart[$variantId] = min(99, $qty);
        }
        self::store($cart);
        return ['ok' => true, 'message' => $message];
    }

    public static function remove(int $variantId): void
    {
        $cart = self::raw();
        unset($cart[$variantId]);
        self::store($cart);
    }

    public static function clear(): void
    {
        unset($_SESSION[self::KEY]);
    }

    /** Total units in the cart (for the header badge). */
    public static function count(): int
    {
        return (int) array_sum(self::raw());
    }

    /**
     * Cart lines with fresh product data. Lines whose variant disappeared
     * are dropped silently. Each line: variant, product fields, qty, price,
     * line_total, stock, label, image.
     */
    public static function items(): array
    {
        $cart = self::raw();
        if (!$cart) {
            return [];
        }
        $items = [];
        foreach ($cart as $variantId => $qty) {
            $v = Variant::find((int) $variantId);
            if (!$v || !Variant::isLive($v)) {
                unset($cart[$variantId]);
                continue;
            }
            $image = Database::fetch(
                'SELECT thumb_path, image_path FROM product_images WHERE product_id = :id ORDER BY is_primary DESC, sort_order LIMIT 1',
                ['id' => (int) $v['product_id']]
            );
            $price = effective_price($v);
            $items[] = [
                'variant_id'   => (int) $variantId,
                'product_id'   => (int) $v['product_id'],
                'name'         => $v['product_name'],
                'slug'         => $v['product_slug'],
                'label'        => Variant::label($v),
                'sku'          => $v['sku'],
                'sale_unit'    => $v['sale_unit'],
                'qty'          => (int) $qty,
                'price'        => $price,
                'base_price'   => (float) $v['base_price'],
                'line_total'   => round($price * (int) $qty, 2),
                'stock'        => (int) $v['stock_quantity'],
                'image'        => $image['thumb_path'] ?? ($image['image_path'] ?? null),
            ];
        }
        self::store($cart);
        return $items;
    }

    public static function subtotal(?array $items = null): float
    {
        $items ??= self::items();
        return round(array_sum(array_column($items, 'line_total')), 2);
    }

    /** Delivery charge from settings, free above the threshold. */
    public static function deliveryCharge(float $subtotal): float
    {
        if ($subtotal <= 0) {
            return 0.0;
        }
        $charge = (float) setting('delivery_charge', 0);
        $free = (float) setting('free_delivery_threshold', 0);
        return ($free > 0 && $subtotal >= $free) ? 0.0 : $charge;
    }

    /**
     * Re-checks every line against current stock, adjusting quantities.
     * Returns messages describing any change (shown on cart/checkout).
     */
    public static function revalidate(): array
    {
        $messages = [];
        foreach (self::items() as $line) {
            if ($line['qty'] > $line['stock']) {
                $r = self::update($line['variant_id'], $line['stock']);
                $messages[] = $line['name'] . ' (' . $line['label'] . '): ' . $r['message'];
            }
        }
        return $messages;
    }
}
