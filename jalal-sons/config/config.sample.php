<?php
/**
 * Jalal Sons Cloth House - application configuration.
 *
 * Copy this file to config/config.php and edit the values.
 * config/config.php is ignored by git and must never be committed.
 */
declare(strict_types=1);

return [
    'app' => [
        'name'         => 'Jalal Sons Cloth House',
        // 'development' shows errors on screen; 'production' logs them to storage/logs.
        'env'          => 'production',
        // Public URL of the folder that holds index.php, without a trailing slash.
        // XAMPP example: 'http://localhost/jalal-sons'  cPanel example: 'https://jalalsons.pk'
        'base_url'     => 'http://localhost/jalal-sons',
        'timezone'     => 'Asia/Karachi',
        // Set true after enabling the clean URL rules in .htaccess (/product/{slug}).
        'clean_urls'   => false,
        'session_name' => 'jssess',
        // Redirect every request to HTTPS (turn on once the SSL certificate works).
        'force_https'  => false,
    ],

    'db' => [
        'host'    => '127.0.0.1',
        'port'    => 3306,
        'name'    => 'jalal_sons',
        'user'    => 'root',
        'pass'    => '',
        'charset' => 'utf8mb4',
    ],

    'uploads' => [
        'max_files'   => 8,
        'max_size'    => 5 * 1024 * 1024, // 5 MB per image
        'main_width'  => 1600,
        'thumb_width' => 600,
    ],

    'admin' => [
        'idle_timeout'       => 1800, // seconds (30 minutes)
        'login_max_attempts' => 5,
        'login_window'       => 900,  // seconds (15 minutes)
    ],
];
