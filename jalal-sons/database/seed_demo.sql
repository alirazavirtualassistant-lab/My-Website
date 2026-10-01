-- =====================================================================
--  Jalal Sons Cloth House - DEMO DATA (optional)
--  12 sample products across the four active lines, with variants,
--  mixed stock (one sold out, one low stock) and SVG placeholder
--  images. Brand names are placeholders. Do NOT import on a live shop
--  that already has real products.
-- =====================================================================
SET NAMES utf8mb4;
USE `jalal_sons`;

INSERT INTO `products`
  (`id`, `name`, `slug`, `description`, `sku`, `base_price`, `sale_price`, `category_id`, `subcategory_id`,
   `brand`, `fabric`, `pieces`, `inclusions`, `season`, `sale_unit`, `is_featured`, `is_active`, `created_at`)
VALUES
  (1, 'Zareen Embroidered Chiffon Suit', 'zareen-embroidered-chiffon-suit',
   'Heavily embroidered chiffon shirt with sequinned dupatta and raw silk trouser. Perfect for mehndi and evening functions.',
   'JS-PW-0001', 12500.00, 9900.00, 1, 1, 'Noor Couture', 'Chiffon', '3-piece', 'Shirt, Dupatta, Trouser', 'Festive/Wedding', 'suit', 1, 1, NOW() - INTERVAL 1 DAY),
  (2, 'Mehrunnisa Velvet Formal', 'mehrunnisa-velvet-formal',
   'Rich maroon velvet shirt with zardozi neckline, paired with organza dupatta. Winter wedding favourite.',
   'JS-PW-0002', 18500.00, NULL, 1, 1, 'Noor Couture', 'Velvet', '3-piece', 'Shirt, Dupatta, Trouser', 'Winter', 'suit', 1, 1, NOW() - INTERVAL 3 DAY),
  (3, 'Gulnar Net Maxi', 'gulnar-net-maxi',
   'Floor length net maxi in emerald with gold tilla work and an attached lining.',
   'JS-PW-0003', 22000.00, 19500.00, 1, 1, 'Sitara Studio', 'Net', '2-piece', 'Maxi, Dupatta', 'Festive/Wedding', 'piece', 0, 1, NOW() - INTERVAL 5 DAY),

  (4, 'Falak Printed Lawn Kurti', 'falak-printed-lawn-kurti',
   'Breezy printed lawn kurti with a boat neck and side slits. Ideal for everyday summer wear.',
   'JS-CW-0001', 2800.00, 2250.00, 1, 2, 'Daily Threads', 'Lawn', '1-piece', 'Kurti', 'Summer', 'piece', 1, 1, NOW() - INTERVAL 2 DAY),
  (5, 'Aiza Cotton Two Piece', 'aiza-cotton-two-piece',
   'Soft cotton kameez with straight trousers in a dusty blush shade. Machine washable.',
   'JS-CW-0002', 4200.00, NULL, 1, 2, 'Daily Threads', 'Cotton', '2-piece', 'Kameez, Trouser', 'Mid-Season', 'suit', 0, 1, NOW() - INTERVAL 4 DAY),
  (6, 'Hania Khaddar Kurta', 'hania-khaddar-kurta',
   'Warm khaddar kurta with embroidered cuffs, cut in a relaxed fit.',
   'JS-CW-0003', 3600.00, NULL, 1, 2, 'Winter Loom', 'Khaddar', '1-piece', 'Kurta', 'Winter', 'piece', 0, 1, NOW() - INTERVAL 9 DAY),

  (7, 'Bareeze Style Embroidered Lawn 3pc', 'bareeze-style-embroidered-lawn-3pc',
   'Unstitched embroidered lawn shirt with chiffon dupatta and dyed cambric trouser.',
   'JS-UN-0001', 6500.00, 5850.00, 1, 3, 'Gul Bahar', 'Lawn', '3-piece', 'Shirt 3 m, Dupatta 2.5 m, Trouser 2.5 m', 'Summer', 'suit', 1, 1, NOW() - INTERVAL 1 DAY),
  (8, 'Karandi Winter Unstitched 3pc', 'karandi-winter-unstitched-3pc',
   'Printed karandi shirt with wool shawl and plain trouser. Warm and soft.',
   'JS-UN-0002', 7200.00, NULL, 1, 3, 'Winter Loom', 'Karandi', '3-piece', 'Shirt 3 m, Shawl 2.5 m, Trouser 2.5 m', 'Winter', 'suit', 0, 1, NOW() - INTERVAL 6 DAY),
  (9, 'Jacquard Festive Unstitched 2pc', 'jacquard-festive-unstitched-2pc',
   'Self jacquard shirt with embroidered organza dupatta for festive wear.',
   'JS-UN-0003', 8900.00, NULL, 1, 3, 'Sitara Studio', 'Jacquard', '2-piece', 'Shirt 3 m, Dupatta 2.5 m', 'Festive/Wedding', 'suit', 0, 1, NOW() - INTERVAL 12 DAY),

  (10, 'Premium Swiss Lawn (per meter)', 'premium-swiss-lawn-per-meter',
   'Fine Swiss lawn fabric sold by the meter. Breathable and easy to stitch. Minimum 1 meter.',
   'JS-FB-0001', 850.00, NULL, 1, 4, 'Gul Bahar', 'Lawn', NULL, NULL, 'Summer', 'meter', 0, 1, NOW() - INTERVAL 2 DAY),
  (11, 'Pure Silk Dupatta Fabric (per meter)', 'pure-silk-dupatta-fabric-per-meter',
   'Lustrous pure silk in jewel tones, perfect for dupattas and linings.',
   'JS-FB-0002', 1950.00, 1700.00, 1, 4, 'Reshmi House', 'Silk', NULL, NULL, 'Festive/Wedding', 'meter', 0, 1, NOW() - INTERVAL 7 DAY),
  (12, 'Linen Winter Fabric (per meter)', 'linen-winter-fabric-per-meter',
   'Soft brushed linen for winter shirts and trousers.',
   'JS-FB-0003', 1100.00, NULL, 1, 4, 'Winter Loom', 'Linen', NULL, NULL, 'Winter', 'meter', 0, 1, NOW() - INTERVAL 15 DAY);

-- Variants. Stitched items vary by size + color, unstitched/fabric by color only.
INSERT INTO `product_variants` (`id`, `product_id`, `size`, `color`, `color_hex`, `stock_quantity`, `sku`) VALUES
  -- 1 Zareen
  (1, 1, 'S', 'Gold',    '#D4AF37', 2, 'JS-PW-0001-S-GLD'),
  (2, 1, 'M', 'Gold',    '#D4AF37', 4, 'JS-PW-0001-M-GLD'),
  (3, 1, 'L', 'Gold',    '#D4AF37', 3, 'JS-PW-0001-L-GLD'),
  (4, 1, 'M', 'Maroon',  '#6E1E3A', 0, 'JS-PW-0001-M-MRN'),
  -- 2 Mehrunnisa
  (5, 2, 'S', 'Maroon',  '#6E1E3A', 1, 'JS-PW-0002-S-MRN'),
  (6, 2, 'M', 'Maroon',  '#6E1E3A', 2, 'JS-PW-0002-M-MRN'),
  (7, 2, 'L', 'Maroon',  '#6E1E3A', 2, 'JS-PW-0002-L-MRN'),
  -- 3 Gulnar - low stock (only 1 left overall)
  (8, 3, 'M', 'Emerald', '#1E4D3B', 1, 'JS-PW-0003-M-EMR'),
  (9, 3, 'L', 'Emerald', '#1E4D3B', 0, 'JS-PW-0003-L-EMR'),
  -- 4 Falak
  (10, 4, 'S',  'Blush', '#E6B8B0', 6, 'JS-CW-0001-S-BLS'),
  (11, 4, 'M',  'Blush', '#E6B8B0', 8, 'JS-CW-0001-M-BLS'),
  (12, 4, 'L',  'Blush', '#E6B8B0', 5, 'JS-CW-0001-L-BLS'),
  (13, 4, 'XL', 'Blush', '#E6B8B0', 3, 'JS-CW-0001-XL-BLS'),
  (14, 4, 'M',  'Ivory', '#F4ECD8', 4, 'JS-CW-0001-M-IVR'),
  -- 5 Aiza
  (15, 5, 'S', 'Blush', '#E6B8B0', 3, 'JS-CW-0002-S-BLS'),
  (16, 5, 'M', 'Blush', '#E6B8B0', 5, 'JS-CW-0002-M-BLS'),
  (17, 5, 'L', 'Blush', '#E6B8B0', 2, 'JS-CW-0002-L-BLS'),
  -- 6 Hania - SOLD OUT
  (18, 6, 'M', 'Brown', '#5C3A21', 0, 'JS-CW-0003-M-BRN'),
  (19, 6, 'L', 'Brown', '#5C3A21', 0, 'JS-CW-0003-L-BRN'),
  -- 7 Bareeze style
  (20, 7, 'Unstitched', 'Emerald', '#1E4D3B', 7, 'JS-UN-0001-EMR'),
  (21, 7, 'Unstitched', 'Maroon',  '#6E1E3A', 5, 'JS-UN-0001-MRN'),
  (22, 7, 'Unstitched', 'Ivory',   '#F4ECD8', 4, 'JS-UN-0001-IVR'),
  -- 8 Karandi
  (23, 8, 'Unstitched', 'Mustard', '#C9A227', 6, 'JS-UN-0002-MST'),
  (24, 8, 'Unstitched', 'Navy',    '#1F2A44', 4, 'JS-UN-0002-NVY'),
  -- 9 Jacquard
  (25, 9, 'Unstitched', 'Gold',    '#D4AF37', 3, 'JS-UN-0003-GLD'),
  (26, 9, 'Unstitched', 'Blush',   '#E6B8B0', 2, 'JS-UN-0003-BLS'),
  -- 10 Swiss lawn (meters)
  (27, 10, 'Unstitched', 'White',   '#F7F7F2', 60, 'JS-FB-0001-WHT'),
  (28, 10, 'Unstitched', 'Sky',     '#9CC3D5', 35, 'JS-FB-0001-SKY'),
  (29, 10, 'Unstitched', 'Blush',   '#E6B8B0', 42, 'JS-FB-0001-BLS'),
  -- 11 Silk
  (30, 11, 'Unstitched', 'Emerald', '#1E4D3B', 25, 'JS-FB-0002-EMR'),
  (31, 11, 'Unstitched', 'Maroon',  '#6E1E3A', 18, 'JS-FB-0002-MRN'),
  (32, 11, 'Unstitched', 'Gold',    '#D4AF37', 30, 'JS-FB-0002-GLD'),
  -- 12 Linen
  (33, 12, 'Unstitched', 'Standard', NULL, 48, 'JS-FB-0003-STD');

-- Placeholder images (SVG files shipped in assets/img/placeholders/).
INSERT INTO `product_images` (`product_id`, `image_path`, `thumb_path`, `alt_text`, `is_primary`, `sort_order`) VALUES
  (1,  'assets/img/placeholders/p01.svg', 'assets/img/placeholders/p01.svg', 'Zareen Embroidered Chiffon Suit', 1, 0),
  (1,  'assets/img/placeholders/p02.svg', 'assets/img/placeholders/p02.svg', 'Zareen Embroidered Chiffon Suit - back', 0, 1),
  (2,  'assets/img/placeholders/p02.svg', 'assets/img/placeholders/p02.svg', 'Mehrunnisa Velvet Formal', 1, 0),
  (3,  'assets/img/placeholders/p03.svg', 'assets/img/placeholders/p03.svg', 'Gulnar Net Maxi', 1, 0),
  (4,  'assets/img/placeholders/p04.svg', 'assets/img/placeholders/p04.svg', 'Falak Printed Lawn Kurti', 1, 0),
  (4,  'assets/img/placeholders/p05.svg', 'assets/img/placeholders/p05.svg', 'Falak Printed Lawn Kurti - detail', 0, 1),
  (5,  'assets/img/placeholders/p05.svg', 'assets/img/placeholders/p05.svg', 'Aiza Cotton Two Piece', 1, 0),
  (6,  'assets/img/placeholders/p06.svg', 'assets/img/placeholders/p06.svg', 'Hania Khaddar Kurta', 1, 0),
  (7,  'assets/img/placeholders/p07.svg', 'assets/img/placeholders/p07.svg', 'Embroidered Lawn 3pc', 1, 0),
  (8,  'assets/img/placeholders/p08.svg', 'assets/img/placeholders/p08.svg', 'Karandi Winter Unstitched', 1, 0),
  (9,  'assets/img/placeholders/p09.svg', 'assets/img/placeholders/p09.svg', 'Jacquard Festive Unstitched', 1, 0),
  (10, 'assets/img/placeholders/p10.svg', 'assets/img/placeholders/p10.svg', 'Premium Swiss Lawn', 1, 0),
  (11, 'assets/img/placeholders/p11.svg', 'assets/img/placeholders/p11.svg', 'Pure Silk Fabric', 1, 0),
  (12, 'assets/img/placeholders/p12.svg', 'assets/img/placeholders/p12.svg', 'Linen Winter Fabric', 1, 0);

-- Opening stock movements so the audit trail starts correctly.
INSERT INTO `stock_movements` (`variant_id`, `change_qty`, `reason`, `note`)
SELECT `id`, `stock_quantity`, 'initial', 'Demo seed opening stock'
FROM `product_variants` WHERE `stock_quantity` > 0;
