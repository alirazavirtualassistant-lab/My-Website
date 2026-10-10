# Admin Guide for Cynthia (non-technical)

This is how to run the Academy day to day. Everything here happens in the
**Admin panel** at `/admin` after you sign in with an admin account. The left
menu is: Dashboard · Courses · Importer · Products · Coupons · Students ·
Community · Testimonials · Emails · Settings · Team.

> Tip: your assistant can be given the **Assistant** role (Team page). It can
> do everything except Billing/Products, Settings and Team.

## Signing in as admin the first time

1. Open `/admin/register`.
2. Enter your name, email, a password, and the **admin setup code** (your
   developer set it as `ADMIN_SETUP_CODE`). This only works for the first admin.
3. After that, add more admins or assistants from **Team → Add team member**
   (they get an email to set their password).

## Upload a video to a lesson

1. **Courses → Baby Steps → Curriculum**, open the module, click the lesson.
2. In the **Video** card click **Upload video** and choose the MP4. The
   expected file name is shown (for example `M1T1-Intro.mp4`); matching the
   name is not required, it is just a reminder.
3. Wait for "Ready". Add a thumbnail and (optionally) a captions `.vtt` file in
   the same card. Learners will see the video instead of the "Video coming
   soon" card immediately.
4. **Bulk upload**: on the Curriculum page use **Upload videos in bulk** and
   drop many files at once; files named like the sheet (`M2T4-Gut.mp4`) are
   matched to their lessons automatically, the rest can be assigned by hand.

## Add an audio file (welcome audio, affirmations, meditation, session summaries)

Open the lesson, find the **Audio** card, and upload the MP3 into the named
slot. The "coming soon" state disappears.

## Change a price or run a sale

1. **Products**. Each product shows its price and (if set) sale price.
2. Click the product → **Edit** → change the price. For a sale, set the sale
   price and an end date; the course page shows a countdown automatically.
3. Save. In Stripe mode the price is created in Stripe for you; the old price
   is archived so past orders are unaffected.

Payment plans and the All-Access membership are products too (type "Payment
plan" / "Subscription").

## Create a coupon

1. **Coupons → New coupon**.
2. Code (for example `LAUNCH20`), type (% off or fixed amount), optional
   expiry, optional usage limit, and optionally restrict it to specific
   products.
3. Share the code, or share a link with `?coupon=LAUNCH20` added to the course
   page URL, which applies it automatically at checkout.

## Approve a testimonial

Learners submit testimonials from the capstone lesson ("Post Testimonial").
They appear under **Testimonials → Pending**. Click **Approve** to show it on
the public site (home page and course page) or **Reject**. You can also mark
one as **Featured** and add testimonials by hand (with permission).

## Look after a student

**Students** lists everyone. Open a student to see enrollments, progress,
XP and certificates. From there you can:

- **Enroll** them in a course for free (comp access) or **Unenroll**.
- **Unlock all modules** for one learner (ignores the weekly drip).
- **Resend receipt**, **Refund** (also removes access), **Reset password
  link**.
- **Delete the account** (removes their data; purchase records are kept).
- **Export CSV** of all students from the list page.

You will see *that* a learner completed quizzes, journals and uploads, never
the content. That is by design.

## Community moderation

**Community** shows reported posts first. You can hide, remove, pin or lock
posts, and ban a member from posting. Your own posts show an **Instructor**
badge automatically.

## Send an email to students

**Emails → New broadcast**. Pick the audience (everyone, one course, or
learners who have not finished), write the message, preview, and send. Sent
emails are logged under **Emails → Log**.

## Add a new course (for example THE FIX for Cravings)

Option A — **Importer** (fastest if you have a package like the Baby Steps
zip):

1. **Importer → Upload package**. Drop the zip and the course sheet.
2. Review the preview (modules, lessons, resources, XP totals, warnings).
3. Click **Import**. The course is created as a **draft**.

Option B — **Courses → New course**: fill in title, subtitle, description,
thumbnail, level, topics, then add modules and lessons one by one. Drag to
reorder. For each lesson you can set the video, transcript, resources, action
steps with XP, "free preview" and the drip rule (days after enrollment or a
fixed date).

Then: **Products → New product** to put a price on it (or add it to
All-Access), check the course page, and set the course to **Published**.

## Change site text, logo, colours, legal pages

**Settings**: site name, logo, support email, the medical disclaimer wording,
and the five legal pages (Terms, Privacy, Refund, Medical Disclaimer, Cookie
Policy). Save and the public site updates immediately.

## Where things live (if you ever need to tell a developer)

- Course content package: `academy/content/source/Baby_Steps_Course/`
- Prices placeholders: `academy/src/lib/config/site.ts`
- Legal placeholders: `academy/src/content/legal/`
- Environment keys: `academy/.env.example`
