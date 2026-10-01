<?php
/**
 * Admin authentication: password_hash/verify, login throttling, session
 * management with idle timeout, and role checks (owner / staff).
 */
declare(strict_types=1);

final class Auth
{
    private const SESSION_KEY = 'admin';

    /**
     * Attempts a login. Returns true on success, otherwise an error message
     * safe to show to the user (never reveals which part was wrong).
     */
    public static function attempt(string $username, string $password, string $ip): bool|string
    {
        $username = mb_substr(trim($username), 0, 50);
        if ($username === '' || $password === '') {
            return 'Please enter your username and password.';
        }

        if (self::isThrottled($username, $ip)) {
            return 'Too many failed attempts. Please wait 15 minutes and try again.';
        }

        $admin = Database::fetch('SELECT * FROM admins WHERE username = :u LIMIT 1', ['u' => $username]);
        $hash = $admin['password_hash'] ?? '$2y$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv'; // constant-time path

        if (!$admin || !(int) $admin['is_active'] || !password_verify($password, $hash)) {
            self::recordFailure($username, $ip);
            return 'Incorrect username or password.';
        }

        // Upgrade the hash if PHP's default algorithm/cost changed.
        if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
            Database::update('admins', ['password_hash' => password_hash($password, PASSWORD_DEFAULT)], (int) $admin['id']);
        }

        session_regenerate_id(true);
        $_SESSION[self::SESSION_KEY] = [
            'id'       => (int) $admin['id'],
            'name'     => $admin['name'],
            'username' => $admin['username'],
            'role'     => $admin['role'],
            'last_seen'=> time(),
        ];
        unset($_SESSION['_csrf_token']); // fresh token for the new session

        Database::update('admins', ['last_login_at' => date('Y-m-d H:i:s')], (int) $admin['id']);
        Database::run('DELETE FROM login_attempts WHERE username = :u AND ip_address = :ip', ['u' => $username, 'ip' => $ip]);
        return true;
    }

    /** True when there is a live admin session that has not idled out. */
    public static function check(): bool
    {
        $s = $_SESSION[self::SESSION_KEY] ?? null;
        if (!$s) {
            return false;
        }
        $timeout = (int) config('admin.idle_timeout', 1800);
        if (time() - (int) ($s['last_seen'] ?? 0) > $timeout) {
            self::logout();
            return false;
        }
        $_SESSION[self::SESSION_KEY]['last_seen'] = time();
        return true;
    }

    public static function user(): ?array
    {
        return $_SESSION[self::SESSION_KEY] ?? null;
    }

    public static function id(): int
    {
        return (int) ($_SESSION[self::SESSION_KEY]['id'] ?? 0);
    }

    public static function isOwner(): bool
    {
        return ($_SESSION[self::SESSION_KEY]['role'] ?? '') === 'owner';
    }

    /** Clears the admin part of the session (the cart, if any, survives). */
    public static function logout(): void
    {
        unset($_SESSION[self::SESSION_KEY], $_SESSION['_csrf_token']);
        session_regenerate_id(true);
    }

    /** Guard: redirect to login (or 401 JSON for AJAX) when not logged in. */
    public static function requireLogin(): void
    {
        if (self::check()) {
            return;
        }
        if (is_ajax()) {
            json_response(['ok' => false, 'message' => 'Please log in again.'], 401);
        }
        $next = $_SERVER['REQUEST_URI'] ?? '';
        redirect(url('admin/login.php' . ($next ? '?next=' . rawurlencode($next) : '')));
    }

    /** Guard: owner-only pages. */
    public static function requireOwner(): void
    {
        self::requireLogin();
        if (!self::isOwner()) {
            if (is_ajax()) {
                json_response(['ok' => false, 'message' => 'Owner access required.'], 403);
            }
            http_response_code(403);
            flash('danger', 'Only the owner can open that page.');
            redirect(url('admin/dashboard.php'));
        }
    }

    /** Changes a password after verifying the current one. */
    public static function changePassword(int $adminId, string $current, string $new): bool|string
    {
        $admin = Database::fetch('SELECT password_hash FROM admins WHERE id = :id', ['id' => $adminId]);
        if (!$admin || !password_verify($current, $admin['password_hash'])) {
            return 'Your current password is incorrect.';
        }
        Database::update('admins', ['password_hash' => password_hash($new, PASSWORD_DEFAULT)], $adminId);
        return true;
    }

    // ------------------------------------------------------------ throttling

    private static function isThrottled(string $username, string $ip): bool
    {
        $window = (int) config('admin.login_window', 900);
        $max = (int) config('admin.login_max_attempts', 5);
        // Housekeeping: drop attempts older than the window.
        Database::run('DELETE FROM login_attempts WHERE attempted_at < (NOW() - INTERVAL :w SECOND)', ['w' => $window]);
        $count = (int) Database::fetchColumn(
            'SELECT COUNT(*) FROM login_attempts WHERE username = :u AND ip_address = :ip AND attempted_at >= (NOW() - INTERVAL :w SECOND)',
            ['u' => $username, 'ip' => $ip, 'w' => $window]
        );
        return $count >= $max;
    }

    private static function recordFailure(string $username, string $ip): void
    {
        Database::insert('login_attempts', ['username' => $username, 'ip_address' => $ip]);
        log_message('warning', "Failed admin login for '$username' from $ip");
    }
}
