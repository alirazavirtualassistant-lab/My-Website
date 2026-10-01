<?php
/**
 * Thrown when an order line cannot be fulfilled because stock ran out.
 * Carries how many units are still available so the customer can be told.
 */
declare(strict_types=1);

final class StockException extends RuntimeException
{
    public function __construct(
        public readonly int $variantId,
        public readonly int $available,
        public readonly string $itemName,
        public readonly int $requested
    ) {
        $msg = $available <= 0
            ? sprintf('"%s" is now sold out.', $itemName)
            : sprintf('Only %d of "%s" left; you asked for %d.', $available, $itemName, $requested);
        parent::__construct($msg);
    }
}
