<?php
/** ads.txt for Google AdSense, generated from the publisher id in Settings (rewritten from /ads.txt). */
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';
header('Content-Type: text/plain; charset=utf-8');
$client = adsense_client();
if ($client === '') {
    echo "# No ad network configured.\n";
    exit;
}
echo 'google.com, ' . str_replace('ca-', '', $client) . ", DIRECT, f08c47fec0942fa0\n";
