<?php
/**
 * Product variants (size + color) hold the stock. Every stock change goes
 * through this class so stock_movements always has a matching audit row.
 */
declare(strict_types=1);

final class Variant
{
    public const REASONS = ['initial', 'restock', 'sale', 'cancel_restore', 'return', 'adjustment'];

    /** Variant joined with its product (name, prices, unit, live flags). */
    public static function find(int $id): ?array
    {
        return Database::fetch(
            'SELECT v.*, p.name AS product_name, p.slug AS product_slug, p.base_price, p.sale_price, p.sale_unit,
                    p.is_active, p.deleted_at, p.category_id, p.subcategory_id,
                    c.is_active AS category_active, s.is_active AS subcategory_active
             FROM product_variants v
             JOIN products p ON p.id = v.product_id
             JOIN categories c ON c.id = p.category_id
             JOIN subcategories s ON s.id = p.subcategory_id
             WHERE v.id = :id',
            ['id' => $id]
        );
    }

    /** Variants of one product in a sensible size order. */
    public static function forProduct(int $productId): array
    {
        return Database::fetchAll(
            "SELECT * FROM product_variants WHERE product_id = :id
             ORDER BY FIELD(size,'XS','S','M','L','XL','XXL','Free Size','Unstitched'), size, color",
            ['id' => $productId]
        );
    }

    /** "M / Maroon", or just "Maroon" for unstitched items, or "Standard". */
    public static function label(array $v): string
    {
        $size = (string) ($v['size'] ?? '');
        $color = (string) ($v['color'] ?? '');
        if ($size === 'Unstitched' || $size === '') {
            return $color !== '' ? $color : 'Standard';
        }
        return $color !== '' && $color !== 'Standard' ? "$size / $color" : $size;
    }

    /** True when a variant can be bought on the storefront right now. */
    public static function isLive(array $v): bool
    {
        return (int) $v['is_active'] === 1 && $v['deleted_at'] === null
            && (int) $v['category_active'] === 1 && (int) $v['subcategory_active'] === 1;
    }

    /**
     * Synchronises a product's variants with the rows submitted from the
     * product form. Rows carry an optional "id" (existing) and size, color,
     * color_hex, stock_quantity, sku. Missing existing rows are deleted
     * (only when they have never been sold; otherwise stock is set to 0).
     */
    public static function sync(int $productId, array $rows, int $adminId, string $newReason = 'initial'): void
    {
        $existing = [];
        foreach (self::forProduct($productId) as $v) {
            $existing[(int) $v['id']] = $v;
        }
        $product = Database::fetch('SELECT sku FROM products WHERE id = :id', ['id' => $productId]);
        $keep = [];

        foreach ($rows as $i => $r) {
            $size = trim((string) ($r['size'] ?? '')) ?: 'Unstitched';
            $color = trim((string) ($r['color'] ?? '')) ?: 'Standard';
            $hex = trim((string) ($r['color_hex'] ?? ''));
            $hex = preg_match('/^#[0-9a-fA-F]{6}$/', $hex) ? strtoupper($hex) : null;
            $qty = max(0, (int) ($r['stock_quantity'] ?? 0));
            $sku = strtoupper(trim((string) ($r['sku'] ?? '')));
            if ($sku === '') {
                $sku = self::suggestSku((string) ($product['sku'] ?? 'JS'), $size, $color);
            }
            $id = (int) ($r['id'] ?? 0);

            if ($id && isset($existing[$id])) {
                $old = $existing[$id];
                Database::update('product_variants', [
                    'size' => $size, 'color' => $color, 'color_hex' => $hex, 'sku' => $sku, 'stock_quantity' => $qty,
                ], $id);
                $delta = $qty - (int) $old['stock_quantity'];
                if ($delta !== 0) {
                    self::logMovement($id, $delta, 'adjustment', $adminId, 'Stock edited on product form');
                }
                $keep[] = $id;
            } else {
                $newId = Database::insert('product_variants', [
                    'product_id' => $productId, 'size' => $size, 'color' => $color, 'color_hex' => $hex,
                    'stock_quantity' => $qty, 'sku' => $sku,
                ]);
                if ($qty > 0) {
                    self::logMovement($newId, $qty, $newReason === 'initial' ? 'initial' : 'restock', $adminId, 'Opening stock');
                }
                $keep[] = $newId;
            }
        }

        // Remove variants that were deleted on the form.
        foreach ($existing as $id => $v) {
            if (in_array($id, $keep, true)) {
                continue;
            }
            $sold = (int) Database::fetchColumn('SELECT COUNT(*) FROM order_items WHERE variant_id = :id', ['id' => $id]);
            if ($sold > 0) {
                // Keep history intact: zero the stock instead of deleting.
                if ((int) $v['stock_quantity'] !== 0) {
                    self::logMovement($id, -(int) $v['stock_quantity'], 'adjustment', $adminId, 'Variant removed from form');
                }
                Database::update('product_variants', ['stock_quantity' => 0], $id);
            } else {
                Database::run('DELETE FROM product_variants WHERE id = :id', ['id' => $id]);
            }
        }
    }

    /** Builds a variant SKU like JS-PW-0001-M-MRN from the product SKU. */
    public static function suggestSku(string $productSku, string $size, string $color): string
    {
        $parts = [$productSku];
        if ($size !== 'Unstitched') {
            $parts[] = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $size) ?: 'STD');
        }
        // Colour code: first letter plus the next consonants, max 3 chars (Maroon -> MRN).
        $c = strtoupper(preg_replace('/[^A-Za-z]/', '', $color) ?: 'STD');
        $code = $c[0] . preg_replace('/[AEIOU]/', '', substr($c, 1));
        $parts[] = substr(strlen($code) >= 2 ? $code : $c, 0, 3);
        $sku = implode('-', $parts);
        // Guarantee uniqueness.
        $base = $sku;
        $i = 2;
        while (Database::fetch('SELECT id FROM product_variants WHERE sku = :s', ['s' => $sku])) {
            $sku = $base . '-' . $i++;
        }
        return $sku;
    }

    /**
     * Manual stock change (+/-) from the admin with a reason. Returns the
     * new quantity. Never lets stock go negative.
     */
    public static function adjustStock(int $variantId, int $delta, string $reason, ?int $adminId, string $note = ''): int
    {
        if (!in_array($reason, ['restock', 'adjustment', 'return', 'initial'], true)) {
            $reason = 'adjustment';
        }
        return Database::transaction(function () use ($variantId, $delta, $reason, $adminId, $note): int {
            $v = Database::fetch('SELECT stock_quantity FROM product_variants WHERE id = :id FOR UPDATE', ['id' => $variantId]);
            if (!$v) {
                throw new RuntimeException('Variant not found.');
            }
            $new = max(0, (int) $v['stock_quantity'] + $delta);
            $applied = $new - (int) $v['stock_quantity'];
            if ($applied !== 0) {
                Database::update('product_variants', ['stock_quantity' => $new], $variantId);
                self::logMovement($variantId, $applied, $reason, $adminId, $note);
            }
            return $new;
        });
    }

    /**
     * Atomic stock deduction for a sale. MUST run inside the order
     * transaction. Throws StockException when not enough units remain.
     */
    public static function deductForSale(int $variantId, int $qty, int $orderId, ?int $adminId, string $itemName): void
    {
        $affected = Database::run(
            'UPDATE product_variants SET stock_quantity = stock_quantity - :qty WHERE id = :id AND stock_quantity >= :qty2',
            ['qty' => $qty, 'id' => $variantId, 'qty2' => $qty]
        )->rowCount();
        if ($affected !== 1) {
            $available = (int) Database::fetchColumn('SELECT stock_quantity FROM product_variants WHERE id = :id', ['id' => $variantId]);
            throw new StockException($variantId, $available, $itemName, $qty);
        }
        self::logMovement($variantId, -$qty, 'sale', $adminId, null, $orderId);
    }

    /** Puts units back after a cancellation or return (inside a transaction). */
    public static function restore(int $variantId, int $qty, string $reason, int $orderId, ?int $adminId): void
    {
        Database::run('UPDATE product_variants SET stock_quantity = stock_quantity + :qty WHERE id = :id', ['qty' => $qty, 'id' => $variantId]);
        self::logMovement($variantId, $qty, $reason === 'return' ? 'return' : 'cancel_restore', $adminId, null, $orderId);
    }

    /** Writes one stock_movements row. */
    public static function logMovement(int $variantId, int $change, string $reason, ?int $adminId, ?string $note = null, ?int $orderId = null): void
    {
        Database::insert('stock_movements', [
            'variant_id' => $variantId,
            'change_qty' => $change,
            'reason'     => in_array($reason, self::REASONS, true) ? $reason : 'adjustment',
            'order_id'   => $orderId,
            'admin_id'   => $adminId ?: null,
            'note'       => $note ? mb_substr($note, 0, 255) : null,
        ]);
    }

    /** Recent movements for a product (edit page history). */
    public static function movements(int $productId, int $limit = 30): array
    {
        return Database::fetchAll(
            'SELECT m.*, v.size, v.color, a.name AS admin_name, o.order_number
             FROM stock_movements m
             JOIN product_variants v ON v.id = m.variant_id
             LEFT JOIN admins a ON a.id = m.admin_id
             LEFT JOIN orders o ON o.id = m.order_id
             WHERE v.product_id = :pid ORDER BY m.created_at DESC, m.id DESC LIMIT ' . (int) $limit,
            ['pid' => $productId]
        );
    }
}
