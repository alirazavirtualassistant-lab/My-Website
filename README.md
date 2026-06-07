# myersmorrison.com — Enhanced Staging Preview

A fast, accessible, responsive **enhanced rebuild** of [myersmorrison.com](https://www.myersmorrison.com/) for **Cynthia Myers-Morrison, EdD** — Certified Food Addiction Professional, author, and Vice Chair of the Food Addiction Institute.

This repository hosts a **staging preview only**. The live Wix site at myersmorrison.com is **not modified** by anything here.

## 🔎 Preview URL

Once the **Deploy staging preview** GitHub Action finishes, the site is published at:

```
https://alirazavirtualassistant-lab.github.io/my-website/
```

The source lives in [`site/`](site/) and is served as-is (no build step).

## 💳 Payments policy — unchanged from the live site

Per the owner's instruction, **all payment links match the existing live site** — there is **no Stripe/PayPal** added:

| Item | Where the button goes |
|---|---|
| SUGAR® Assessment ($497) | `myersmorrison.com/product-page/sugar-assessment` |
| Customized Food Plan ($597) | `myersmorrison.com/product-page/customized-food-plan` |
| Genogram Discovery ($697) | `myersmorrison.com/product-page/genogram-discovery-program` |
| Food Addiction Coaching (from $297) | `myersmorrison.com/product-page/food-addiction-coaching` |
| The Fix for Cravings | Amazon `/dp/1796091650` |
| We Eat Rainbows! | Amazon `/dp/B0CD4D9RW2` |
| 3 research papers | their free `$0` myersmorrison.com product pages |

Checkout always completes on the official myersmorrison.com Wix store (PCI-compliant) or Amazon.

## ✨ What was enhanced in this pass

- Converted every purchase button from broken **Stripe placeholders** (`href="#"`) to the **existing live checkout links** above.
- Fixed the Genogram product slug (`genogram-discovery` → `genogram-discovery-program`) in the button, canonical tag, and sitemap.
- Aligned book "Buy on Amazon" links to the live Amazon listings.
- Removed the dead Stripe JS handler; added keyboard accessibility to the video cards.
- Corrected Stripe/PayPal copy on the shop and privacy pages to describe the real Wix checkout.

Content, design system, SEO tags, and structure come from the provided rebuild kit and mirror the live site's data (pulled live from the Wix store, bookings, testimonials, and research collections).

## 🖥️ Run locally

```bash
cd site
python3 -m http.server 8080
# visit http://localhost:8080
```

See [`site/README.md`](site/README.md) for full developer notes.
