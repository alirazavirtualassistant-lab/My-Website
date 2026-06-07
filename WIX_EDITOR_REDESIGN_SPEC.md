# myersmorrison.com — Wix Editor Redesign Spec (paste-ready)

**Goal:** recreate the enhanced look from the staging preview
(https://alirazavirtualassistant-lab.github.io/My-Website/) **inside the Wix Editor**,
then **Preview → Publish**. This is the only way to make the new design live on your
existing Wix site.

> 🔒 **GUARDRAIL — do NOT touch payments.** Leave the **Wix Stores** app, all **products,
> prices**, the **Cart/Checkout**, the **product pages** (`/product-page/...`), and the
> **"Buy on Amazon"** links exactly as they are. This spec only changes **design, layout,
> copy, and SEO**. When in doubt, don't edit a Store element.
>
> 💡 Use **Site History** (Editor top bar → menu → Site History) before big changes so you
> can revert. Edit in the Editor, click **Preview**, then **Publish** only when happy.

---

## 1. Design system (set once → applies site-wide)

### 1a. Colors — Editor → **Site Design → Color** (edit the theme palette)
Paste these hex values into your theme slots and reuse them everywhere:

| Role | Hex | Use for |
|---|---|---|
| Ink (primary text) | `#1E2420` | Body text, most headings |
| Forest (brand) | `#2F4A3A` | Dark section backgrounds, headings on light |
| Sage | `#5C7A66` | Secondary accents, small labels |
| Sage soft | `#8BA888` | Logo gradient, subtle accents |
| Aubergine | `#4A2C40` | Newsletter/lead blocks |
| Coral (CTA) | `#E2714E` | **Primary buttons only** |
| Coral dark | `#C95B39` | Button hover, link hover, eyebrow labels |
| Amber | `#E0A458` | Stars, stats on dark backgrounds |
| Cream | `#FAF6EF` | Default page background |
| Cream 2 | `#F3EBDD` | Alternating section background |
| Sand | `#ECE1CE` | Alternating section background |
| Hairline | `#E2D7C5` | Dividers, card borders |

### 1b. Fonts — Editor → **Site Design → Text**
- **Headings:** *Fraunces* (display serif). If it isn't in Wix's font list, **Upload Fonts**
  (Text panel → Upload Fonts, premium plans) or use the closest built-ins:
  **"Playfair Display"** or **"Cormorant Garamond."**
- **Body:** *Inter* (clean sans). Fallbacks if unavailable: **"Lato"** or **"Assistant."**

Suggested sizes (desktop):
- H1 ~ 56–64px · H2 ~ 34–44px · H3 ~ 22–26px · Body ~ 18px / line-height 1.7
- "Eyebrow" labels: 13px, UPPERCASE, letter-spacing 0.15em, color **Coral dark**

### 1c. Buttons — Editor → **Site Design → Button** (or style each button)
- **Primary** ("Take the SUGAR® Assessment", "Book a Session", "Purchase"): fill **Coral
  `#E2714E`**, text white, **fully rounded (pill)** corners, ~15px×28px padding.
- **Secondary / ghost** ("Learn more", "Read story"): transparent fill, **Forest** border +
  text; on hover fill Forest, text white.

---

## 2. Header & Footer (global — set on the master/site sections)

### 2a. Header (make it **sticky**: Header settings → "Stick to top")
- **Logo (left):** text logo — **Myers‑Morrison** with a small line under it:
  `FOOD ADDICTION RECOVERY` (uppercase, letter-spacing, color Sage).
- **Menu (center/right)** — link each item to the matching existing page:
  `About` · `Programs` · `Books` · `Research` · `Videos` · `Press`
- **Buttons (right):** `Shop` (ghost → your Store page) · `Book a Session` (primary → booking page)
- Background: Cream at ~85% opacity; add a subtle bottom shadow on scroll if your theme allows.

### 2b. Footer (4 columns)
1. **Brand + tagline:** "Science‑backed, compassionate recovery from food and sugar
   addiction — for you, your family, and generations to come." + social icons.
2. **Explore:** About · Programs · Books · Research & Articles · Videos
3. **Work with Cynthia:** SUGAR® Assessment · Customized Food Plan · Genogram Discovery ·
   Coaching · Book a Session
4. **Contact:** cynthiajmm@gmail.com · (215) 353‑7034 · Press & Media Kit · Contact form

**Social links (paste):**
- Facebook: https://www.facebook.com/cynthia.myersmorrison/
- Instagram: https://www.instagram.com/cindyjmm/
- LinkedIn: https://www.linkedin.com/in/cynthiamyersmorrison/
- YouTube: https://www.youtube.com/playlist?list=PLnEgmO43ZcYJq27_qXtongO6kxT7-tJmy

**Footer disclaimer (paste):**
> The information on this website is educational and is not a substitute for professional
> medical, psychological, or nutritional advice, diagnosis, or treatment. Always seek the
> guidance of a qualified health provider with any questions about a medical or mental‑health
> condition. SUGAR® is a registered assessment methodology used under license.

**Copyright line:** `© 2026 Myers‑Morrison.com · All rights reserved.` + links to Privacy Policy & Terms.

---

## 3. HOME page (rebuild as stacked Sections/Strips, top → bottom)

> In Wix: **Add (+) → Section/Strip**, then add Columns, Text, Buttons, Images. Alternate
> backgrounds Cream / Cream‑2 / Sand and one **Forest** band for contrast.

**1) Hero** (2 columns: text left, portrait right)
- Eyebrow: `CERTIFIED FOOD ADDICTION PROFESSIONAL · EdD`
- H1: `Freedom from food & sugar addiction — for you and generations to come.`
- Lead: `Science-backed, compassionate recovery guided by Cynthia Myers-Morrison, EdD — 27 years abstinent, three Master's degrees, and Vice Chair of the Food Addiction Institute.`
- Buttons: **Take the SUGAR® Assessment** (→ SUGAR product page) · **Join the Cradle Your Cravings Waiting List** (→ #waitlist section)
- Right: portrait photo of Cynthia. Optional floating badge: **54** "years free from alcohol & drugs · 27 years sugar-abstinent".

**2) Trust bar** (thin strip, centered): `AS SEEN & FEATURED WITH` — Food Junkies Podcast ·
Food Addiction Institute · Sugar Free Summit · Kick Sugar Summit · SUGARx Global

**3) Meet Cynthia** (2 columns: text + photo of her speaking)
- Eyebrow `MEET CYNTHIA` · H2: `Lived experience, clinical depth, and unwavering hope.`
- Paste: `I spent most of my life searching for freedom — from addiction, from shame, from the belief that something was "wrong" with me. My work today is the result of decades of personal recovery, academic study, and a deep commitment to helping others find the peace I once thought was impossible.`
- Paste: `A former Marriage & Family Therapist with a doctorate in education and three Master's degrees, I now help individuals and families break the generational chains of food and sugar addiction — with science, structure, and compassion.`
- Button: **Read Cynthia's story** (→ About)

**4) Cradle Your Cravings** (Forest background band — anchor id `waitlist`)
- Eyebrow `COMING SOON` · H2 `Cradle Your Cravings`
- Paste: `A signature program for individuals, families, and communities to find freedom from food cravings, achieve healthy lifestyles, and break generational health chains — through real food, enjoyable movement, and support designed around you. Includes comprehensive support for fertility, preconception, and long-term lifestyle maintenance.`
- Add a **Wix Form** (Add → Contact & Forms) titled "Join the Waiting List" (email field).

**5) Programs & assessments** (4 cards in a row — Add → **Wix Stores → Product Gallery**, OR
plain cards each linking to the existing product page). Cards:
- **SUGAR® Assessment** — `$497 one-time` — "A clinical, one-on-one assessment that identifies harmful or pathological use of sugar and food." → link to **existing** `/product-page/sugar-assessment`
- **Customized Food Plan** — `$597` — "A structured, personalized plan built from your assessment." → `/product-page/customized-food-plan`
- **Genogram Discovery** — `$697` — "Map the generational patterns behind your fears, compulsions, and motivations." → `/product-page/genogram-discovery-program`
- **Food Addiction Coaching** — `from $297` — "Personalized one-on-one recovery coaching, co-created around your goals." → `/product-page/food-addiction-coaching`

> ✅ Easiest + safest: use the **Wix Stores Product Gallery** widget so the buy buttons stay
> native. Don't hand-build checkout.

**6) Stats** (4 numbers): `54` Years in recovery · `2` Published books · `3` Peer-reviewed
papers · `4` Academic degrees

**7) Books** (2 cards): *The Fix for Cravings* (button → Amazon
`https://www.amazon.com/FIX-Cravings-didnt-which-WORKS/dp/1796091650/`) · *We Eat Rainbows!*
(button → Amazon `https://www.amazon.com/Eat-Rainbows-Cynthia-Myers-Morrison-EdD/dp/B0CD4D9RW2`)

**8) Research** (3 items → link to the existing free download product pages). Titles:
- Integrating the management of ultra-processed food addiction into type 2 diabetes
- Intergenerational Interventions to Address Epigenetics and the Food Environment
- Parental Obesity: Intergenerational Physical & Mental Health

**9) Video reel** — Add → **Video/YouTube** elements (these IDs):
`cqBMrdoge1c` (Recovery & Building Community) · `PGPdEvDPXMY` (My Food Addiction Story) ·
`5q8OOQGP3EU` (Food Junkies Podcast) · `OG9l2TTB1ks` (Overcome Emotional Eating)

**10) Testimonials** (3 cards, 5 stars each) — see real text in §4 below.

**11) Newsletter / lead magnet** (Aubergine band): H3 `Free guide: The 7 Trigger Foods That
Hijack Your Brain` + a Wix Form (first name + email).

**12) Closing CTA** (Forest→Sage gradient band): H2 `You are not alone, and you are not
broken.` + "Begin with a SUGAR® Assessment or book a conversation with Cynthia." + buttons.

**HOME SEO** (Page → SEO Basics):
- Title: `Cynthia Myers-Morrison, EdD | Food & Sugar Addiction Recovery`
- Description: `Cynthia Myers-Morrison, EdD — Certified Food Addiction Professional, author, and Vice Chair of the Food Addiction Institute. Science-backed, compassionate recovery from food and sugar addiction for you, your family, and generations to come.`
- Keep your Google verification token in **Settings → Marketing & SEO** (`fwIl9oa0Ok2Q9eq8yTrUamDpTHRU9QLurSFRY-DLbVA`).

---

## 4. Testimonials (real, paste-ready)

> "**Generous Spirit and Heart** — Cynthia is passionate about helping people recover from
> food addiction. She is such a support, cheerleader, and lioness to help you create a food
> plan and live a life of integrity and joy in recovery. She is a wealth of information and
> resources. An inspiration!"

> "**Exuded Compassion and Knowledge** — Cynthia is the consummate professional! She guided
> me through the SUGAR assessment with such ease and elegance. It was so apparent how amazingly
> invested and knowledgeable she is in the field of food addiction. She exuded gentleness,
> kindness and compassion from beginning to end and that was of utmost importance to me.
> THANK YOU Cynthia!"

> "**Unflagging Support and Kindness** — Cynthia helped me become abstinent from the foods
> that created cravings in me, such as sugar and grains. She pointed me to the support I
> needed to remain abstinent (for 14 years now!) and supported me through many conversations.
> Her compassion, wisdom, and knowledge of food addiction helped me enormously."

> "**A Great Listener** — After working with Cynthia, I eat fewer products made with white
> flour & sugar and more fruits and vegetables. I walk more and sleep better. Cynthia is
> knowledgeable, supportive and nonjudgmental — a great listener who authentically shares her
> own experiences."

---

## 5. ABOUT page

- Hero: eyebrow `ABOUT CYNTHIA` · H1 `Cynthia Myers-Morrison, EdD` · subhead *Wholehearted Commitment*.
- Body (paste the full story — this is your live About copy):

```
I have spent most of my life searching for freedom—freedom from addiction, from shame, from
the belief that something was "wrong" with me, and from the patterns that kept me stuck. My
work today is the result of decades of personal recovery, academic study, and a deep
commitment to helping others find the peace I once thought was impossible.

I have been free from alcohol and drugs for 54 years, and abstinent from grains and sugars
for 27. These milestones are not badges—they are reminders of what is possible when we
understand our brains, honor our biology, and receive the right support.

I hold a Doctorate in Education and three Master's degrees, and before specializing in food
addiction, I spent years as a Marriage & Family Therapist. I trained with the Institute for
Integrative Nutrition, ACORN Food Dependency Recovery Services, the Florida School of
Addiction Studies, INFACT, and SUGAR®. Today I am a Certified Food Addiction Professional
(CFAP™), SUGAR® Certified and Licensed, and trained in Holistic Medicine for Addiction by
Bitten Jonsson. I also studied trauma with Bessel van der Kolk.

I currently serve as Secretary and Vice Chair of the Board for the Food Addiction Institute
(FAI). I am the co-author of THE FIX for Cravings and We Eat Rainbows, and I use genograms to
help individuals and families release guilt, shame, and inherited patterns that no longer
serve them.

My work is lived, practiced, and continually renewed. I know the desperation of wanting to
stop and not being able to. I know the relief of finding a path that finally works. If you
are ready to explore a life beyond cravings, chaos, and self-judgment, I am here. You are not
alone, and you are not broken. There is a way forward, and together, we can find it.
```
- Optional: a **credentials** row (EdD & 3 Master's · CFAP™ Certified · SUGAR® Licensed · FAI Vice Chair) and a **timeline**.
- **SEO Title:** `About Cynthia Myers-Morrison, EdD | Food Addiction Professional` ·
  **Description:** `Decades of recovery, three Master's degrees, and a doctorate — meet Cynthia Myers-Morrison, EdD, Certified Food Addiction Professional and Vice Chair of the Food Addiction Institute.`

---

## 6. PROGRAMS — important Wix nuance

Your 4 program "detail pages" are **Wix Stores product pages** (`/product-page/...`) — you do
**not** rebuild them one by one. Instead:
1. Build a **Programs overview page** (regular page) with 4 cards → each links to its existing
   product page (URLs in §3, item 5).
2. The product pages themselves are styled via **Wix Editor → Store → Product Page** template
   (one design applies to all products). Style that template to match (fonts/colors/buttons),
   but **leave the Add‑to‑Cart / Buy button and price as-is.**
3. The product **descriptions & info sections** (the words on each product page) — I can polish
   these for you **via API** without touching prices/checkout. Just say the word.

**Programs SEO Title:** `Programs & Assessments | Cynthia Myers-Morrison, EdD` ·
**Description:** `Evidence-based pathways from first assessment to lasting recovery — the SUGAR® Assessment, Customized Food Plan, Genogram Discovery, and one-on-one Food Addiction Coaching.`

---

## 7. BOOKS · RESEARCH · VIDEOS · PRESS · CONTACT · BOOK ONLINE

- **Books:** two book sections with covers + blurbs; Amazon buttons (URLs in §3 item 7);
  "Amazon Author Page" → `https://www.amazon.com/kindle-dbs/entity/author/B08YPT1LB1`. For
  signed copies, link an email button: `mailto:cynthiajmm@gmail.com`.
- **Research:** 3 paper cards → existing free-download product pages; add a "get all papers"
  email form.
- **Videos:** embed the YouTube playlist
  (`https://www.youtube.com/playlist?list=PLnEgmO43ZcYJq27_qXtongO6kxT7-tJmy`) and the key
  video IDs from §3 item 9 (Add → Video).
- **Press:** bios + logos; link Food Addiction Institute profile and PRLog. (Pull bios from
  your asset spreadsheet's Press Kit sheet.)
- **Contact:** keep your existing **Wix Form** + show email `cynthiajmm@gmail.com`, phone
  `(215) 353-7034`. Don't rebuild the form from scratch — restyle it.
- **Book Online:** keep your existing **Wix Bookings** "Free Discovery Call" widget
  (recommended, it's already installed), OR embed Calendly via **Add → Embed → Embed a Widget**
  using `https://calendly.com/coachcynthiathefixforcravings`.

**SEO quick table**

| Page | Title | Meta description |
|---|---|---|
| Books | `Books by Cynthia Myers-Morrison, EdD` | `The Fix for Cravings and We Eat Rainbows! — guides to understanding cravings and nourishing yourself with real food.` |
| Research | `Research & Articles | Food Addiction & Epigenetics` | `Download Cynthia Myers-Morrison's peer-reviewed research on food addiction, epigenetics, and intergenerational health — free.` |
| Videos | `Videos | Cynthia Myers-Morrison, EdD` | `Talks, interviews, and recovery stories on food and sugar addiction with Cynthia Myers-Morrison, EdD.` |
| Press | `Press & Media | Cynthia Myers-Morrison, EdD` | `Press kit, bios, and media appearances for food addiction expert and author Cynthia Myers-Morrison, EdD.` |
| Contact | `Contact Cynthia Myers-Morrison, EdD` | `Questions about food and sugar addiction recovery? Reach Cynthia Myers-Morrison, EdD by email, phone, or the contact form.` |

---

## 8. Pre-publish checklist
- [ ] Preview on **desktop** AND switch to the **Mobile Editor** — fix stacking/spacing.
- [ ] Every menu item, button, and footer link goes to the right page.
- [ ] Open a **Store product page** → confirm price shows and **Add to Cart** still works.
- [ ] Test the booking widget and contact form submit.
- [ ] Each page has its **SEO title + description** filled in.
- [ ] **Publish**, then load myersmorrison.com in a fresh tab to confirm.

---

## 9. What I can still do for you via API (no Editor needed)
While you handle the visual rebuild, I can directly update the **live** Wix site's:
- **SEO** titles/descriptions (home + all product pages),
- **Product/service descriptions & info sections** (richer copy, no price/checkout changes),
- **Testimonials** collection (add the named ones above),
- **"Free Discovery Call"** booking description.

Just tell me and I'll apply those — payments untouched.
