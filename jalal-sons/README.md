# Jalal Sons Cloth House - E-commerce Website + PHP Admin Panel

**Pure Core PHP 8.2+, no framework.** PDO + MySQL/MariaDB, Bootstrap 5.3, vanilla JavaScript.
Runs unchanged on cPanel shared hosting (Apache) and on XAMPP / Laragon.

A ladies' cloth house in Lahore going online: the same stock is sold over the counter
and on the website, so the admin panel records walk-in sales too and every report
uses one definition of "sold".

## Features

**Storefront** (`index.php`, `shop.php`, `product.php`, `cart.php`, `checkout.php`)
- Black & gold design from the shop's business card; mobile-first from 360 px
- Homepage banner, product-line tiles, New Arrivals / On Sale / Featured (live from the DB)
- Filters: gender, cloth type, price, availability, brand, fabric, size, colour, on sale; shareable URLs
- Product page: gallery, size/colour selectors (unavailable combos disabled), live stock indicator,
  Add to Cart, **Order on WhatsApp** with pre-filled message, size guide, related products
- Guest checkout, Cash on Delivery, delivery charge & free-delivery threshold from settings
- SEO: unique titles, Open Graph, JSON-LD (ClothingStore + Product/Offer), `sitemap.php`

**Admin panel** (`/admin`)
- Secure login (`password_hash`/`password_verify`, throttling, CSRF, 30-min idle timeout), owner/staff roles
- Products: dependent category dropdowns, pricing, variants with stock, multi-image upload
  (JPEG/PNG/WebP, verified & re-encoded with GD, 1600 px + 600 px thumbnail)
- Quick +/- stock adjustments with reasons; every change logged in `stock_movements`
- Orders with status flow (cancel/return restores stock once), invoice & packing slip
- **Shop sale** screen for walk-in customers (same stock deduction as web orders)
- Dashboard: Total Products, Items Sold, Remaining Stock, revenue, pending orders, low stock, 30-day chart
- Inventory & sales report with filters, sorting, totals, and **one-click CSV export**
  (`export_inventory.php`, UTF-8 BOM for Excel, formula-injection safe; XLSX when PhpSpreadsheet is installed)
- Settings (owner only), admin users, change password, contact messages

## Requirements

- PHP 8.2 or newer with `pdo_mysql`, `gd`, `fileinfo`, `mbstring`
- MySQL 8 or MariaDB 10.6+
- Apache with `mod_rewrite` (for `.htaccess`), or any server that runs PHP

## Installation on XAMPP (Windows / macOS)

1. Copy the `jalal-sons` folder into `C:\xampp\htdocs\` (so you have `C:\xampp\htdocs\jalal-sons\index.php`).
2. Start **Apache** and **MySQL** in the XAMPP control panel.
3. Open phpMyAdmin (`http://localhost/phpmyadmin`) and import, in this order:
   - `database/schema.sql` (creates the `jalal_sons` database and all tables)
   - `database/seed.sql` (categories, cloth types, store settings) - required
   - `database/seed_demo.sql` (12 sample products) - optional, for trying it out
4. Copy `config/config.sample.php` to `config/config.php` and edit:
   ```php
   'base_url' => 'http://localhost/jalal-sons',
   'db' => ['host' => '127.0.0.1', 'name' => 'jalal_sons', 'user' => 'root', 'pass' => ''],
   ```
   Set `'env' => 'development'` while testing to see errors on screen.
5. Make sure `uploads/products/` and `storage/logs/` are writable (they are by default on XAMPP).
6. Open `http://localhost/jalal-sons/install/create-admin.php`, create the owner account,
   then **delete the `install` folder**.
7. Log in at `http://localhost/jalal-sons/admin/login.php` and add your first product.
   It appears on `http://localhost/jalal-sons/` immediately.

## Installation on cPanel shared hosting

1. **Database**: cPanel > *MySQL Databases*. Create a database (e.g. `user_jalalsons`), a user with a
   strong password, and add the user to the database with *All privileges*.
2. **Import**: cPanel > *phpMyAdmin*. Select the new database and import `database/schema.sql`
   (delete its first two lines `CREATE DATABASE ...` / `USE ...` if your host does not allow them),
   then `database/seed.sql`. Skip `seed_demo.sql` on a real shop.
3. **Upload**: upload everything inside `jalal-sons/` to `public_html/` (for the main domain) or to a
   sub-domain's document root, using *File Manager* or FTP.
4. **Configure**: rename `config/config.sample.php` to `config/config.php` and set `base_url`
   (e.g. `https://jalalsons.pk`), the database name/user/password, and `'force_https' => true`
   once SSL is active (cPanel > *SSL/TLS Status* > *Run AutoSSL*).
5. **Permissions**: `uploads/products` and `storage/logs` need to be writable (755 is usually enough
   on cPanel because PHP runs as your user; use 775 if uploads fail).
6. **PHP version**: cPanel > *MultiPHP Manager* > choose PHP 8.2 or newer.
   In *MultiPHP INI Editor* set `upload_max_filesize = 6M`, `post_max_size = 50M`.
7. Visit `https://yourdomain/install/create-admin.php`, create the owner account, then delete the
   `install` folder in File Manager.
8. Optional clean URLs: `.htaccess` already contains the rules. Set `'clean_urls' => true` in
   `config/config.php` and test `/product/some-slug`.
9. Optional XLSX export: run `composer require phpoffice/phpspreadsheet` in the site root
   (cPanel > *Terminal*). CSV export works without it.

## Day-to-day use

| Task | Where |
|---|---|
| Add / edit products, photos, prices, stock | Admin > Products |
| Quick stock +/- with a reason | Admin > Products > **Stock** button |
| Record a walk-in sale | Admin > Shop sale |
| Confirm, dispatch, cancel web orders | Admin > Orders |
| Print invoice / packing slip | Admin > Orders > open order > Print |
| Download stock & sales spreadsheet | Admin > Inventory report > **Download CSV** |
| Change phone, address, delivery charge, banner, policies | Admin > Settings (owner) |
| Switch on Men / Kids or new cloth types | Admin > Categories > Show |

## Project structure

```
index.php, shop.php, product.php, cart.php, checkout.php, order-success.php,
contact.php, about.php, policies.php, 404.php, sitemap.php, .htaccess
admin/        login, dashboard, products, add/edit-product, categories, orders, order-view,
              shop-sale, inventory-report, export_inventory, settings, admins, messages,
              change-password, ajax/, partials/
classes/      Auth, Csrf, Validator, Settings, Category, Product, Variant, ImageUploader,
              Cart, Order, Report, StockException
includes/     bootstrap.php, db.php, functions.php, header.php, footer.php, product-card.php
config/       config.sample.php  (copy to config.php)
database/     schema.sql, seed.sql, seed_demo.sql
install/      create-admin.php   (delete after use)
assets/       css/theme.css, css/admin.css, js/app.js, js/admin.js, img/
uploads/      product photos (writable, script execution blocked)
storage/logs/ application logs (writable, no web access)
```

## Earning from ads (optional)

Admin > Settings > **Ads & income**:

1. **Google AdSense**: apply at google.com/adsense with your live domain (AdSense needs a
   real domain, original content and the policy pages, which this site already has). Paste the
   publisher id (`ca-pub-...`), set *Show ads* to 1, create one "display ad" unit per position and
   paste each slot id. The site serves `/ads.txt` for you. Positions: homepage top and middle,
   shop grid and sidebar, product page bottom, and above the footer.
2. **Sponsor banner**: sell the banner space directly to a fabric brand or boutique. Upload their
   image, add their link and choose the positions. It shows wherever no AdSense slot is set.

Tip: ads earn a few rupees per thousand views; selling suits earns far more. The slots are placed
away from Add to Cart and Checkout on purpose. Leave *Show ads* at 0 until traffic grows.

## Security notes

- Every query uses prepared statements; `ORDER BY` columns are whitelisted.
- All output is escaped with `e()`; CSRF tokens on every POST; sessions are HttpOnly + SameSite=Lax.
- Uploads are checked by extension, `finfo` MIME type and `getimagesize()`, then re-encoded with GD
  under random names. `/uploads/.htaccess` blocks script execution.
- `/config`, `/classes`, `/includes`, `/database`, `/storage` are blocked by `.htaccess`.
- Errors are logged to `storage/logs/` and never shown when `env` is `production`.
- Delete `/install` after creating the owner account. Never commit `config/config.php`.

## Stock & sales rules

- Stock lives on variants (size + colour). Unstitched suits and fabrics use size `Unstitched`.
- Placing an order runs in one transaction with `UPDATE ... WHERE stock_quantity >= qty`;
  if any line fails the whole order rolls back and the customer is told how many are left.
- Cancelling or returning an order restores stock exactly once.
- Units sold / revenue = order items on orders that are not cancelled or returned.
  The dashboard, report and export all use this definition.
