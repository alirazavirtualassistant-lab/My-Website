<?php
/**
 * Included at the top of every admin page. Boots the app, requires a live
 * admin session (redirecting to login otherwise), verifies CSRF on POST and
 * prepares shared variables for the admin layout.
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

header('X-Robots-Tag: noindex, nofollow');
Auth::requireLogin();
Csrf::check();

$adminUser = Auth::user();
$pendingOrders = Order::pendingWebCount();
