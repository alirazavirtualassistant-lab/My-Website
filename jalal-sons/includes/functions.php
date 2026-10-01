<?php
/**
 * Shared helper functions used by the storefront and the admin panel.
 * Every piece of output goes through e(); every price through money().
 */
declare(strict_types=1);

// ---------------------------------------------------------------- output escaping

/** HTML-escapes a value for safe output (XSS protection). */
function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Formats a price as "Rs. 4,500" (no decimals unless there are paisa). */
function money(float|int|string|null $amount): string
{
    $amount = (float) ($amount ?? 0);
    $prefix = (string) setting('currency_prefix', 'Rs.');
    $decimals = (floor($amount) == $amount) ? 0 : 2;
    return $prefix . ' ' . number_format($amount, $decimals, '.', ',');
}

/** Plain number formatting for quantities. */
function qty(int|float|string|null $n): string
{
    return number_format((float) ($n ?? 0), 0, '.', ',');
}

/** Formats a MySQL datetime for humans, e.g. "12 Mar 2026, 4:05 pm". */
function format_date(?string $datetime, string $format = 'j M Y, g:i a'): string
{
    if (!$datetime) {
        return '';
    }
    $ts = strtotime($datetime);
    return $ts ? date($format, $ts) : '';
}

// ---------------------------------------------------------------- request helpers

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443');
}

function is_post(): bool
{
    return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
}

function is_ajax(): bool
{
    return strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'xmlhttprequest'
        || str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
}

/** Trimmed string from $_POST (never null). */
function post(string $key, string $default = ''): string
{
    $v = $_POST[$key] ?? $default;
    return is_string($v) ? trim($v) : $default;
}

/** Trimmed string from $_GET (never null). */
function get(string $key, string $default = ''): string
{
    $v = $_GET[$key] ?? $default;
    return is_string($v) ? trim($v) : $default;
}

/** Integer from $_GET with a default. */
function get_int(string $key, int $default = 0): int
{
    $v = $_GET[$key] ?? null;
    return (is_string($v) || is_int($v)) && is_numeric($v) ? (int) $v : $default;
}

/** Integer from $_POST with a default. */
function post_int(string $key, int $default = 0): int
{
    $v = $_POST[$key] ?? null;
    return (is_string($v) || is_int($v)) && is_numeric($v) ? (int) $v : $default;
}

/** Best-effort client IP (for throttling and logs only). */
function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return substr((string) $ip, 0, 45);
}

/** Sends JSON and stops. */
function json_response(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ---------------------------------------------------------------- URLs

/** Absolute URL to a path inside the site, e.g. url('shop.php?category=women'). */
function url(string $path = ''): string
{
    $base = rtrim((string) config('app.base_url', ''), '/');
    return $base . '/' . ltrim($path, '/');
}

/** URL to an asset with a cache-busting version from the file's mtime. */
function asset(string $path): string
{
    $file = ROOT_PATH . '/' . ltrim($path, '/');
    $v = is_file($file) ? '?v=' . filemtime($file) : '';
    return url($path) . $v;
}

/** Public URL to a stored image path, with a placeholder fallback. */
function image_url(?string $path): string
{
    if ($path && is_file(ROOT_PATH . '/' . ltrim($path, '/'))) {
        return url($path);
    }
    return url('assets/img/placeholders/p01.svg');
}

/** Product page URL (clean or query-string, depending on config). */
function product_url(array $product): string
{
    return config('app.clean_urls')
        ? url('product/' . rawurlencode((string) $product['slug']))
        : url('product.php?slug=' . rawurlencode((string) $product['slug']));
}

/** Shop URL for a category/subcategory pair or arbitrary filter params. */
function shop_url(array $params = []): string
{
    if (config('app.clean_urls') && isset($params['category']) && count($params) <= 2) {
        $path = 'shop/' . rawurlencode((string) $params['category']);
        if (!empty($params['subcategory'])) {
            $path .= '/' . rawurlencode((string) $params['subcategory']);
        }
        return url($path);
    }
    $qs = http_build_query(array_filter($params, fn($v) => $v !== '' && $v !== null && $v !== []));
    return url('shop.php' . ($qs ? '?' . $qs : ''));
}

/** Current URL without the given query keys, with new ones merged in. */
function current_url_with(array $merge = [], array $remove = []): string
{
    $params = $_GET;
    foreach ($remove as $r) {
        unset($params[$r]);
    }
    $params = array_merge($params, $merge);
    $params = array_filter($params, fn($v) => $v !== '' && $v !== null);
    $script = basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'index.php'));
    return url($script . ($params ? '?' . http_build_query($params) : ''));
}

function redirect(string $url, int $code = 302): never
{
    header('Location: ' . $url, true, $code);
    exit;
}

/** Redirects to the previous page, or a fallback inside the site. */
function back(string $fallback = ''): never
{
    $ref = $_SERVER['HTTP_REFERER'] ?? '';
    $base = (string) config('app.base_url');
    if ($ref && $base && str_starts_with($ref, $base)) {
        redirect($ref);
    }
    redirect(url($fallback));
}

// ---------------------------------------------------------------- flash messages & old input

/** Queues a one-time message: type is success|danger|warning|info. */
function flash(string $type, string $message): void
{
    $_SESSION['_flash'][] = ['type' => $type, 'message' => $message];
}

/** Returns and clears queued flash messages. */
function get_flashes(): array
{
    $f = $_SESSION['_flash'] ?? [];
    unset($_SESSION['_flash']);
    return $f;
}

/** Remembers submitted form values for redisplay after a validation error. */
function remember_old(array $data): void
{
    unset($data['_token'], $data['password'], $data['password_confirm']);
    $_SESSION['_old'] = $data;
}

/** Returns an old form value (used after a failed POST), then the default. */
function old(string $key, mixed $default = ''): mixed
{
    if (isset($_SESSION['_old']) && array_key_exists($key, $_SESSION['_old'])) {
        return $_SESSION['_old'][$key];
    }
    return $default;
}

function clear_old(): void
{
    unset($_SESSION['_old']);
}

// ---------------------------------------------------------------- text utilities

/** Lower-case, ASCII, hyphen-separated slug. */
function slugify(string $text): string
{
    $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text) ?: $text;
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-') ?: 'item';
}

/** Makes a slug unique within a table by appending -2, -3, ... */
function unique_slug(string $table, string $slug, ?int $ignoreId = null): string
{
    $base = $slug;
    $i = 2;
    while (true) {
        $sql = "SELECT id FROM `$table` WHERE slug = :slug" . ($ignoreId ? ' AND id <> :id' : '');
        $params = ['slug' => $slug] + ($ignoreId ? ['id' => $ignoreId] : []);
        if (!Database::fetch($sql, $params)) {
            return $slug;
        }
        $slug = $base . '-' . $i++;
    }
}

/** Shortens text to a word boundary for meta descriptions and cards. */
function excerpt(?string $text, int $length = 155): string
{
    $text = trim(preg_replace('/\s+/', ' ', strip_tags((string) $text)) ?? '');
    if (mb_strlen($text) <= $length) {
        return $text;
    }
    $cut = mb_substr($text, 0, $length);
    return rtrim(mb_substr($cut, 0, (int) mb_strrpos($cut, ' ')), ' ,.;:') . '...';
}

// ---------------------------------------------------------------- phone & WhatsApp

/**
 * Normalises a Pakistani mobile number to 03XXXXXXXXX.
 * Accepts 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX with spaces or dashes.
 */
function normalize_phone(string $phone): ?string
{
    $digits = preg_replace('/[\s\-().]/', '', $phone) ?? '';
    if (preg_match('/^(?:\+?92)(3\d{9})$/', $digits, $m)) {
        return '0' . $m[1];
    }
    if (preg_match('/^0(3\d{9})$/', $digits, $m)) {
        return '0' . $m[1];
    }
    return null;
}

/** 03XXXXXXXXX -> 923XXXXXXXXX for wa.me links. */
function phone_to_intl(string $phone): string
{
    $digits = preg_replace('/\D/', '', $phone) ?? '';
    if (str_starts_with($digits, '0')) {
        $digits = '92' . substr($digits, 1);
    }
    return $digits;
}

/** wa.me link to the store (or a given number) with an optional pre-filled message. */
function whatsapp_link(string $message = '', ?string $number = null): string
{
    $number = phone_to_intl($number ?? (string) setting('whatsapp_number', ''));
    return 'https://wa.me/' . $number . ($message !== '' ? '?text=' . rawurlencode($message) : '');
}

/** tel: link for click-to-call. */
function tel_link(?string $phone = null): string
{
    return 'tel:+' . phone_to_intl($phone ?? (string) setting('phone', ''));
}

// ---------------------------------------------------------------- settings shortcut

function setting(string $key, mixed $default = null): mixed
{
    return Settings::get($key, $default);
}

// ---------------------------------------------------------------- pricing & stock

/** Effective selling price: sale price when set and lower, else base price. */
function effective_price(array $row): float
{
    $base = (float) ($row['base_price'] ?? 0);
    $sale = $row['sale_price'] ?? null;
    return ($sale !== null && $sale !== '' && (float) $sale < $base) ? (float) $sale : $base;
}

function is_on_sale(array $row): bool
{
    return effective_price($row) < (float) ($row['base_price'] ?? 0);
}

function discount_percent(array $row): int
{
    $base = (float) ($row['base_price'] ?? 0);
    return $base > 0 ? (int) round((1 - effective_price($row) / $base) * 100) : 0;
}

/** Label for the sale unit: "/ meter" for fabrics, "" otherwise. */
function unit_suffix(array $product): string
{
    return ($product['sale_unit'] ?? 'piece') === 'meter' ? ' / meter' : '';
}

/** Stock state for a quantity: ['key' => in|low|out, 'label' => ...]. */
function stock_state(int $quantity): array
{
    $threshold = (int) setting('low_stock_threshold', 3);
    if ($quantity <= 0) {
        return ['key' => 'out', 'label' => 'Out of Stock'];
    }
    if ($quantity <= $threshold) {
        return ['key' => 'low', 'label' => 'Only ' . $quantity . ' left'];
    }
    return ['key' => 'in', 'label' => 'In Stock'];
}

/** Marks a product as new if created within the last 14 days. */
function is_new_product(array $product): bool
{
    $ts = strtotime((string) ($product['created_at'] ?? ''));
    return $ts !== false && $ts > strtotime('-14 days');
}

// ---------------------------------------------------------------- pagination

/** Pagination maths: returns page, pages, offset, total, per_page. */
function paginate(int $total, int $page, int $perPage): array
{
    $pages = max(1, (int) ceil($total / max(1, $perPage)));
    $page = min(max(1, $page), $pages);
    return [
        'total'    => $total,
        'per_page' => $perPage,
        'page'     => $page,
        'pages'    => $pages,
        'offset'   => ($page - 1) * $perPage,
        'from'     => $total ? ($page - 1) * $perPage + 1 : 0,
        'to'       => min($total, $page * $perPage),
    ];
}

/** Renders Bootstrap pagination links that keep the current query string. */
function pagination_links(array $pg, string $pageKey = 'page'): string
{
    if ($pg['pages'] <= 1) {
        return '';
    }
    $html = '<nav aria-label="Pages"><ul class="pagination justify-content-center flex-wrap">';
    $link = static function (int $p, string $label, bool $active = false, bool $disabled = false) use ($pageKey): string {
        $cls = 'page-item' . ($active ? ' active' : '') . ($disabled ? ' disabled' : '');
        $href = e(current_url_with([$pageKey => $p]));
        return "<li class=\"$cls\"><a class=\"page-link\" href=\"$href\"" . ($active ? ' aria-current="page"' : '') . ">$label</a></li>";
    };
    $html .= $link(max(1, $pg['page'] - 1), '&laquo;', false, $pg['page'] === 1);
    $start = max(1, $pg['page'] - 2);
    $end = min($pg['pages'], $pg['page'] + 2);
    if ($start > 1) {
        $html .= $link(1, '1') . ($start > 2 ? '<li class="page-item disabled"><span class="page-link">&hellip;</span></li>' : '');
    }
    for ($p = $start; $p <= $end; $p++) {
        $html .= $link($p, (string) $p, $p === $pg['page']);
    }
    if ($end < $pg['pages']) {
        $html .= ($end < $pg['pages'] - 1 ? '<li class="page-item disabled"><span class="page-link">&hellip;</span></li>' : '') . $link($pg['pages'], (string) $pg['pages']);
    }
    $html .= $link(min($pg['pages'], $pg['page'] + 1), '&raquo;', false, $pg['page'] === $pg['pages']);
    return $html . '</ul></nav>';
}

// ---------------------------------------------------------------- misc

/** Spreadsheet formula injection guard: prefixes dangerous leading characters. */
function csv_safe(mixed $value): string
{
    $s = (string) ($value ?? '');
    return ($s !== '' && in_array($s[0], ['=', '+', '-', '@', "\t", "\r"], true)) ? "'" . $s : $s;
}

/** Inline SVG icon by name (gold line icons used across the storefront). */
function icon(string $name, string $class = ''): string
{
    $icons = [
        'dress'    => '<path d="M9 2l1.5 3L12 3l1.5 2L15 2l1 5-2 3 4 11H6l4-11-2-3z"/>',
        'kameez'   => '<path d="M8 2h8l3 4-3 2v14H8V8L5 6z"/><path d="M8 2c1 2 7 2 8 0"/>',
        'dupatta'  => '<path d="M3 6c4-3 8 2 12-1s4 1 6 3c-5 2-8 8-9 13-2-5-5-10-9-15z"/>',
        'fabric'   => '<path d="M3 7h14l4 3v4H7l-4-3z"/><path d="M3 11v4l4 3h14v-4"/><path d="M7 14v4"/>',
        'phone'    => '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.9 2z"/>',
        'whatsapp' => '<path d="M3 21l1.7-4.6A9 9 0 1 1 8 19.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z"/>',
        'pin'      => '<path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
        'cart'     => '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
        'search'   => '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
        'menu'     => '<path d="M3 6h18M3 12h18M3 18h18"/>',
        'clock'    => '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
        'crown'    => '<path d="M3 18h18l-1 3H4z"/><path d="M3 18L2 7l5 4 5-7 5 7 5-4-1 11"/>',
        'check'    => '<path d="M20 6L9 17l-5-5"/>',
        'truck'    => '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
        'refresh'  => '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
        'star'     => '<path d="M12 2l3 7 7 .6-5.3 4.6 1.7 7-6.4-3.9L5.6 21l1.7-7L2 9.6 9 9z"/>',
    ];
    $path = $icons[$name] ?? $icons['star'];
    return '<svg class="icon ' . e($class) . '" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $path . '</svg>';
}

/** Gold section divider with a diamond ornament. */
function divider(): string
{
    return '<div class="js-divider" aria-hidden="true"><span></span><i></i><span></span></div>';
}

/** Sends the branded 404 page and stops. */
function render_404(): never
{
    http_response_code(404);
    require ROOT_PATH . '/404.php';
    exit;
}
