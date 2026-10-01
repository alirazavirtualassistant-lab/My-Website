<?php
/**
 * Sales and stock reporting. One definition of "sold" and "revenue" is
 * used everywhere: order_items on orders whose status is not cancelled
 * or returned (see Order::NOT_SOLD).
 */
declare(strict_types=1);

final class Report
{
    /** Date range for a dashboard period key: today | 7d | 30d | all. */
    public static function periodRange(string $period): array
    {
        return match ($period) {
            'today' => [date('Y-m-d 00:00:00'), null],
            '7d'    => [date('Y-m-d 00:00:00', strtotime('-6 days')), null],
            '30d'   => [date('Y-m-d 00:00:00', strtotime('-29 days')), null],
            default => [null, null],
        };
    }

    /** SQL fragment + params restricting orders to a date range/channel. */
    private static function orderFilter(?string $from, ?string $to, ?string $channel, string $alias = 'o'): array
    {
        $sql = " $alias.status NOT IN " . Order::NOT_SOLD;
        $params = [];
        if ($from) {
            $sql .= " AND $alias.created_at >= :from";
            $params['from'] = $from;
        }
        if ($to) {
            $sql .= " AND $alias.created_at <= :to";
            $params['to'] = $to;
        }
        if ($channel && array_key_exists($channel, Order::CHANNELS)) {
            $sql .= " AND $alias.channel = :channel";
            $params['channel'] = $channel;
        }
        return [$sql, $params];
    }

    /** Headline numbers for the dashboard cards. */
    public static function dashboard(string $period = 'all'): array
    {
        [$from, $to] = self::periodRange($period);
        [$filter, $params] = self::orderFilter($from, $to, null);
        $sales = Database::fetch(
            "SELECT COALESCE(SUM(oi.quantity),0) AS units, COALESCE(SUM(oi.line_total),0) AS revenue, COUNT(DISTINCT o.id) AS orders
             FROM orders o JOIN order_items oi ON oi.order_id = o.id WHERE $filter",
            $params
        );
        $low = (int) setting('low_stock_threshold', 3);
        return [
            'total_products'  => Product::count(),
            'active_products' => Product::count(true),
            'items_sold'      => (int) $sales['units'],
            'revenue'         => (float) $sales['revenue'],
            'orders'          => (int) $sales['orders'],
            'remaining_stock' => (int) Database::fetchColumn('SELECT COALESCE(SUM(v.stock_quantity),0) FROM product_variants v JOIN products p ON p.id = v.product_id WHERE p.deleted_at IS NULL'),
            'pending_orders'  => Order::pendingWebCount(),
            'low_stock_count' => (int) Database::fetchColumn(
                'SELECT COUNT(*) FROM product_variants v JOIN products p ON p.id = v.product_id WHERE p.deleted_at IS NULL AND p.is_active = 1 AND v.stock_quantity BETWEEN 1 AND :low',
                ['low' => $low]
            ),
            'out_of_stock_count' => (int) Database::fetchColumn(
                'SELECT COUNT(*) FROM product_variants v JOIN products p ON p.id = v.product_id WHERE p.deleted_at IS NULL AND p.is_active = 1 AND v.stock_quantity = 0'
            ),
        ];
    }

    /** Daily units and revenue for the last N days (zero-filled). */
    public static function salesByDay(int $days = 30): array
    {
        $from = date('Y-m-d 00:00:00', strtotime('-' . ($days - 1) . ' days'));
        [$filter, $params] = self::orderFilter($from, null, null);
        $rows = Database::fetchAll(
            "SELECT DATE(o.created_at) AS day, SUM(oi.quantity) AS units, SUM(oi.line_total) AS revenue
             FROM orders o JOIN order_items oi ON oi.order_id = o.id WHERE $filter GROUP BY DATE(o.created_at)",
            $params
        );
        $byDay = array_column($rows, null, 'day');
        $out = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = date('Y-m-d', strtotime("-$i days"));
            $out[] = [
                'day'     => $d,
                'label'   => date('j M', strtotime($d)),
                'units'   => (int) ($byDay[$d]['units'] ?? 0),
                'revenue' => (float) ($byDay[$d]['revenue'] ?? 0),
            ];
        }
        return $out;
    }

    public static function topSellers(int $limit = 5, string $period = 'all'): array
    {
        [$from, $to] = self::periodRange($period);
        [$filter, $params] = self::orderFilter($from, $to, null);
        return Database::fetchAll(
            "SELECT oi.product_id, oi.product_name, p.slug, p.sku, SUM(oi.quantity) AS units, SUM(oi.line_total) AS revenue,
                    (SELECT thumb_path FROM product_images i WHERE i.product_id = oi.product_id ORDER BY is_primary DESC, sort_order LIMIT 1) AS thumb_path
             FROM order_items oi JOIN orders o ON o.id = oi.order_id LEFT JOIN products p ON p.id = oi.product_id
             WHERE $filter GROUP BY oi.product_id, oi.product_name, p.slug, p.sku ORDER BY units DESC, revenue DESC LIMIT " . (int) $limit,
            $params
        );
    }

    /** Variants at or below the low-stock threshold (active products). */
    public static function lowStock(int $limit = 10): array
    {
        $low = (int) setting('low_stock_threshold', 3);
        return Database::fetchAll(
            'SELECT v.*, p.name AS product_name, p.slug FROM product_variants v JOIN products p ON p.id = v.product_id
             WHERE p.deleted_at IS NULL AND p.is_active = 1 AND v.stock_quantity <= :low
             ORDER BY v.stock_quantity ASC, p.name LIMIT ' . (int) $limit,
            ['low' => $low]
        );
    }

    public static function recentOrders(int $limit = 8): array
    {
        return Database::fetchAll(
            'SELECT o.*, (SELECT SUM(quantity) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
             FROM orders o ORDER BY o.created_at DESC LIMIT ' . (int) $limit
        );
    }

    /** Sortable columns for the inventory report (whitelist). */
    public const SORTS = [
        'product'   => 'p.name',
        'sku'       => 'v.sku',
        'brand'     => 'p.brand',
        'category'  => 'c.name',
        'variant'   => 'v.size, v.color',
        'price'     => 'price',
        'sold'      => 'units_sold',
        'remaining' => 'v.stock_quantity',
        'revenue'   => 'revenue',
    ];

    /**
     * One row per variant: product, sku, brand, category, subcategory,
     * variant, price, units_sold, remaining, revenue, stock status.
     * Filters: q, from, to, category, subcategory, brand, stock (in|low|out), channel.
     */
    public static function inventory(array $f, string $sort = 'product', string $dir = 'asc'): array
    {
        $from = !empty($f['from']) ? $f['from'] . ' 00:00:00' : null;
        $to = !empty($f['to']) ? $f['to'] . ' 23:59:59' : null;
        [$salesFilter, $params] = self::orderFilter($from, $to, $f['channel'] ?? null);

        $where = ['p.deleted_at IS NULL'];
        if (!empty($f['q'])) {
            $where[] = '(p.name LIKE :q1 OR v.sku LIKE :q2 OR p.sku LIKE :q3 OR p.brand LIKE :q4)';
            $params['q1'] = $params['q2'] = $params['q3'] = $params['q4'] = '%' . $f['q'] . '%';
        }
        if (!empty($f['category'])) {
            $where[] = 'p.category_id = :cat';
            $params['cat'] = (int) $f['category'];
        }
        if (!empty($f['subcategory'])) {
            $where[] = 'p.subcategory_id = :sub';
            $params['sub'] = (int) $f['subcategory'];
        }
        if (!empty($f['brand'])) {
            $where[] = 'p.brand = :brand';
            $params['brand'] = $f['brand'];
        }
        $low = (int) setting('low_stock_threshold', 3);
        if (($f['stock'] ?? '') === 'out') {
            $where[] = 'v.stock_quantity = 0';
        } elseif (($f['stock'] ?? '') === 'low') {
            $where[] = "v.stock_quantity BETWEEN 1 AND $low";
        } elseif (($f['stock'] ?? '') === 'in') {
            $where[] = "v.stock_quantity > $low";
        }

        $orderBy = self::SORTS[$sort] ?? self::SORTS['product'];
        $dir = strtolower($dir) === 'desc' ? 'DESC' : 'ASC';

        $sql = "SELECT p.id AS product_id, p.name AS product, p.brand, c.name AS category, s.name AS subcategory,
                       v.id AS variant_id, v.sku, v.size, v.color, v.stock_quantity AS remaining,
                       IF(p.sale_price IS NOT NULL AND p.sale_price < p.base_price, p.sale_price, p.base_price) AS price,
                       COALESCE(sales.units, 0) AS units_sold, COALESCE(sales.revenue, 0) AS revenue
                FROM product_variants v
                JOIN products p ON p.id = v.product_id
                JOIN categories c ON c.id = p.category_id
                JOIN subcategories s ON s.id = p.subcategory_id
                LEFT JOIN (
                    SELECT oi.variant_id, SUM(oi.quantity) AS units, SUM(oi.line_total) AS revenue
                    FROM order_items oi JOIN orders o ON o.id = oi.order_id
                    WHERE $salesFilter GROUP BY oi.variant_id
                ) sales ON sales.variant_id = v.id
                WHERE " . implode(' AND ', $where) . "
                ORDER BY $orderBy $dir, p.name, v.id";

        $rows = Database::fetchAll($sql, $params);
        foreach ($rows as &$r) {
            $r['variant'] = Variant::label($r);
            $r['status'] = stock_state((int) $r['remaining']);
        }
        return $rows;
    }

    /** Totals row for the report and export. */
    public static function totals(array $rows): array
    {
        return [
            'variants'   => count($rows),
            'products'   => count(array_unique(array_column($rows, 'product_id'))),
            'units_sold' => (int) array_sum(array_column($rows, 'units_sold')),
            'remaining'  => (int) array_sum(array_column($rows, 'remaining')),
            'revenue'    => (float) array_sum(array_column($rows, 'revenue')),
        ];
    }
}
