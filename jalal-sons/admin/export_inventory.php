<?php
/**
 * One-click inventory download. Same filters as inventory-report.php.
 * CSV (default): streamed with fputcsv(), UTF-8 BOM so Excel opens it
 * correctly, formula-injection safe. XLSX when PhpSpreadsheet is installed
 * via Composer (?format=xlsx).
 */
declare(strict_types=1);

require_once __DIR__ . '/auth_guard.php';
require_once __DIR__ . '/partials/report-filters.php';

$rows = Report::inventory($filters, $sort, $dir);
$totals = Report::totals($rows);
$date = date('Y-m-d');
$headers = ['Product', 'SKU', 'Brand', 'Category', 'Subcategory', 'Variant', 'Price (Rs.)', 'Units Sold', 'Remaining Units', 'Revenue (Rs.)', 'Stock Status'];
$toRow = static fn(array $r): array => [
    csv_safe($r['product']), csv_safe($r['sku']), csv_safe($r['brand']), csv_safe($r['category']), csv_safe($r['subcategory']),
    csv_safe($r['variant']), (float) $r['price'], (int) $r['units_sold'], (int) $r['remaining'], (float) $r['revenue'], $r['status']['label'],
];
$totalRow = ['TOTAL', '', '', '', '', $totals['variants'] . ' variants', '', $totals['units_sold'], $totals['remaining'], round($totals['revenue'], 2), ''];

// ---------------------------------------------------------------- XLSX (optional)
if (get('format') === 'xlsx' && is_file(ROOT_PATH . '/vendor/autoload.php')) {
    require_once ROOT_PATH . '/vendor/autoload.php';
    if (class_exists(\PhpOffice\PhpSpreadsheet\Spreadsheet::class)) {
        $book = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $book->getActiveSheet();
        $sheet->setTitle('Inventory');
        $sheet->fromArray($headers, null, 'A1');
        $line = 2;
        foreach ($rows as $r) {
            $sheet->fromArray($toRow($r), null, 'A' . $line++);
        }
        $sheet->fromArray($totalRow, null, 'A' . $line);
        $sheet->getStyle('A1:K1')->getFont()->setBold(true);
        $sheet->getStyle("A$line:K$line")->getFont()->setBold(true);
        foreach (range('A', 'K') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment; filename=\"jalal-sons-inventory-$date.xlsx\"");
        header('Cache-Control: no-store');
        (new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($book))->save('php://output');
        exit;
    }
}

// ---------------------------------------------------------------- CSV (always available)
header('Content-Type: text/csv; charset=utf-8');
header("Content-Disposition: attachment; filename=\"jalal-sons-inventory-$date.csv\"");
header('Cache-Control: no-store');
$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF"); // UTF-8 BOM for Excel
fputcsv($out, $headers);
foreach ($rows as $r) {
    fputcsv($out, $toRow($r));
}
fputcsv($out, $totalRow);
fclose($out);
exit;
