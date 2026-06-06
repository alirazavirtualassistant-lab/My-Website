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
Ali Raza Premium Website/
├── index.html               Single-page premium site
├── css/styles.css           Full design system (1 file, ~30KB unminified)
├── js/script.js             Animations + interactions (~7KB)
├── assets/                  Profile photos + dashboard previews (unchanged from v1)
├── documents/               Word docs (resume, reports, e-book, templates)
├── spreadsheets/            Excel deliverables
├── code_samples/            Python / SQL / R / VBA samples
├── case_studies/            Power BI / Tableau / SPSS / n8n cases
├── presentations/           PowerPoint decks
├── robots.txt · sitemap.xml · _headers
└── README.md
```

## Live integrations

| Integration | Status | Where to update |
|---|---|---|
| WhatsApp click-to-chat | ✅ Live — `+92 345 4371509` | search `wa.me/923454371509` in `index.html` |
| Email mailto: | ✅ Live — `alirazavirtualassistant@gmail.com` | search `mailto:` in `index.html` |
| Direct call tel: | ✅ Live — `+92 345 4371509` | search `tel:+923454371509` |
| Fiverr profile | ✅ Live — `https://www.fiverr.com/s/5rzzgxE` | already wired |
| Calendly embed | ⚙️ **Placeholder** — `calendly.com/alirazaworks/15min` | sign up at calendly.com, replace the URL in the `<iframe>` and the two "Open Calendly" links |
| Stripe payment link | ⚙️ **Placeholder** — `buy.stripe.com/your-link-here` | create a Payment Link at stripe.com → replace URL inside the Stripe `pay-card` |
| PayPal.me | ⚙️ **Placeholder** — `paypal.me/alirazaworks` | claim your handle at paypal.me → replace URL inside the PayPal `pay-card` |
| Payoneer / Wise | ⚙️ Placeholder URLs | swap `payoneer.com/payme/alirazaworks` and `wise.com/pay/me/alirazaworks` for your real Payee links |
| JazzCash / EasyPaisa | ⚙️ Generic checkout URLs | swap for your actual merchant portal if you have one |
| Contact form | ⚙️ Sends via WhatsApp (no server needed). To receive by email instead, sign up at [Formspree.io](https://formspree.io) and replace the `submit` JS handler with `<form action="https://formspree.io/f/YOURID" method="POST">` |
| Google Maps | Using OpenStreetMap embed (no API key). Swap the iframe `src` for a Google Maps embed if you prefer |

## Run locally
Just open `index.html` in any browser. Or:
```bash
cd "Ali Raza Premium Website"
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
