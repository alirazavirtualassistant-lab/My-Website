<?php
/**
 * Gender categories (Women, Men, Kids/Children) and their cloth-type
 * subcategories (Party Wear, Casual Wear, Unstitched, Fabrics, ...).
 */
declare(strict_types=1);

final class Category
{
    /** All categories, optionally active only, in display order. */
    public static function all(bool $activeOnly = false): array
    {
        $sql = 'SELECT * FROM categories' . ($activeOnly ? ' WHERE is_active = 1' : '') . ' ORDER BY sort_order, name';
        return Database::fetchAll($sql);
    }

    public static function find(int $id): ?array
    {
        return Database::fetch('SELECT * FROM categories WHERE id = :id', ['id' => $id]);
    }

    public static function findBySlug(string $slug, bool $activeOnly = true): ?array
    {
        $sql = 'SELECT * FROM categories WHERE slug = :slug' . ($activeOnly ? ' AND is_active = 1' : '');
        return Database::fetch($sql, ['slug' => $slug]);
    }

    /** Subcategories, optionally limited to one category and/or active only. */
    public static function subcategories(?int $categoryId = null, bool $activeOnly = false): array
    {
        $where = [];
        $params = [];
        if ($categoryId !== null) {
            $where[] = 's.category_id = :cid';
            $params['cid'] = $categoryId;
        }
        if ($activeOnly) {
            $where[] = 's.is_active = 1 AND c.is_active = 1';
        }
        $sql = 'SELECT s.*, c.name AS category_name, c.slug AS category_slug
                FROM subcategories s JOIN categories c ON c.id = s.category_id'
             . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
             . ' ORDER BY c.sort_order, s.sort_order, s.name';
        return Database::fetchAll($sql, $params);
    }

    public static function findSubcategory(int $id): ?array
    {
        return Database::fetch(
            'SELECT s.*, c.name AS category_name, c.slug AS category_slug
             FROM subcategories s JOIN categories c ON c.id = s.category_id WHERE s.id = :id',
            ['id' => $id]
        );
    }

    public static function findSubcategoryBySlug(int $categoryId, string $slug, bool $activeOnly = true): ?array
    {
        $sql = 'SELECT * FROM subcategories WHERE category_id = :cid AND slug = :slug' . ($activeOnly ? ' AND is_active = 1' : '');
        return Database::fetch($sql, ['cid' => $categoryId, 'slug' => $slug]);
    }

    /** Active categories with their active subcategories, for navigation. */
    public static function navTree(): array
    {
        $tree = [];
        foreach (self::all(true) as $cat) {
            $cat['subcategories'] = [];
            $tree[$cat['id']] = $cat;
        }
        foreach (self::subcategories(null, true) as $sub) {
            if (isset($tree[$sub['category_id']])) {
                $tree[$sub['category_id']]['subcategories'][] = $sub;
            }
        }
        return array_values($tree);
    }

    /**
     * Active cloth types with a cover photo (newest live product's image)
     * and live product count, for the homepage category tiles.
     */
    public static function linesWithCovers(): array
    {
        return Database::fetchAll(
            "SELECT s.*, c.slug AS category_slug, c.name AS category_name,
                    (SELECT COUNT(*) FROM products p WHERE p.subcategory_id = s.id AND p.is_active = 1 AND p.deleted_at IS NULL) AS product_count,
                    (SELECT i.thumb_path FROM products p JOIN product_images i ON i.product_id = p.id
                      WHERE p.subcategory_id = s.id AND p.is_active = 1 AND p.deleted_at IS NULL
                      ORDER BY i.is_primary DESC, p.created_at DESC LIMIT 1) AS cover
             FROM subcategories s JOIN categories c ON c.id = s.category_id
             WHERE s.is_active = 1 AND c.is_active = 1 ORDER BY c.sort_order, s.sort_order"
        );
    }

    /** Creates or updates a category; returns its id. */
    public static function save(array $data, ?int $id = null): int
    {
        $row = [
            'name'       => mb_substr(trim((string) $data['name']), 0, 80),
            'is_active'  => !empty($data['is_active']) ? 1 : 0,
            'sort_order' => (int) ($data['sort_order'] ?? 0),
        ];
        $row['slug'] = unique_slug('categories', slugify($row['name']), $id);
        if ($id) {
            Database::update('categories', $row, $id);
            return $id;
        }
        return Database::insert('categories', $row);
    }

    /** Creates or updates a subcategory; returns its id. */
    public static function saveSubcategory(array $data, ?int $id = null): int
    {
        $row = [
            'category_id' => (int) $data['category_id'],
            'name'        => mb_substr(trim((string) $data['name']), 0, 80),
            'icon'        => in_array($data['icon'] ?? '', ['dress', 'kameez', 'dupatta', 'fabric'], true) ? $data['icon'] : 'kameez',
            'is_active'   => !empty($data['is_active']) ? 1 : 0,
            'sort_order'  => (int) ($data['sort_order'] ?? 0),
        ];
        // Slug unique within the parent category.
        $base = slugify($row['name']);
        $slug = $base;
        $i = 2;
        while (true) {
            $sql = 'SELECT id FROM subcategories WHERE category_id = :cid AND slug = :slug' . ($id ? ' AND id <> :id' : '');
            $params = ['cid' => $row['category_id'], 'slug' => $slug] + ($id ? ['id' => $id] : []);
            if (!Database::fetch($sql, $params)) {
                break;
            }
            $slug = $base . '-' . $i++;
        }
        $row['slug'] = $slug;
        if ($id) {
            Database::update('subcategories', $row, $id);
            return $id;
        }
        return Database::insert('subcategories', $row);
    }

    /** Flips is_active on a category or subcategory. */
    public static function toggle(string $table, int $id): void
    {
        $table = $table === 'subcategories' ? 'subcategories' : 'categories'; // whitelist
        Database::run("UPDATE `$table` SET is_active = 1 - is_active WHERE id = :id", ['id' => $id]);
    }

    /** Moves a row up or down by swapping sort_order with its neighbour. */
    public static function move(string $table, int $id, string $direction): void
    {
        $table = $table === 'subcategories' ? 'subcategories' : 'categories';
        $row = Database::fetch("SELECT * FROM `$table` WHERE id = :id", ['id' => $id]);
        if (!$row) {
            return;
        }
        $scope = $table === 'subcategories' ? ' AND category_id = ' . (int) $row['category_id'] : '';
        $op = $direction === 'up' ? '<' : '>';
        $order = $direction === 'up' ? 'DESC' : 'ASC';
        $neighbour = Database::fetch(
            "SELECT * FROM `$table` WHERE sort_order $op :so $scope ORDER BY sort_order $order LIMIT 1",
            ['so' => (int) $row['sort_order']]
        );
        if (!$neighbour) {
            return;
        }
        Database::transaction(function () use ($table, $row, $neighbour): void {
            Database::update($table, ['sort_order' => (int) $neighbour['sort_order']], (int) $row['id']);
            Database::update($table, ['sort_order' => (int) $row['sort_order']], (int) $neighbour['id']);
        });
    }

    /** Number of products using a subcategory (blocks deletion). */
    public static function productCount(string $table, int $id): int
    {
        $col = $table === 'subcategories' ? 'subcategory_id' : 'category_id';
        return (int) Database::fetchColumn("SELECT COUNT(*) FROM products WHERE `$col` = :id", ['id' => $id]);
    }

    public static function delete(string $table, int $id): bool
    {
        $table = $table === 'subcategories' ? 'subcategories' : 'categories';
        if (self::productCount($table, $id) > 0) {
            return false;
        }
        Database::run("DELETE FROM `$table` WHERE id = :id", ['id' => $id]);
        return true;
    }
}
