-- =====================================================================
--  Jalal Sons Cloth House - Database schema
--  MySQL 8 / MariaDB 10.6+, InnoDB, utf8mb4_unicode_ci
--  Import this file FIRST, then database/seed.sql (and optionally
--  database/seed_demo.sql).
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+05:00';
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `jalal_sons`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `jalal_sons`;

-- ---------------------------------------------------------------------
--  CATALOG
-- ---------------------------------------------------------------------

-- Gender level: Women, Men, Kids/Children
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(80)  NOT NULL,
  `slug`       VARCHAR(90)  NOT NULL,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `ix_categories_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cloth type level: Party Wear, Casual Wear, Unstitched, Fabrics, ...
DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE `subcategories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `name`        VARCHAR(80)  NOT NULL,
  `slug`        VARCHAR(90)  NOT NULL,
  `icon`        VARCHAR(40)  NULL COMMENT 'Icon key used by the storefront (dress, kameez, dupatta, fabric)',
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `sort_order`  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_subcategories_cat_slug` (`category_id`, `slug`),
  KEY `ix_subcategories_active_sort` (`category_id`, `is_active`, `sort_order`),
  CONSTRAINT `fk_subcategories_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id`             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(150)  NOT NULL,
  `slug`           VARCHAR(170)  NOT NULL,
  `description`    TEXT          NULL,
  `sku`            VARCHAR(40)   NOT NULL,
  `base_price`     DECIMAL(10,2) NOT NULL,
  `sale_price`     DECIMAL(10,2) NULL,
  `category_id`    INT UNSIGNED  NOT NULL,
  `subcategory_id` INT UNSIGNED  NOT NULL,
  `brand`          VARCHAR(80)   NULL,
  `fabric`         VARCHAR(60)   NULL,
  `pieces`         ENUM('1-piece','2-piece','3-piece') NULL,
  `inclusions`     VARCHAR(255)  NULL COMMENT 'e.g. Shirt 3 m, Dupatta 2.5 m, Trouser 2.5 m',
  `season`         ENUM('Summer','Winter','Mid-Season','Festive/Wedding') NULL,
  `sale_unit`      ENUM('piece','suit','meter') NOT NULL DEFAULT 'piece',
  `is_featured`    TINYINT(1)    NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1)    NOT NULL DEFAULT 1,
  `deleted_at`     DATETIME      NULL,
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  UNIQUE KEY `uq_products_sku`  (`sku`),
  KEY `ix_products_category`    (`category_id`),
  KEY `ix_products_subcategory` (`subcategory_id`),
  KEY `ix_products_brand`       (`brand`),
  KEY `ix_products_fabric`      (`fabric`),
  KEY `ix_products_live`        (`is_active`, `deleted_at`, `created_at`),
  KEY `ix_products_featured`    (`is_featured`, `is_active`),
  KEY `ix_products_prices`      (`base_price`, `sale_price`),
  KEY `ix_products_name`        (`name`),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_subcategory`
    FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock lives here. Size is 'Unstitched' for unstitched/fabric products,
-- color is 'Standard' when there is a single color. Never NULL.
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`     INT UNSIGNED NOT NULL,
  `size`           VARCHAR(30)  NOT NULL DEFAULT 'Unstitched',
  `color`          VARCHAR(40)  NOT NULL DEFAULT 'Standard',
  `color_hex`      CHAR(7)      NULL,
  `stock_quantity` INT UNSIGNED NOT NULL DEFAULT 0,
  `sku`            VARCHAR(60)  NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_variants_sku` (`sku`),
  UNIQUE KEY `uq_variants_product_size_color` (`product_id`, `size`, `color`),
  KEY `ix_variants_stock` (`stock_quantity`),
  KEY `ix_variants_size`  (`size`),
  KEY `ix_variants_color` (`color`),
  CONSTRAINT `fk_variants_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL COMMENT 'Relative to web root, e.g. uploads/products/12/abc.jpg',
  `thumb_path` VARCHAR(255) NULL,
  `alt_text`   VARCHAR(150) NULL,
  `is_primary` TINYINT(1)   NOT NULL DEFAULT 0,
  `sort_order` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ix_images_product_primary` (`product_id`, `is_primary`, `sort_order`),
  CONSTRAINT `fk_images_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  SALES
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id`                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `order_number`        VARCHAR(20)   NOT NULL COMMENT 'JS-YYMMDD-0001',
  `channel`             ENUM('web','shop','whatsapp') NOT NULL DEFAULT 'web',
  `customer_name`       VARCHAR(120)  NOT NULL,
  `phone`               VARCHAR(20)   NOT NULL,
  `address`             VARCHAR(255)  NULL,
  `city`                VARCHAR(80)   NULL,
  `notes`               TEXT          NULL,
  `payment_method`      ENUM('cod','cash','bank_transfer') NOT NULL DEFAULT 'cod',
  `payment_status`      ENUM('unpaid','paid') NOT NULL DEFAULT 'unpaid',
  `status`              ENUM('pending','confirmed','dispatched','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
  `subtotal`            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `delivery_charge`     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount`            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total`               DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock_restored_at`   DATETIME      NULL COMMENT 'Set once when a cancel/return restores stock',
  `created_by_admin_id` INT UNSIGNED  NULL,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orders_number` (`order_number`),
  KEY `ix_orders_status`   (`status`),
  KEY `ix_orders_channel`  (`channel`),
  KEY `ix_orders_phone`    (`phone`),
  KEY `ix_orders_created`  (`created_at`),
  KEY `ix_orders_admin`    (`created_by_admin_id`),
  CONSTRAINT `fk_orders_admin`
    FOREIGN KEY (`created_by_admin_id`) REFERENCES `admins` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Per-day counter behind order numbers (JS-YYMMDD-0001). One row per day,
-- updated atomically so simultaneous orders never collide or deadlock.
DROP TABLE IF EXISTS `order_sequences`;
CREATE TABLE `order_sequences` (
  `seq_date`    DATE         NOT NULL,
  `last_number` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`seq_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Snapshots of name / variant / sku / price at order time.
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `order_id`      INT UNSIGNED  NOT NULL,
  `product_id`    INT UNSIGNED  NOT NULL,
  `variant_id`    INT UNSIGNED  NULL,
  `product_name`  VARCHAR(150)  NOT NULL,
  `variant_label` VARCHAR(80)   NOT NULL,
  `sku`           VARCHAR(60)   NOT NULL,
  `unit_price`    DECIMAL(10,2) NOT NULL,
  `quantity`      INT UNSIGNED  NOT NULL,
  `line_total`    DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_items_order`   (`order_id`),
  KEY `ix_items_product` (`product_id`),
  KEY `ix_items_variant` (`variant_id`),
  CONSTRAINT `fk_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_items_variant`
    FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit trail of every stock change.
DROP TABLE IF EXISTS `stock_movements`;
CREATE TABLE `stock_movements` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `variant_id` INT UNSIGNED NOT NULL,
  `change_qty` INT          NOT NULL COMMENT 'Signed: negative for sales',
  `reason`     ENUM('initial','restock','sale','cancel_restore','return','adjustment') NOT NULL,
  `order_id`   INT UNSIGNED NULL,
  `admin_id`   INT UNSIGNED NULL,
  `note`       VARCHAR(255) NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_movements_variant` (`variant_id`, `created_at`),
  KEY `ix_movements_order`   (`order_id`),
  KEY `ix_movements_reason`  (`reason`),
  CONSTRAINT `fk_movements_variant`
    FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_movements_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_movements_admin`
    FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  SYSTEM
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100) NOT NULL,
  `username`      VARCHAR(50)  NOT NULL,
  `email`         VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          ENUM('owner','staff') NOT NULL DEFAULT 'staff',
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `last_login_at` DATETIME     NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_username` (`username`),
  UNIQUE KEY `uq_admins_email`    (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Login throttling: 5 failures per username+IP in 15 minutes.
DROP TABLE IF EXISTS `login_attempts`;
CREATE TABLE `login_attempts` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`     VARCHAR(50)  NOT NULL,
  `ip_address`   VARCHAR(45)  NOT NULL,
  `attempted_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_attempts_lookup` (`username`, `ip_address`, `attempted_at`),
  KEY `ix_attempts_time`   (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Key/value store for store details and policies.
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `setting_key`   VARCHAR(80) NOT NULL,
  `setting_value` TEXT        NULL,
  `updated_at`    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages sent from contact.php
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(120) NOT NULL,
  `phone`      VARCHAR(20)  NOT NULL,
  `email`      VARCHAR(150) NULL,
  `message`    TEXT         NOT NULL,
  `ip_address` VARCHAR(45)  NULL,
  `is_read`    TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_messages_read_created` (`is_read`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
