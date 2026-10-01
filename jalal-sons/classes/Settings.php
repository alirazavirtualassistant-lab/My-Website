<?php
/**
 * Key/value settings store (store details, delivery charge, policies...).
 * Loaded once per request in bootstrap.php; read with setting('key').
 */
declare(strict_types=1);

final class Settings
{
    private static array $cache = [];
    private static bool $loaded = false;

    /** Loads every setting row into memory. */
    public static function load(): void
    {
        if (self::$loaded) {
            return;
        }
        try {
            foreach (Database::fetchAll('SELECT setting_key, setting_value FROM settings') as $row) {
                self::$cache[$row['setting_key']] = $row['setting_value'];
            }
        } catch (PDOException $e) {
            // Table missing (schema not imported yet): run with defaults.
            log_message('warning', 'Settings not loaded: ' . $e->getMessage());
        }
        self::$loaded = true;
    }

    /** Returns a setting, or the default when missing or empty. */
    public static function get(string $key, mixed $default = null): mixed
    {
        self::load();
        $value = self::$cache[$key] ?? null;
        return ($value === null || $value === '') ? $default : $value;
    }

    public static function all(): array
    {
        self::load();
        return self::$cache;
    }

    /** Inserts or updates a single setting. */
    public static function set(string $key, ?string $value): void
    {
        Database::run(
            'INSERT INTO settings (setting_key, setting_value) VALUES (:k, :v)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
            ['k' => $key, 'v' => $value]
        );
        self::$cache[$key] = $value;
    }

    /** Saves many settings in one transaction. */
    public static function saveMany(array $pairs): void
    {
        Database::transaction(function () use ($pairs): void {
            foreach ($pairs as $key => $value) {
                self::set((string) $key, $value === null ? null : (string) $value);
            }
        });
    }
}
