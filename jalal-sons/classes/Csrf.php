<?php
/**
 * CSRF protection: one token per session, checked on every POST
 * (form field "_token" or header "X-CSRF-Token") with hash_equals().
 */
declare(strict_types=1);

final class Csrf
{
    private const KEY = '_csrf_token';

    /** Returns the session token, creating it on first use. */
    public static function token(): string
    {
        if (empty($_SESSION[self::KEY])) {
            $_SESSION[self::KEY] = bin2hex(random_bytes(32));
        }
        return $_SESSION[self::KEY];
    }

    /** Hidden input for forms. */
    public static function field(): string
    {
        return '<input type="hidden" name="_token" value="' . e(self::token()) . '">';
    }

    /** Constant-time comparison of a submitted token. */
    public static function verify(?string $token): bool
    {
        return is_string($token) && $token !== '' && hash_equals(self::token(), $token);
    }

    /**
     * Aborts the request with 419 when a POST carries no valid token.
     * AJAX callers receive JSON; browsers get a short message.
     */
    public static function check(): void
    {
        if (!is_post()) {
            return;
        }
        $token = $_POST['_token'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null);
        if (self::verify(is_string($token) ? $token : null)) {
            return;
        }
        log_message('warning', 'CSRF token mismatch from ' . client_ip() . ' on ' . ($_SERVER['REQUEST_URI'] ?? ''));
        if (is_ajax()) {
            json_response(['ok' => false, 'message' => 'Your session has expired. Please reload the page and try again.'], 419);
        }
        http_response_code(419);
        exit('Your session has expired or the form was tampered with. Please go back, reload the page and try again.');
    }
}
