# alirazaworks.com

Single-page portfolio for **Ali Raza** — data analyst, BI developer and automation specialist (Lahore, Pakistan).
Plain HTML, CSS and JavaScript. No build step, no framework, no tracking.

## Edit the site

| What | Where |
|---|---|
| Upwork link, LinkedIn, email, WhatsApp/phone, optional booking link | `config.js` (one place; every button updates) |
| Copy, services, portfolio items, reviews, timeline | `index.html` (plain HTML sections, labelled with comments) |
| Colours, type, spacing | `assets/css/styles.css` (`:root` variables at the top) |
| Portrait photos and dashboard previews | `assets/img/` (JPEG + WebP pairs) |
| Downloadable samples linked from the Work section | `samples/` |
| Favicon, app icons, social share image | `assets/img/favicon.svg`, `icon-*.png`, `apple-touch-icon.png`, `og.png` |

The contact form posts to **Netlify Forms** (`data-netlify="true"`), so submissions show up in the Netlify dashboard
under *Forms → contact* with no server code. The "Send via WhatsApp" button opens a pre-filled chat instead.

Old multi-page URLs (`/about.html`, `/portfolio.html`, …) redirect to the matching section of the new page via `_redirects`.

## Run locally

```bash
cd alirazaworks
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to Netlify

Either connect the GitHub repository (publish directory `alirazaworks`, no build command; `netlify.toml` at the
repository root already says this), or drag the `alirazaworks` folder onto https://app.netlify.com/drop.
Point the `alirazaworks.com` custom domain at the site in Netlify's *Domain management* as before.
