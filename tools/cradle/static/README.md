# Cradle Your Cravings — Baby Steps

A complete static website for **Cradle Your Cravings** and its flagship course, **Baby Steps: Your Health Journey Toward Conception**, by Cynthia Myers-Morrison, EdD.

> ⚠️ This folder is **generated**. Edit `tools/cradle/` (build script, `static/` assets, `data/`) and run `python3 tools/cradle/build.py`.

## What's here
- **Home, Program, About, Join the Team, Resources, FAQ, Contact, Free Assessment, Sign up, Sign in, Welcome, Privacy, Terms, 404**
- **Course:** dashboard (`course/index.html`), Course Home, 7 module pages, 45 lesson pages, bonus + replay sessions — built from the course sheet and Cynthia's lesson scripts
- **Downloads:** 54 worksheets/trackers in `downloads/` (4 free, the rest behind member sign-up)

## Email notifications (signup → Cynthia)
Every form (member signup, join-the-team application, contact, newsletter) posts to
[FormSubmit](https://formsubmit.co) at `https://formsubmit.co/ajax/cynthiajmm@gmail.com`:
- Cynthia receives a formatted email with every field (signups include the assessment result if taken).
- The person who submitted gets an automatic confirmation email.

**One-time activation:** the first time any form is submitted on the live site, FormSubmit emails
cynthiajmm@gmail.com an **“Activate Form”** link. Cynthia must click it once; after that every
submission is delivered. (Submit one test signup right after deploying.)

To change the inbox, edit `NOTIFY_EMAIL` at the top of `assets/js/app.js`.

## Member accounts
This is a static site (no server). Member status, course progress and XP are saved in the visitor's
browser (`localStorage`). Sign-in is by email and restores access on a new device, but progress
doesn't sync between devices. For real accounts with passwords and synced progress, connect a backend
such as Supabase, Firebase or a course platform.

## Run locally
```bash
cd site/cradle-your-cravings && python3 -m http.server 8080
```
