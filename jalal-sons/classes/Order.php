<?php
/**
 * Orders from the web (COD), the counter (shop sale) and WhatsApp.
 * Placing an order deducts stock atomically in one transaction; cancelling
 * or returning restores it exactly once.
 */
declare(strict_types=1);

final class Order
{
    public const STATUSES = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled', 'returned'];
    public const CHANNELS = ['web' => 'Website', 'shop' => 'Shop (walk-in)', 'whatsapp' => 'WhatsApp'];
    public const PAYMENT_METHODS = ['cod' => 'Cash on Delivery', 'cash' => 'Cash', 'bank_transfer' => 'Bank Transfer'];
    /** Orders in these states do not count as sales. */
    public const NOT_SOLD = "('cancelled','returned')";

    /**
     * Places an order.
     *
     * @param array $customer name, phone, address, city, notes
     * @param array $lines    list of ['variant_id' => int, 'quantity' => int, 'unit_price' => ?float (admin override)]
     * @param array $opts     channel, payment_method, payment_status, status, delivery_charge, discount, admin_id
     * @return array          the saved order row
     * @throws StockException when any line cannot be fulfilled (whole order rolled back)
     * @throws InvalidArgumentException for an empty or invalid cart
     */
    public static function place(array $customer, array $lines, array $opts = []): array
    {
        if (!$lines) {
            throw new InvalidArgumentException('The order has no items.');
        }
        $channel = array_key_exists($opts['channel'] ?? '', self::CHANNELS) ? $opts['channel'] : 'web';
        $allowOverride = $channel !== 'web'; // only admins may set a custom price

        return Database::transaction(function () use ($customer, $lines, $opts, $channel, $allowOverride): array {
            $adminId = isset($opts['admin_id']) ? (int) $opts['admin_id'] : null;
            $orderId = self::insertShell($customer, $channel, $opts, $adminId);

            $subtotal = 0.0;
            foreach ($lines as $line) {
                $variantId = (int) ($line['variant_id'] ?? 0);
                $qty = (int) ($line['quantity'] ?? 0);
                if ($variantId <= 0 || $qty <= 0 || $qty > 999) {
                    throw new InvalidArgumentException('Invalid quantity.');
                }
                $v = Variant::find($variantId);
                if (!$v || ($channel === 'web' && !Variant::isLive($v))) {
                    throw new InvalidArgumentException('An item in your cart is no longer available.');
                }
                // Server-side price: never from the browser. Admin may override for shop sales.
                $price = effective_price($v);
                if ($allowOverride && isset($line['unit_price']) && $line['unit_price'] !== '' && is_numeric($line['unit_price'])) {
                    $price = max(0, round((float) $line['unit_price'], 2));
                }
                $name = $v['product_name'] . ' (' . Variant::label($v) . ')';

                // Atomic deduction: fails the whole order when stock is short.
                Variant::deductForSale($variantId, $qty, $orderId, $adminId, $name);

                $lineTotal = round($price * $qty, 2);
                $subtotal += $lineTotal;
                Database::insert('order_items', [
                    'order_id'      => $orderId,
                    'product_id'    => (int) $v['product_id'],
                    'variant_id'    => $variantId,
                    'product_name'  => $v['product_name'],
                    'variant_label' => Variant::label($v),
                    'sku'           => $v['sku'],
                    'unit_price'    => $price,
                    'quantity'      => $qty,
                    'line_total'    => $lineTotal,
                ]);
            }

            $delivery = $channel === 'web'
                ? Cart::deliveryCharge($subtotal)
                : max(0.0, (float) ($opts['delivery_charge'] ?? 0));
            $discount = $allowOverride ? min($subtotal, max(0.0, (float) ($opts['discount'] ?? 0))) : 0.0;
            $total = round($subtotal + $delivery - $discount, 2);

            Database::update('orders', [
                'subtotal'        => round($subtotal, 2),
                'delivery_charge' => $delivery,
                'discount'        => $discount,
                'total'           => $total,
            ], $orderId);

            return self::find($orderId);
        });
    }

    /** Inserts the order header with a unique daily order number. */
    private static function insertShell(array $customer, string $channel, array $opts, ?int $adminId): int
    {
        $method = array_key_exists($opts['payment_method'] ?? '', self::PAYMENT_METHODS) ? $opts['payment_method'] : ($channel === 'web' ? 'cod' : 'cash');
        $status = in_array($opts['status'] ?? '', self::STATUSES, true) ? $opts['status'] : ($channel === 'shop' ? 'delivered' : 'pending');
        $payStatus = ($opts['payment_status'] ?? '') === 'paid' ? 'paid' : ($channel === 'shop' ? 'paid' : 'unpaid');

        // Retry on a duplicate order number (two orders in the same instant).
        for ($try = 0; $try < 5; $try++) {
            try {
                return Database::insert('orders', [
                    'order_number'        => self::nextNumber(),
                    'channel'             => $channel,
                    'customer_name'       => mb_substr(trim((string) ($customer['name'] ?? 'Walk-in customer')), 0, 120) ?: 'Walk-in customer',
                    'phone'               => mb_substr(trim((string) ($customer['phone'] ?? '')), 0, 20),
                    'address'             => mb_substr(trim((string) ($customer['address'] ?? '')), 0, 255) ?: null,
                    'city'                => mb_substr(trim((string) ($customer['city'] ?? '')), 0, 80) ?: null,
                    'notes'               => trim((string) ($customer['notes'] ?? '')) ?: null,
                    'payment_method'      => $method,
                    'payment_status'      => $payStatus,
                    'status'              => $status,
                    'created_by_admin_id' => $adminId,
                ]);
            } catch (PDOException $e) {
                if ((int) ($e->errorInfo[1] ?? 0) !== 1062 || $try === 4) {
                    throw $e;
                }
            }
        }
        throw new RuntimeException('Could not allocate an order number.');
    }

    /**
     * JS-YYMMDD-0001, sequence restarts each day. The counter row in
     * order_sequences is incremented atomically (row lock held until the
     * order commits), so simultaneous orders get distinct numbers without
     * deadlocks. The unique key + retry in insertShell() is the safety net.
     */
    private static function nextNumber(): string
    {
        Database::run(
            'INSERT INTO order_sequences (seq_date, last_number) VALUES (CURDATE(), LAST_INSERT_ID(1))
             ON DUPLICATE KEY UPDATE last_number = LAST_INSERT_ID(last_number + 1)'
        );
        $n = (int) Database::fetchColumn('SELECT LAST_INSERT_ID()');
        return 'JS-' . date('ymd') . '-' . str_pad((string) $n, 4, '0', STR_PAD_LEFT);
    }

    // ------------------------------------------------------------ reads

    public static function find(int $id): ?array
    {
        return Database::fetch(
            'SELECT o.*, a.name AS admin_name FROM orders o LEFT JOIN admins a ON a.id = o.created_by_admin_id WHERE o.id = :id',
            ['id' => $id]
        );
    }

    public static function findByNumber(string $number): ?array
    {
        return Database::fetch('SELECT * FROM orders WHERE order_number = :n', ['n' => $number]);
    }

    public static function items(int $orderId): array
    {
        return Database::fetchAll(
            'SELECT oi.*, p.slug AS product_slug,
                    (SELECT thumb_path FROM product_images i WHERE i.product_id = oi.product_id ORDER BY is_primary DESC, sort_order LIMIT 1) AS thumb_path
             FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id
             WHERE oi.order_id = :id ORDER BY oi.id',
            ['id' => $orderId]
        );
    }

    /** Admin list with filters: status, channel, q (order number / phone / name), from, to. */
    public static function list(array $f, int $page = 1, int $perPage = 20): array
    {
        $where = ['1=1'];
        $params = [];
        if (!empty($f['status']) && in_array($f['status'], self::STATUSES, true)) {
            $where[] = 'o.status = :status';
            $params['status'] = $f['status'];
        }
        if (!empty($f['channel']) && array_key_exists($f['channel'], self::CHANNELS)) {
            $where[] = 'o.channel = :channel';
            $params['channel'] = $f['channel'];
        }
        if (!empty($f['q'])) {
            $where[] = '(o.order_number LIKE :q1 OR o.phone LIKE :q2 OR o.customer_name LIKE :q3)';
            // Native prepared statements need a distinct placeholder per use.
            $params['q1'] = $params['q2'] = $params['q3'] = '%' . $f['q'] . '%';
        }
        if (!empty($f['from'])) {
            $where[] = 'o.created_at >= :from';
            $params['from'] = $f['from'] . ' 00:00:00';
        }
        if (!empty($f['to'])) {
            $where[] = 'o.created_at <= :to';
            $params['to'] = $f['to'] . ' 23:59:59';
        }
        $whereSql = implode(' AND ', $where);
        $total = (int) Database::fetchColumn("SELECT COUNT(*) FROM orders o WHERE $whereSql", $params);
        $pg = paginate($total, $page, $perPage);
        $items = Database::fetchAll(
            "SELECT o.*, (SELECT SUM(quantity) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
             FROM orders o WHERE $whereSql ORDER BY o.created_at DESC, o.id DESC LIMIT {$pg['per_page']} OFFSET {$pg['offset']}",
            $params
        );
        return ['items' => $items, 'pagination' => $pg];
    }

    public static function pendingWebCount(): int
    {
        return (int) Database::fetchColumn("SELECT COUNT(*) FROM orders WHERE status = 'pending' AND channel = 'web'");
    }

    // ------------------------------------------------------------ status changes

    /**
     * Changes status. Moving INTO cancelled/returned restores stock once;
     * moving back OUT of them (rare correction) deducts it again.
     */
    public static function updateStatus(int $id, string $status, int $adminId): void
    {
        if (!in_array($status, self::STATUSES, true)) {
            throw new InvalidArgumentException('Unknown status.');
        }
        Database::transaction(function () use ($id, $status, $adminId): void {
            $order = Database::fetch('SELECT * FROM orders WHERE id = :id FOR UPDATE', ['id' => $id]);
            if (!$order || $order['status'] === $status) {
                return;
            }
            $wasVoid = in_array($order['status'], ['cancelled', 'returned'], true);
            $willBeVoid = in_array($status, ['cancelled', 'returned'], true);
            $items = self::items($id);

            if ($willBeVoid && !$wasVoid && $order['stock_restored_at'] === null) {
                foreach ($items as $it) {
                    if ($it['variant_id']) {
                        Variant::restore((int) $it['variant_id'], (int) $it['quantity'], $status, $id, $adminId);
                    }
                }
                Database::update('orders', ['status' => $status, 'stock_restored_at' => date('Y-m-d H:i:s')], $id);
                return;
            }
            if (!$willBeVoid && $wasVoid && $order['stock_restored_at'] !== null) {
                // Re-activating a cancelled order: take the stock again.
                foreach ($items as $it) {
                    if ($it['variant_id']) {
                        Variant::deductForSale((int) $it['variant_id'], (int) $it['quantity'], $id, $adminId, $it['product_name']);
                    }
                }
                Database::update('orders', ['status' => $status, 'stock_restored_at' => null], $id);
                return;
            }
            Database::update('orders', ['status' => $status], $id);
        });
    }

    public static function updatePayment(int $id, string $paymentStatus): void
    {
        Database::update('orders', ['payment_status' => $paymentStatus === 'paid' ? 'paid' : 'unpaid'], $id);
    }

    /** Pre-filled WhatsApp text summarising an order (customer -> store). */
    public static function whatsappSummary(array $order, array $items): string
    {
        $lines = ["Assalam o Alaikum, I have placed order {$order['order_number']} on " . setting('store_name', 'Jalal Sons') . ':'];
        foreach ($items as $it) {
            $lines[] = "- {$it['product_name']} ({$it['variant_label']}) x{$it['quantity']} = " . money($it['line_total']);
        }
        $lines[] = 'Total: ' . money($order['total']) . ' (' . (self::PAYMENT_METHODS[$order['payment_method']] ?? $order['payment_method']) . ')';
        $lines[] = 'Name: ' . $order['customer_name'] . ', Phone: ' . $order['phone'];
        if ($order['address']) {
            $lines[] = 'Address: ' . $order['address'] . ($order['city'] ? ', ' . $order['city'] : '');
        }
        return implode("\n", $lines);
    }
}
