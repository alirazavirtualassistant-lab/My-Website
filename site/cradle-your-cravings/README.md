# Cradle Your Cravings — premium SaaS-style site

A multi-page brand site and product preview for **Cradle Your Cravings**, the signature program by Cynthia Myers-Morrison, EdD. Built as a fast static site with **real interactive features** (working assessment quiz, animated dashboard mockup) — no backend required.

Brand: warm cream · moss · dusty rose · amber · blush. Type: **Fraunces** (display) + **Manrope** (body).

---

## File structure

```
cradle-your-cravings/
├── index.html              Home — hero, methodology, features, dashboard preview, pricing, FAQ
├── how-it-works.html       The 4-phase methodology
├── assessment.html         8-question interactive Trigger Assessment (WORKING)
├── dashboard.html          Member dashboard mockup (animated SVG chart)
├── journey.html            12-week program timeline
├── pricing.html            Free · Personal · Family · Practitioner tiers
├── community.html          Recovery circles
├── about.html              About Cynthia + credentials
├── resources.html          Library: papers, downloads, blog
├── signup.html             Account creation flow
├── contact.html            Contact form
├── privacy.html, terms.html
├── 404.html
├── assets/
│   ├── css/styles.css      Full design system
│   └── js/main.js          Interactions + quiz + dashboard chart
├── robots.txt · sitemap.xml · site.webmanifest · _redirects
```

## Run locally

```bash
cd cradle-your-cravings
python3 -m http.server 8080
# visit http://localhost:8080
```

## Deploy

**Cloudflare Pages or Netlify** (free tier):
1. Drag the folder into Netlify, or push to a Git repo and connect.
2. Build command: *none*. Publish directory: the folder itself.
3. Add the custom domain (e.g. `cradleyourcravings.com`) — SSL auto-issued.
4. `_redirects` gives clean URLs and a custom 404.

## Real interactive features

### Hidden Trigger Assessment (`assessment.html`)
A **fully working** 8-question quiz that:
- Tracks answers per question with weighted scoring across four profiles (sugar, ultra-processed, emotional, generational)
- Animates between questions and renders a personalized result page
- Computes a percentage profile for each dimension, plus a primary recommendation
- Links each profile to the appropriate Myers-Morrison program (SUGAR Assessment, Food Plan, Coaching, Genogram)
- "Retake" button to start over
- All client-side — no backend needed

### Member dashboard mockup (`dashboard.html`)
A high-fidelity preview of the SaaS interior:
- Sidebar nav with mock user
- Animated SVG craving-trend chart (14-day curve, rendered by `main.js`)
- 21-day streak grid
- Today's food commits with checked states
- 28-day calendar grid (last 21 days "held")
- Journey roadmap showing current phase
- Generational genogram preview (inline SVG)
- Recovery circle preview with member avatars
- Smart recommendation card

## Real payments / data (when you go live)

When this becomes a real SaaS, wire up:
- **Stripe** for subscriptions (Personal $19, Family $39, Practitioner $99) — Stripe Checkout works perfectly with static sites via Payment Links
- **Auth & data**: Supabase, Firebase, or Clerk for accounts; Postgres or Firestore for user data
- **Email**: Mailchimp / ConvertKit / Resend for the Cradle Letter

The current `data-demo` forms just show a success state — replace each form's submit handler with your provider's endpoint when integrating.

## Best practices baked in

- Mobile-first responsive with hamburger drawer (≤1020px)
- Accessibility: semantic HTML, skip link, ARIA on accordions / radio quiz options, visible focus states, `prefers-reduced-motion`
- SEO: unique meta, Open Graph, canonical tags, sitemap, robots
- Performance: lazy-loaded thumbnails, minimal vanilla JS, no dependencies
- Custom 404 + clean URL redirects

## Brand consistency with Myers-Morrison

Cradle uses the same display serif (Fraunces) as the parent Myers-Morrison brand for visual continuity, but a different body sans (Manrope vs. Inter) and a softer, more nurturing palette (warmer cream, dusty rose instead of bright coral) — so it reads as a distinct sub-brand that clearly belongs to Cynthia's ecosystem.

---

© Cradle Your Cravings · A program by Cynthia Myers-Morrison, EdD.
SUGAR® is a registered assessment methodology used under license. CFAP™ is the Certified Food Addiction Professional credential.
