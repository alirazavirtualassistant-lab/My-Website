<?php
/**
 * Application bootstrap. Included first by every page (storefront and admin).
 *
 * Loads configuration, sets up error handling and logging, the class
 * autoloader, the database, secure sessions, security headers and settings.
 */
declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));
define('APP_START', microtime(true));

// ---------------------------------------------------------------- config
$configFile = ROOT_PATH . '/config/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    exit('Configuration missing: copy config/config.sample.php to config/config.php and edit it.');
}
$GLOBALS['__config'] = require $configFile;

/** Reads a config value by dot path, e.g. config('db.host'). */
function config(string $key, mixed $default = null): mixed
{
    $value = $GLOBALS['__config'];
    foreach (explode('.', $key) as $part) {
        if (!is_array($value) || !array_key_exists($part, $value)) {
            return $default;
        }
        $value = $value[$part];
    }
    return $value;
}

define('IS_DEV', config('app.env') === 'development');
date_default_timezone_set((string) config('app.timezone', 'Asia/Karachi'));
mb_internal_encoding('UTF-8');

// ---------------------------------------------------------------- errors & logging
error_reporting(E_ALL);
ini_set('display_errors', IS_DEV ? '1' : '0');
ini_set('log_errors', '1');
ini_set('error_log', ROOT_PATH . '/storage/logs/php-' . date('Y-m-d') . '.log');

/** Appends a line to today's application log. */
function log_message(string $level, string $message): void
{
    $dir = ROOT_PATH . '/storage/logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    $line = sprintf("[%s] %s: %s\n", date('Y-m-d H:i:s'), strtoupper($level), $message);
    @file_put_contents($dir . '/app-' . date('Y-m-d') . '.log', $line, FILE_APPEND | LOCK_EX);
}

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(static function (Throwable $e): void {
    log_message('error', sprintf('%s in %s:%d', $e->getMessage(), $e->getFile(), $e->getLine()) . "\n" . $e->getTraceAsString());
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, $e->getMessage() . PHP_EOL);
        exit(1);
    }
    if (!headers_sent()) {
        http_response_code(500);
    }
    if (IS_DEV) {
        echo '<pre style="padding:1rem;color:#b00">' . htmlspecialchars((string) $e, ENT_QUOTES, 'UTF-8') . '</pre>';
    } else {
        echo '<!doctype html><meta charset="utf-8"><title>Something went wrong</title>'
           . '<body style="font-family:Georgia,serif;background:#0B0B0C;color:#F4ECD8;text-align:center;padding:4rem 1rem">'
           . '<h1 style="color:#D4AF37;letter-spacing:.1em">Jalal Sons</h1>'
           . '<p>Something went wrong on our side. Please try again in a moment or call us on the number below.</p>'
           . '<p style="color:#A89F8C">0345-4371509</p></body>';
    }
    exit;
});

// ---------------------------------------------------------------- autoloader
spl_autoload_register(static function (string $class): void {
    $file = ROOT_PATH . '/classes/' . basename(str_replace('\\', '/', $class)) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

require_once ROOT_PATH . '/includes/db.php';
require_once ROOT_PATH . '/includes/functions.php';

// ---------------------------------------------------------------- HTTPS redirect
if (PHP_SAPI !== 'cli' && config('app.force_https') && !is_https()) {
    header('Location: https://' . ($_SERVER['HTTP_HOST'] ?? '') . ($_SERVER['REQUEST_URI'] ?? '/'), true, 301);
    exit;
}

// ---------------------------------------------------------------- session
if (PHP_SAPI !== 'cli' && session_status() === PHP_SESSION_NONE) {
    session_name((string) config('app.session_name', 'jssess'));
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

// ---------------------------------------------------------------- security headers
if (PHP_SAPI !== 'cli' && !headers_sent()) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    header("Content-Security-Policy: "
        . "default-src 'self'; "
        . "script-src 'self' https://cdn.jsdelivr.net; "
        . "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; "
        . "font-src 'self' https://fonts.gstatic.com data:; "
        . "img-src 'self' data: https:; "
        . "connect-src 'self'; "
        . "frame-src https://www.google.com https://maps.google.com; "
        . "base-uri 'self'; form-action 'self' https://wa.me; frame-ancestors 'self'; object-src 'none'");
}

// ---------------------------------------------------------------- settings cache (per request)
Settings::load();
