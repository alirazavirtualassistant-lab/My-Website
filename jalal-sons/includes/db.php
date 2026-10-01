<?php
/**
 * Database connection wrapper (PDO, MySQL).
 *
 * A single shared connection per request, with small helpers that keep
 * every query a prepared statement. Never build SQL from user input.
 */
declare(strict_types=1);

final class Database
{
    private static ?PDO $pdo = null;

    /** Returns the shared PDO connection, opening it on first use. */
    public static function connection(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $cfg = config('db');
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $cfg['host'],
            (int) $cfg['port'],
            $cfg['name'],
            $cfg['charset'] ?? 'utf8mb4'
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // real server-side prepared statements
            PDO::ATTR_STRINGIFY_FETCHES  => false,
        ];

        try {
            self::$pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
        } catch (PDOException $e) {
            // Never leak credentials; log and show a friendly message.
            log_message('error', 'DB connection failed: ' . $e->getMessage());
            http_response_code(500);
            exit('Database connection failed. Please check config/config.php.');
        }

        // Keep MySQL's clock in step with PHP (Asia/Karachi = UTC+5).
        self::$pdo->exec("SET time_zone = '+05:00'");
        self::$pdo->exec("SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'");

        return self::$pdo;
    }

    /** Prepares, binds and executes; returns the statement. */
    public static function run(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::connection()->prepare($sql);
        foreach ($params as $key => $value) {
            $name = is_int($key) ? $key + 1 : (str_starts_with($key, ':') ? $key : ':' . $key);
            $type = match (true) {
                is_int($value)  => PDO::PARAM_INT,
                is_bool($value) => PDO::PARAM_INT,
                $value === null => PDO::PARAM_NULL,
                default         => PDO::PARAM_STR,
            };
            $stmt->bindValue($name, is_bool($value) ? (int) $value : $value, $type);
        }
        $stmt->execute();
        return $stmt;
    }

    /** First row or null. */
    public static function fetch(string $sql, array $params = []): ?array
    {
        $row = self::run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    /** All rows. */
    public static function fetchAll(string $sql, array $params = []): array
    {
        return self::run($sql, $params)->fetchAll();
    }

    /** Single scalar value (first column of first row). */
    public static function fetchColumn(string $sql, array $params = []): mixed
    {
        $value = self::run($sql, $params)->fetchColumn();
        return $value === false ? null : $value;
    }

    /** Inserts a row from an associative array and returns the new id. */
    public static function insert(string $table, array $data): int
    {
        $columns = array_keys($data);
        $sql = sprintf(
            'INSERT INTO `%s` (%s) VALUES (%s)',
            $table,
            implode(', ', array_map(fn($c) => "`$c`", $columns)),
            implode(', ', array_map(fn($c) => ":$c", $columns))
        );
        self::run($sql, $data);
        return (int) self::connection()->lastInsertId();
    }

    /** Updates a row by id from an associative array; returns affected rows. */
    public static function update(string $table, array $data, int $id, string $idColumn = 'id'): int
    {
        $sets = implode(', ', array_map(fn($c) => "`$c` = :$c", array_keys($data)));
        $data['__id'] = $id;
        return self::run("UPDATE `$table` SET $sets WHERE `$idColumn` = :__id", $data)->rowCount();
    }

    /**
     * Runs a callback inside a transaction, committing on success and rolling
     * back on any throwable. Nested calls reuse the outer transaction.
     */
    public static function transaction(callable $fn): mixed
    {
        $pdo = self::connection();
        if ($pdo->inTransaction()) {
            return $fn($pdo);
        }
        $pdo->beginTransaction();
        try {
            $result = $fn($pdo);
            $pdo->commit();
            return $result;
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }
}

/** Short alias used throughout the code base. */
function db(): PDO
{
    return Database::connection();
}
