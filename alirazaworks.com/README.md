# Ali Raza — Premium Portfolio (v2)

Cinematic billion-dollar-feel rebuild of `alirazaworks.com`. Pure static HTML / CSS / JS — no build step, deploy anywhere.

## What changed vs v1

| Area | v1 | v2 (this build) |
|---|---|---|
| Hero | Static headline | Word-by-word kinetic reveal, 3D-tilt portrait, animated aurora background, pulse-ring availability badge |
| Nav | Light glass bar | Sticky glass nav + theme toggle (dark/light, persisted), animated hamburger, scroll-shrink |
| About | Bio + cards | Bio + mission/vision/process cards + 4-step animated timeline + sticky photo |
| Services | 8 cards | 8 cards with spotlight cursor, animated icons, hover-lift, tag chips |
| Industries | 6 verticals | 8 verticals as glassmorphism cards |
| Portfolio | Tab filter | Same — but cards now have hover image zoom, gold-tag pill, "feat" 2-col spans, scroll reveals |
| Process | List | 4-column animated grid with giant gold numerals |
| Analytics | 4 charts | Same 4 charts, redesigned in gradient gold/violet/cyan palette, doughnut + radar added |
| Testimonials | 6 grid | 6 grid with hover lift, oversized quote glyph, dividers |
| **Booking** | (none) | **NEW — Calendly inline embed** + WhatsApp fallback CTA |
| Payment | 6 methods | 6 methods + click-to-copy account details + Stripe/PayPal placeholders |
| Contact | Form | 4 channel cards + form (Name/Email/Service/Budget/Message) + OpenStreetMap embed of Lahore |
| Footer | 3 cols | 4 cols + social icons + dynamic year |
| Micro-interactions | Limited | Custom cursor glow, spotlight on every card, magnetic buttons, scroll-triggered IntersectionObserver staggers |
| Theming | Dark only | Dark + light, toggle persisted in localStorage |
| Accessibility | Good | Same — plus `prefers-reduced-motion` respected, focus-visible, aria labels, semantic HTML |
| Perf | Lighthouse-ready | Same — fonts preconnected, hero preloaded, Chart.js deferred, no JS bundle, lazy-loaded images |

## Folder structure
```
alirazaworks.com/
├── index.html               Home
├── about.html · services.html · skills.html · portfolio.html
├── store.html               🛒 Template shop (Word / Excel / PowerPoint)  ← NEW
├── booking.html
├── payment.html             💳 Secure checkout — Payoneer + JazzCash only  ← UPDATED
├── contact.html
├── css/styles.css           Full design system (store + payment styles added)
├── js/script.js             Animations + interactions (store filter + ?item= handling)
├── assets/                  Profile photos, dashboard previews + Payoneer QR codes
│   ├── payoneer_qr_panel.svg   navy-on-white QR shown on the payment page
│   ├── payoneer_qr.svg         royal-blue transparent QR
│   └── payoneer_qr.png         downloadable QR (for print / sharing)
├── documents/               Word templates (resume, reports, e-book, etc.) — sold in store
├── spreadsheets/            Excel templates (dashboards, trackers, model) — sold in store
├── presentations/           PowerPoint decks — sold in store
├── code_samples/            Python / SQL / R / VBA samples
├── case_studies/            Power BI / Tableau / SPSS / n8n cases
├── robots.txt · sitemap.xml · _headers
└── README.md
```

## 🛒 Store (`store.html`)
A premium, filterable template shop selling the real editable files in `documents/`,
`spreadsheets/`, and `presentations/` — plus three bundles (Career Starter, Business Ops,
Analytics Pro). Each product card has a gradient cover (colored by file type), price,
feature list, a **Buy Now** button (routes to `payment.html?item=…`), and a **Sample ↓**
link that downloads the actual file as a preview. Filtering (All / Bundles / Word / Excel /
PowerPoint) reuses the shop filter in `js/script.js`. To change a price or add a product,
edit the `.product-card` markup in `store.html`.

## Live integrations

| Integration | Status | Where to update |
|---|---|---|
| WhatsApp click-to-chat | ✅ Live — `+92 345 4371509` | search `wa.me/923454371509` in `index.html` |
| Email mailto: | ✅ Live — `alirazavirtualassistant@gmail.com` | search `mailto:` in `index.html` |
| Direct call tel: | ✅ Live — `+92 345 4371509` | search `tel:+923454371509` |
| Fiverr profile | ✅ Live — `https://www.fiverr.com/s/5rzzgxE` | already wired |
| Calendly embed | ⚙️ **Placeholder** — `calendly.com/alirazaworks/15min` | sign up at calendly.com, replace the URL in the `<iframe>` and the two "Open Calendly" links |
| **Payoneer** (international) | ✅ **Live** — secure request link `link.payoneer.com/Token?t=…` + scannable QR | update the URL in `payment.html` (the `pay-scan` button, the Payoneer `pay-method` button, and its `data-copy`). Regenerate the QR if the link changes — see *Regenerating the QR* below |
| **JazzCash** (local / Pakistan) | ✅ **Live** — account `+92 328 4632954`, title *Ali Raza* | update the `data-copy` values + the WhatsApp confirm link in the JazzCash `pay-method` in `payment.html` |
| ~~Stripe / PayPal / Wise / EasyPaisa~~ | ❌ Removed | only Payoneer + JazzCash are offered, per the owner's instruction |
| Contact form | ⚙️ Sends via WhatsApp (no server needed). To receive by email instead, sign up at [Formspree.io](https://formspree.io) and replace the `submit` JS handler with `<form action="https://formspree.io/f/YOURID" method="POST">` |
| Google Maps | Using OpenStreetMap embed (no API key). Swap the iframe `src` for a Google Maps embed if you prefer |

## 💳 Payments — Payoneer + JazzCash only
Per the owner's instruction, the site offers exactly **two** payment methods:

- **Payoneer — international clients.** The payment page shows a **scannable QR code** and an
  *Open Secure Payoneer Link* button, both pointing at the live request link
  `https://link.payoneer.com/Token?t=…&src=pl`. Checkout completes on Payoneer's PCI-compliant page.
- **JazzCash — local (Pakistan) clients.** The account number and title are shown with
  click-to-copy; clients pay the PKR equivalent and tap *Confirm on WhatsApp* to share the receipt.

The **Store** "Buy Now" buttons link to `payment.html?item=<product>`, and the payment page shows
a banner with the selected item (handled in `js/script.js`).

### Regenerating the QR
The QR is a static asset committed under `assets/`. If the Payoneer link changes, regenerate it:
```bash
pip install segno
python3 - <<'PY'
import segno
url = "https://link.payoneer.com/Token?t=YOUR_NEW_TOKEN&src=pl"
qr = segno.make(url, error='h')
qr.save("assets/payoneer_qr_panel.svg", scale=10, border=3, dark="#0b1c3f", light="#ffffff")
qr.save("assets/payoneer_qr.svg",       scale=10, border=2, dark="#1d4ed8", light=None)
qr.save("assets/payoneer_qr.png",       scale=10, border=3, dark="#0b1c3f", light="#ffffff")
PY
```
Then update the matching URL in the three places inside `payment.html`.

## Run locally
Just open `index.html` in any browser. Or:
```bash
cd alirazaworks.com
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
**Netlify (recommended):** drag the whole folder onto https://app.netlify.com/drop
**Vercel / GitHub Pages / Cloudflare Pages / S3:** drop in, no config needed.

## Performance budgets met
- 0 framework runtime · 0 bundler · 0 web-server required
- Chart.js: lazy-loaded via CDN, `defer`
- Images: `loading="lazy"` everywhere except hero, which gets `fetchpriority="high"` + `<link rel="preload">`
- Fonts: preconnected, `display=swap`
- CSS: single file, ~30KB
- JS: single file, ~7KB
- Respects `prefers-reduced-motion`

## License
- Source code: MIT
- Profile photos: All rights reserved — Ali Raza
- Inter & Playfair Display fonts: SIL OFL
