-- =====================================================================
--  Jalal Sons Cloth House - Required seed data
--  Import AFTER schema.sql. Safe to re-run (uses INSERT ... ON DUPLICATE).
-- =====================================================================
SET NAMES utf8mb4;
USE `jalal_sons`;

-- Gender categories. Launch with Women only; Men and Kids can be switched
-- on from Admin > Categories when stock arrives.
INSERT INTO `categories` (`id`, `name`, `slug`, `is_active`, `sort_order`) VALUES
  (1, 'Women',          'women', 1, 1),
  (2, 'Men',            'men',   0, 2),
  (3, 'Kids/Children',  'kids',  0, 3)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `sort_order` = VALUES(`sort_order`);

-- Women subcategories. Active ones match the shop signage.
INSERT INTO `subcategories` (`id`, `category_id`, `name`, `slug`, `icon`, `is_active`, `sort_order`) VALUES
  (1, 1, 'Party Wear',  'party-wear',  'dress',   1, 1),
  (2, 1, 'Casual Wear', 'casual-wear', 'kameez',  1, 2),
  (3, 1, 'Unstitched',  'unstitched',  'dupatta', 1, 3),
  (4, 1, 'Fabrics',     'fabrics',     'fabric',  1, 4),
  (5, 1, 'Stitched',    'stitched',    'kameez',  0, 5),
  (6, 1, 'Pret',        'pret',        'kameez',  0, 6),
  (7, 1, 'Kurta',       'kurta',       'kameez',  0, 7),
  (8, 1, 'Western',     'western',     'dress',   0, 8),
  (9, 1, 'Formal',      'formal',      'dress',   0, 9),
  -- Men / Kids starters (inactive)
  (10, 2, 'Unstitched', 'unstitched',  'fabric',  0, 1),
  (11, 2, 'Kurta',      'kurta',       'kameez',  0, 2),
  (12, 3, 'Casual Wear','casual-wear', 'kameez',  0, 1),
  (13, 3, 'Party Wear', 'party-wear',  'dress',   0, 2)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `icon` = VALUES(`icon`), `sort_order` = VALUES(`sort_order`);

-- Business profile and storefront settings (edited in Admin > Settings).
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
  ('store_name',            'Jalal Sons Cloth House'),
  ('store_short_name',      'Jalal Sons'),
  ('proprietor',            'Ali Raza'),
  ('tagline',               'Variety of female clothes available'),
  ('phone',                 '0345-4371509'),
  ('phone_intl',            '+92 345 4371509'),
  ('whatsapp_number',       '923454371509'),
  ('email',                 ''),
  ('address',               'Madina Park, Bhatta Chowk, Bedia Road, Lahore'),
  ('city',                  'Lahore'),
  ('map_embed_url',         'https://www.google.com/maps?q=Bhatta+Chowk+Bedia+Road+Lahore&output=embed'),
  ('opening_hours',         'Monday to Saturday: 11:00 am - 10:00 pm\nSunday: 2:00 pm - 10:00 pm'),
  ('delivery_charge',       '250'),
  ('free_delivery_threshold','5000'),
  ('low_stock_threshold',   '3'),
  ('currency_prefix',       'Rs.'),
  ('banner_heading',        'Jalal Sons'),
  ('banner_subheading',     'Variety of female clothes available'),
  ('banner_text',           'Party wear, casual wear, unstitched suits and fine fabrics, hand-picked for the women of Lahore.'),
  ('banner_button_text',    'Shop the collection'),
  ('banner_button_link',    'shop.php'),
  ('banner_image',          ''),
  ('exchange_policy',       'Items can be exchanged within 7 days of delivery if unused, unwashed and with the original tags. Unstitched fabric that has been cut cannot be exchanged. Please bring or send your invoice.'),
  ('delivery_policy',       'We deliver all over Pakistan by courier. Orders are dispatched within 1 to 2 working days and usually arrive in 2 to 4 working days. Payment is Cash on Delivery.'),
  ('privacy_policy',        'We only use your name, phone number and address to deliver your order and to contact you about it. We never sell or share your details.'),
  ('about_text',            'Jalal Sons Cloth House is a ladies\' cloth house at Madina Park, Bhatta Chowk, Bedia Road, Lahore, run by Ali Raza. We stock party wear, casual wear, branded unstitched suits and fabrics by the meter, and now bring the same shelves online.'),
  ('facebook_url',          ''),
  ('instagram_url',         ''),
  ('tiktok_url',            ''),
  ('meta_description',      'Jalal Sons Cloth House, Lahore. Party wear, casual wear, unstitched suits and fabrics for women. Cash on delivery across Pakistan.')
ON DUPLICATE KEY UPDATE `setting_key` = VALUES(`setting_key`);
