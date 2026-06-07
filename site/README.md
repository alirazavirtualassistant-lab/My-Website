# MyersMorrison.com — Premium Redesign (static site)

A fast, accessible, fully responsive rebuild of myersmorrison.com for **Cynthia Myers-Morrison, EdD** — Certified Food Addiction Professional, author, and Vice Chair of the Food Addiction Institute.

Built with **plain HTML + CSS + JavaScript** (no build step, no framework lock-in) so it deploys anywhere and is easy to maintain. Brand: warm cream · sage/forest green · aubergine accent · coral CTA · Fraunces + Inter type.

---

## 1. File structure

```
site/
├── index.html                      Home
├── about.html                      About Cynthia (story, timeline, credentials)
├── programs.html                   Programs overview + "how it works"
├── programs/
│   ├── sugar-assessment.html       $497
│   ├── customized-food-plan.html   $597
│   ├── genogram-discovery.html     $697
│   └── food-addiction-coaching.html from $297
├── books.html                      The Fix for Cravings · We Eat Rainbows!
├── research.html                   Peer-reviewed papers + email-gated downloads
├── videos.html                     Categorized YouTube library
├── press.html                      Media, podcasts, press kit
├── book-online.html                Calendly scheduling embed
├── shop.html                       All products + checkout info
├── contact.html                    Contact form
├── privacy.html / terms.html       Legal (templates — have counsel review)
├── 404.html
├── assets/
│   ├── css/styles.css              Full design system
│   ├── js/main.js                  Nav, scroll-reveal, counters, FAQ, forms, checkout stubs
│   └── img/                        (drop localized images here — see §4)
├── robots.txt · sitemap.xml · site.webmanifest · _redirects
```

## 2. Run locally

It's static — just open `index.html`, or serve it:

```bash
cd site
python3 -m http.server 8080
# visit http://localhost:8080
```

## 3. Deploy (free hosting)

**Cloudflare Pages or Netlify** (recommended):
1. Push this `site/` folder to a Git repo (or drag-and-drop the folder into Netlify).
2. Build command: *none*. Publish directory: the folder itself.
3. Add the custom domain `myersmorrison.com` and let the host issue SSL.
4. The included `_redirects` file gives clean URLs (e.g. `/about`) and a custom 404 on Netlify. On Cloudflare Pages, the same file is supported.

> ⚠️ **Do not point DNS at the new host until launch is approved.** See the migration plan (`00_Migration_Plan.md`) for the zero-downtime cutover sequence — the live Wix site should stay up until this site is verified on the domain.

## 4. Images — important

To show Cynthia's real photos immediately, the pages currently reference her existing image URLs on the Wix CDN (`static.wixstatic.com`). **Before final launch, localize them** so the site no longer depends on Wix:

1. Download the originals from the Wix Media Manager (or save each referenced URL).
2. Convert to WebP/AVIF and place them in `assets/img/`.
3. Replace the `https://static.wixstatic.com/...` `src` values with local paths (e.g. `assets/img/portrait.webp`).

Every `<img>` already has `alt` text, `loading="lazy"` (except above-the-fold), and `decoding="async"`. YouTube thumbnails come from `img.youtube.com` and are fine to keep.

## 5. Payments — uses the EXISTING myersmorrison.com store (no Stripe)

Per the site owner's instruction, **payment links are unchanged from the live site**. Purchase buttons are plain links to the channels already in use — there is no Stripe/PayPal integration on this site:

1. **Paid services** link to their live Wix store product pages, and checkout completes on the official myersmorrison.com store (Wix PCI-compliant checkout):
   - SUGAR® Assessment $497 → `/product-page/sugar-assessment`
   - Customized Food Plan $597 → `/product-page/customized-food-plan`
   - Genogram Discovery $697 → `/product-page/genogram-discovery-program`
   - Food Addiction Coaching from $297 → `/product-page/food-addiction-coaching`
2. **Books** link to Amazon: *The Fix for Cravings* (`/dp/1796091650`) and *We Eat Rainbows!* (`/dp/B0CD4D9RW2`). Signed copies are arranged by email.
3. **Research papers** link to their free ($0) download product pages on myersmorrison.com.

> ⚠️ Do **not** swap these for Stripe/PayPal without the owner's approval. The existing Wix store and Amazon listings are the source of truth for all pricing and checkout.

## 6. Booking (Calendly)

`book-online.html` embeds Calendly inline with time-zone detection. Replace the `data-url` (currently `https://calendly.com/coachcynthiathefixforcravings`) with Cynthia's confirmed Calendly link and meeting types. Acuity or SimplyBook can be swapped in the same slot.

## 7. Newsletter / forms

Forms marked `data-demo` show a success state but don't send anywhere yet. To go live, point each form at your provider:
- **Mailchimp / ConvertKit / Buttondown:** paste the provider's embed form, or set the `<form action>` to their endpoint.
- The "Cradle Letter" lead magnet (free guide) and the Cradle Your Cravings waiting list are ready to wire to a list/automation.
- Intake (SUGAR PAE) and HIPAA consent forms can keep using Google Forms / JotForm embedded in an iframe.

## 8. Built-in best practices

- **Responsive** mobile-first; hamburger drawer; 44px+ touch targets; fluid type.
- **Accessibility:** semantic HTML, skip link, ARIA on nav/accordions, visible focus states, alt text, `prefers-reduced-motion` honored.
- **SEO:** unique titles/descriptions, canonical tags, Open Graph + Twitter cards, JSON-LD (Person on home), `sitemap.xml`, `robots.txt`. Add Product/Course/Article/Video/FAQ structured data per page as a future enhancement.
- **Performance:** system-font fallback, lazy-loaded images, minimal JS (~5KB, no dependencies), CSS variables. Localizing + compressing images (§4) is the main remaining Core Web Vitals win.

## 9. Editing content

No CMS — edit the HTML directly. Shared header/footer markup is repeated in each page; if you change navigation, update it across pages (or regenerate with `gen_site.py`). Prices live in the program pages and `shop.html`.

---

© Myers-Morrison.com. SUGAR® is a registered assessment methodology used under license.
Legal pages are templates — review with counsel before launch.
