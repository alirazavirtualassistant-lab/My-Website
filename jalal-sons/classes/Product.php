<?php
/**
 * Product catalog: reads for the storefront and admin, create/update with
 * variants and images, SKU suggestions, and filter option lists.
 */
declare(strict_types=1);

final class Product
{
    public const SEASONS = ['Summer', 'Winter', 'Mid-Season', 'Festive/Wedding'];
    public const PIECES  = ['1-piece', '2-piece', '3-piece'];
    public const UNITS   = ['piece' => 'Per piece', 'suit' => 'Per suit', 'meter' => 'Per meter'];
    public const FABRICS = ['Lawn', 'Cotton', 'Cambric', 'Linen', 'Khaddar', 'Karandi', 'Chiffon', 'Organza', 'Silk', 'Velvet', 'Net', 'Jacquard'];
    public const SIZES   = ['Unstitched', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

    /** Columns shared by every product query. */
    private const SELECT = '
        p.*,
        c.name AS category_name, c.slug AS category_slug,
        s.name AS subcategory_name, s.slug AS subcategory_slug,
        IF(p.sale_price IS NOT NULL AND p.sale_price < p.base_price, p.sale_price, p.base_price) AS price,
        (SELECT COALESCE(SUM(v.stock_quantity), 0) FROM product_variants v WHERE v.product_id = p.id) AS total_stock,
        (SELECT i.thumb_path FROM product_images i WHERE i.product_id = p.id ORDER BY i.is_primary DESC, i.sort_order, i.id LIMIT 1) AS thumb_path,
        (SELECT i.image_path FROM product_images i WHERE i.product_id = p.id ORDER BY i.is_primary DESC, i.sort_order, i.id LIMIT 1) AS image_path
        FROM products p
        JOIN categories c ON c.id = p.category_id
        JOIN subcategories s ON s.id = p.subcategory_id';

    /** Storefront visibility: active, not deleted, in an active category tree. */
    private const LIVE = ' p.is_active = 1 AND p.deleted_at IS NULL AND c.is_active = 1 AND s.is_active = 1 ';

    // ------------------------------------------------------------ single reads

    public static function find(int $id, bool $withDeleted = false): ?array
    {
        $sql = 'SELECT ' . self::SELECT . ' WHERE p.id = :id' . ($withDeleted ? '' : ' AND p.deleted_at IS NULL');
        return Database::fetch($sql, ['id' => $id]);
    }

    /** Live product by slug (storefront). */
    public static function findBySlug(string $slug): ?array
    {
        return Database::fetch('SELECT ' . self::SELECT . ' WHERE p.slug = :slug AND ' . self::LIVE, ['slug' => $slug]);
    }

    public static function images(int $productId): array
    {
        return Database::fetchAll(
            'SELECT * FROM product_images WHERE product_id = :id ORDER BY is_primary DESC, sort_order, id',
            ['id' => $productId]
        );
    }

    public static function variants(int $productId): array
    {
        return Variant::forProduct($productId);
    }

    // ------------------------------------------------------------ lists

    public static function latest(int $limit = 8): array
    {
        return Database::fetchAll('SELECT ' . self::SELECT . ' WHERE ' . self::LIVE . ' ORDER BY p.created_at DESC, p.id DESC LIMIT ' . (int) $limit);
    }

    public static function featured(int $limit = 8): array
    {
        return Database::fetchAll('SELECT ' . self::SELECT . ' WHERE ' . self::LIVE . ' AND p.is_featured = 1 ORDER BY p.updated_at DESC LIMIT ' . (int) $limit);
    }

    public static function onSale(int $limit = 8): array
    {
        return Database::fetchAll(
            'SELECT ' . self::SELECT . ' WHERE ' . self::LIVE . ' AND p.sale_price IS NOT NULL AND p.sale_price < p.base_price
             ORDER BY (1 - p.sale_price / p.base_price) DESC, p.created_at DESC LIMIT ' . (int) $limit
        );
    }

    /** Other live products from the same subcategory. */
    public static function related(array $product, int $limit = 4): array
    {
        return Database::fetchAll(
            'SELECT ' . self::SELECT . ' WHERE ' . self::LIVE . ' AND p.subcategory_id = :sid AND p.id <> :id ORDER BY RAND() LIMIT ' . (int) $limit,
            ['sid' => (int) $product['subcategory_id'], 'id' => (int) $product['id']]
        );
    }

    /**
     * Filtered, sorted, paginated listing used by shop.php and admin/products.php.
     *
     * Filters: q, category (slug or id), subcategory (slug or id), brand, fabric,
     * size, color, min_price, max_price, availability (in|out), on_sale,
     * status (admin: active|inactive), stock (admin: in|low|out).
     * Sort: newest | price_asc | price_desc | name (admin also: stock_asc, updated).
     */
    public static function search(array $f, int $page = 1, int $perPage = 12, bool $admin = false): array
    {
        $where = [$admin ? 'p.deleted_at IS NULL' : self::LIVE];
        $params = [];

        if (!empty($f['q'])) {
            $where[] = '(p.name LIKE :q1 OR p.sku LIKE :q2 OR p.brand LIKE :q3 OR p.description LIKE :q4)';
            // Native prepared statements need a distinct placeholder per use.
            $params['q1'] = $params['q2'] = $params['q3'] = $params['q4'] = '%' . $f['q'] . '%';
        }
        if (!empty($f['category'])) {
            $where[] = is_numeric($f['category']) ? 'p.category_id = :cat' : 'c.slug = :cat';
            $params['cat'] = $f['category'];
        }
        if (!empty($f['subcategory'])) {
            $where[] = is_numeric($f['subcategory']) ? 'p.subcategory_id = :sub' : 's.slug = :sub';
            $params['sub'] = $f['subcategory'];
        }
        if (!empty($f['brand'])) {
            $where[] = 'p.brand = :brand';
            $params['brand'] = $f['brand'];
        }
        if (!empty($f['fabric'])) {
            $where[] = 'p.fabric = :fabric';
            $params['fabric'] = $f['fabric'];
        }
        if (!empty($f['size'])) {
            $where[] = 'EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND v.size = :size AND v.stock_quantity > 0)';
            $params['size'] = $f['size'];
        }
        if (!empty($f['color'])) {
            $where[] = 'EXISTS (SELECT 1 FROM product_variants v WHERE v.product_id = p.id AND v.color = :color AND v.stock_quantity > 0)';
            $params['color'] = $f['color'];
        }
        if (isset($f['min_price']) && $f['min_price'] !== '' && is_numeric($f['min_price'])) {
            $where[] = 'IF(p.sale_price IS NOT NULL AND p.sale_price < p.base_price, p.sale_price, p.base_price) >= :minp';
            $params['minp'] = (float) $f['min_price'];
        }
        if (isset($f['max_price']) && $f['max_price'] !== '' && is_numeric($f['max_price'])) {
            $where[] = 'IF(p.sale_price IS NOT NULL AND p.sale_price < p.base_price, p.sale_price, p.base_price) <= :maxp';
            $params['maxp'] = (float) $f['max_price'];
        }
        if (!empty($f['on_sale'])) {
            $where[] = 'p.sale_price IS NOT NULL AND p.sale_price < p.base_price';
        }
        $stockExpr = '(SELECT COALESCE(SUM(v.stock_quantity),0) FROM product_variants v WHERE v.product_id = p.id)';
        if (($f['availability'] ?? '') === 'in') {
            $where[] = "$stockExpr > 0";
        } elseif (($f['availability'] ?? '') === 'out') {
            $where[] = "$stockExpr = 0";
        }
        if ($admin) {
            if (($f['status'] ?? '') === 'active') {
                $where[] = 'p.is_active = 1';
            } elseif (($f['status'] ?? '') === 'inactive') {
                $where[] = 'p.is_active = 0';
            }
            $low = (int) setting('low_stock_threshold', 3);
            if (($f['stock'] ?? '') === 'out') {
                $where[] = "$stockExpr = 0";
            } elseif (($f['stock'] ?? '') === 'low') {
                $where[] = "$stockExpr BETWEEN 1 AND $low";
            } elseif (($f['stock'] ?? '') === 'in') {
                $where[] = "$stockExpr > $low";
            }
        }

        // ORDER BY is whitelisted, never taken from input directly.
        $sorts = [
            'newest'     => 'p.created_at DESC, p.id DESC',
            'price_asc'  => 'price ASC, p.id DESC',
            'price_desc' => 'price DESC, p.id DESC',
            'name'       => 'p.name ASC',
            'updated'    => 'p.updated_at DESC',
            'stock_asc'  => 'total_stock ASC, p.name ASC',
        ];
        $order = $sorts[$f['sort'] ?? 'newest'] ?? $sorts['newest'];
        // Storefront: sold-out items sort last.
        if (!$admin) {
            $order = '(total_stock = 0) ASC, ' . $order;
        }

        $whereSql = implode(' AND ', $where);
        $total = (int) Database::fetchColumn(
            "SELECT COUNT(*) FROM products p JOIN categories c ON c.id = p.category_id JOIN subcategories s ON s.id = p.subcategory_id WHERE $whereSql",
            $params
        );
        $pg = paginate($total, $page, $perPage);
        $items = Database::fetchAll(
            'SELECT ' . self::SELECT . " WHERE $whereSql ORDER BY $order LIMIT {$pg['per_page']} OFFSET {$pg['offset']}",
            $params
        );
        return ['items' => $items, 'pagination' => $pg];
    }

    /** Distinct values for the shop filters (live products only). */
    public static function filterOptions(): array
    {
        $live = 'FROM products p JOIN categories c ON c.id = p.category_id JOIN subcategories s ON s.id = p.subcategory_id WHERE ' . self::LIVE;
        $range = Database::fetch("SELECT MIN(IF(p.sale_price IS NOT NULL AND p.sale_price < p.base_price, p.sale_price, p.base_price)) AS min_price,
                                         MAX(IF(p.sale_price IS NOT NULL AND p.sale_price < p.base_price, p.sale_price, p.base_price)) AS max_price $live");
        return [
            'brands'  => array_column(Database::fetchAll("SELECT DISTINCT p.brand $live AND p.brand IS NOT NULL AND p.brand <> '' ORDER BY p.brand"), 'brand'),
            'fabrics' => array_column(Database::fetchAll("SELECT DISTINCT p.fabric $live AND p.fabric IS NOT NULL AND p.fabric <> '' ORDER BY p.fabric"), 'fabric'),
            'sizes'   => array_column(Database::fetchAll("SELECT DISTINCT v.size FROM product_variants v JOIN products p ON p.id = v.product_id JOIN categories c ON c.id = p.category_id JOIN subcategories s ON s.id = p.subcategory_id WHERE " . self::LIVE . " ORDER BY FIELD(v.size,'XS','S','M','L','XL','XXL','Free Size','Unstitched'), v.size"), 'size'),
            'colors'  => array_column(Database::fetchAll("SELECT DISTINCT v.color FROM product_variants v JOIN products p ON p.id = v.product_id JOIN categories c ON c.id = p.category_id JOIN subcategories s ON s.id = p.subcategory_id WHERE " . self::LIVE . " ORDER BY v.color"), 'color'),
            'min_price' => (float) ($range['min_price'] ?? 0),
            'max_price' => (float) ($range['max_price'] ?? 0),
        ];
    }

    /** Distinct brand names across all products (admin filters/suggestions). */
    public static function brands(): array
    {
        return array_column(Database::fetchAll("SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand <> '' AND deleted_at IS NULL ORDER BY brand"), 'brand');
    }

    // ------------------------------------------------------------ writes

    /**
     * Creates a product with its variants. $data comes from the validated form,
     * $variants is a list of [size, color, color_hex, stock_quantity, sku].
     */
    public static function create(array $data, array $variants, int $adminId): int
    {
        return Database::transaction(function () use ($data, $variants, $adminId): int {
            $row = self::rowFromData($data);
            $row['slug'] = unique_slug('products', slugify($row['name']));
            $id = Database::insert('products', $row);
            Variant::sync($id, $variants, $adminId, 'initial');
            return $id;
        });
    }

    public static function update(int $id, array $data, array $variants, int $adminId): void
    {
        Database::transaction(function () use ($id, $data, $variants, $adminId): void {
            $row = self::rowFromData($data);
            $existing = Database::fetch('SELECT name, slug FROM products WHERE id = :id', ['id' => $id]);
            if ($existing && $existing['name'] !== $row['name']) {
                $row['slug'] = unique_slug('products', slugify($row['name']), $id);
            }
            Database::update('products', $row, $id);
            Variant::sync($id, $variants, $adminId, 'adjustment');
        });
    }

    /** Maps validated form input to table columns. */
    private static function rowFromData(array $d): array
    {
        $base = round((float) $d['base_price'], 2);
        $sale = ($d['sale_price'] ?? '') !== '' ? round((float) $d['sale_price'], 2) : null;
        return [
            'name'           => mb_substr(trim((string) $d['name']), 0, 150),
            'description'    => trim((string) ($d['description'] ?? '')) ?: null,
            'sku'            => strtoupper(trim((string) $d['sku'])),
            'base_price'     => $base,
            'sale_price'     => ($sale !== null && $sale < $base) ? $sale : null,
            'category_id'    => (int) $d['category_id'],
            'subcategory_id' => (int) $d['subcategory_id'],
            'brand'          => mb_substr(trim((string) ($d['brand'] ?? '')), 0, 80) ?: null,
            'fabric'         => mb_substr(trim((string) ($d['fabric'] ?? '')), 0, 60) ?: null,
            'pieces'         => in_array($d['pieces'] ?? '', self::PIECES, true) ? $d['pieces'] : null,
            'inclusions'     => mb_substr(trim((string) ($d['inclusions'] ?? '')), 0, 255) ?: null,
            'season'         => in_array($d['season'] ?? '', self::SEASONS, true) ? $d['season'] : null,
            'sale_unit'      => array_key_exists($d['sale_unit'] ?? '', self::UNITS) ? $d['sale_unit'] : 'piece',
            'is_featured'    => !empty($d['is_featured']) ? 1 : 0,
            'is_active'      => !empty($d['is_active']) ? 1 : 0,
        ];
    }

    public static function toggleActive(int $id): void
    {
        Database::run('UPDATE products SET is_active = 1 - is_active WHERE id = :id AND deleted_at IS NULL', ['id' => $id]);
    }

    /** Soft delete: hidden everywhere, history (orders) preserved. */
    public static function softDelete(int $id): void
    {
        Database::run('UPDATE products SET deleted_at = NOW(), is_active = 0 WHERE id = :id', ['id' => $id]);
    }

    public static function skuExists(string $sku, ?int $ignoreId = null): bool
    {
        $sql = 'SELECT id FROM products WHERE sku = :sku' . ($ignoreId ? ' AND id <> :id' : '');
        return (bool) Database::fetch($sql, ['sku' => $sku] + ($ignoreId ? ['id' => $ignoreId] : []));
    }

    /**
     * Suggests the next SKU for a subcategory, e.g. JS-PW-0001.
     * Prefix = first letters of the subcategory words (Party Wear -> PW).
     */
    public static function nextSku(?int $subcategoryId): string
    {
        $prefix = 'JS-GEN-';
        if ($subcategoryId) {
            $sub = Category::findSubcategory($subcategoryId);
            if ($sub) {
                $words = preg_split('/[\s\/\-]+/', (string) $sub['name']) ?: [];
                $code = '';
                foreach ($words as $w) {
                    $code .= strtoupper(substr($w, 0, 1));
                }
                if (strlen($code) < 2) {
                    // Single word: first letter + next consonant (Fabrics -> FB, Unstitched -> UN).
                    $w = strtoupper(preg_replace('/[^A-Za-z]/', '', (string) $sub['name']));
                    $rest = preg_replace('/[AEIOU]/', '', substr($w, 1));
                    $code = substr($w, 0, 1) . substr($rest !== '' ? $rest : substr($w, 1), 0, 1);
                }
                $prefix = 'JS-' . $code . '-';
            }
        }
        $last = Database::fetchColumn(
            'SELECT sku FROM products WHERE sku LIKE :p ORDER BY LENGTH(sku) DESC, sku DESC LIMIT 1',
            ['p' => $prefix . '%']
        );
        $n = 1;
        if ($last && preg_match('/(\d+)$/', (string) $last, $m)) {
            $n = (int) $m[1] + 1;
        }
        return $prefix . str_pad((string) $n, 4, '0', STR_PAD_LEFT);
    }

    public static function count(bool $liveOnly = false): int
    {
        $sql = 'SELECT COUNT(*) FROM products WHERE deleted_at IS NULL' . ($liveOnly ? ' AND is_active = 1' : '');
        return (int) Database::fetchColumn($sql);
    }
}
