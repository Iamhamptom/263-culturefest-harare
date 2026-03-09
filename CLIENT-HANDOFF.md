# 263 CultureFest Harare — Project Handoff

**Project**: 263 CultureFest x 263 Suite Harare Launch
**Client**: Mr. Hampton (Tony Duardo)
**Built by**: Visio Research Lab / 263
**Date**: March 10, 2026
**Status**: Live

---

## Live Links

| What | URL |
|------|-----|
| **Website** | https://263-culturefest-harare.vercel.app |
| **RSVP Page** | https://263-culturefest-harare.vercel.app/rsvp |
| **Creator Challenge** | https://263-culturefest-harare.vercel.app/challenge |
| **Admin Dashboard** | https://263-culturefest-harare.vercel.app/admin |
| **GitHub Repo** | https://github.com/Iamhamptom/263-culturefest-harare |

---

## What's Been Built

### Website (5 Public Pages + Admin)

1. **Landing Page** (`/`) — Full cinematic event page with hero, about, event details, panel teaser, challenge spotlight, why attend, FAQ, and footer CTA
2. **RSVP Form** (`/rsvp`) — 2-step form collecting name, email, phone, country, city, company, role, socials, attendance intent, and challenge interest
3. **Creator Challenge Application** (`/challenge`) — 3-step form collecting full applicant profile, identity, socials, what they're building, why them, current stage, and biggest needs
4. **RSVP Success** (`/success/rsvp`) — Confirmation page with cross-sell to challenge
5. **Challenge Success** (`/success/challenge`) — Confirmation page
6. **Admin Dashboard** (`/admin`) — Private internal dashboard (password protected)

### Admin Dashboard Features

- **Password**: `263harare2026`
- Total RSVPs counter
- Total challenge applications counter
- Shortlisted applicants counter
- Today's signups counter
- Top cities breakdown
- Top traffic sources breakdown
- Full RSVP table with name, email, city, role, attendance intent, date
- Challenge applicant cards with full application details
- **Review workflow**: Set status (Pending → Reviewing → Shortlisted → Selected / Rejected)
- **Scoring**: Rate applicants 1-5
- **CSV Export**: Download RSVPs or challenge applications as spreadsheet

### Technical Infrastructure

- **Database**: Supabase (PostgreSQL) — hosted on VisioCorp project, isolated tables prefixed with `culturefest_`
- **Hosting**: Vercel — auto-deploys when code is pushed to GitHub
- **Forms**: All submissions go directly to database with UTM tracking
- **Mobile**: Sticky bottom CTA bar on mobile, hamburger navigation menu
- **SEO**: Full meta tags, Open Graph for social sharing, Twitter card
- **Accessibility**: Reduced motion support for users who prefer it
- **Analytics**: Ready for GA4 + Meta Pixel (script tags just need to be added)

---

## UTM Tracking (For Social Campaigns)

Every form submission automatically captures where the visitor came from. To track campaigns, add UTM parameters to your links:

**Format:**
```
https://263-culturefest-harare.vercel.app?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN
```

**Examples for promo:**

| Channel | Link |
|---------|------|
| Instagram Bio | `...vercel.app?utm_source=instagram&utm_medium=bio&utm_campaign=launch` |
| Instagram Story | `...vercel.app/rsvp?utm_source=instagram&utm_medium=story&utm_campaign=week1` |
| WhatsApp Flyer | `...vercel.app?utm_source=whatsapp&utm_medium=flyer&utm_campaign=harare` |
| LinkedIn Post | `...vercel.app?utm_source=linkedin&utm_medium=post&utm_campaign=launch` |
| TikTok Bio | `...vercel.app?utm_source=tiktok&utm_medium=bio&utm_campaign=launch` |
| X/Twitter | `...vercel.app?utm_source=twitter&utm_medium=post&utm_campaign=week2` |
| Email Blast | `...vercel.app/rsvp?utm_source=email&utm_medium=blast&utm_campaign=week3` |
| Challenge Push | `...vercel.app/challenge?utm_source=instagram&utm_medium=reel&utm_campaign=challenge_push` |

All source data is visible in the admin dashboard under "Top Sources" and included in CSV exports.

---

## Database Tables

All data lives in Supabase. Three tables:

### `culturefest_rsvps`
Stores all RSVP submissions: name, email, phone, country, city, company/brand, role(s), Instagram, LinkedIn, attendance intent, challenge interest, email consent, source tracking, timestamps.

### `culturefest_challenges`
Stores all challenge applications: full personal details, age range, identity tags, brand/project name, all socials, what they're building, why them, current stage, biggest needs, email consent, source tracking, plus review fields (status, score, notes).

### `culturefest_email_logs`
Ready for email automation logging when email flows are connected.

---

## What's Ready for Next Steps

### To Connect Analytics (When Ready)
Add Google Analytics 4 and Meta Pixel script tags to `index.html`. The event tracking code is already wired — it will automatically fire:
- `rsvp_submitted` when someone completes RSVP
- `challenge_submitted` when someone submits a challenge application

### To Connect Email Automation (When Ready)
Recommended: **Resend** or **Postmark**. The email flows spec is ready:
- RSVP confirmation email
- Challenge confirmation email
- 48-hour challenge follow-up
- Manual broadcast campaigns

### To Add a Custom Domain
Currently on `263-culturefest-harare.vercel.app`. A custom domain (e.g., `harare.263culturefest.com`) can be added through Vercel settings.

---

## Promo Calendar Alignment

The site is live and ready for the 8-week promo rollout starting March 9, 2026:

| Phase | Dates | Focus |
|-------|-------|-------|
| Week 1 | Mar 9-15 | Lock visual identity, open funnel, RSVP early |
| Week 2 | Mar 16-22 | Official announcement, challenge launch |
| Week 3 | Mar 23-29 | Drive meaning, challenge explainers |
| Week 4 | Mar 30 – Apr 5 | Panel teaser, ecosystem intrigue |
| Week 5 | Apr 6-12 | Challenge quality push |
| Week 6 | Apr 13-19 | Reveals, sharpen urgency |
| Week 7 | Apr 20-26 | Final conversions, last call |
| Event Week | Apr 27-30 | Convert holdouts, live momentum |

---

## Key Credentials (Keep Private)

| What | Value |
|------|-------|
| Admin Dashboard Password | `263harare2026` |
| Vercel Team | corpo1 |
| Supabase Project | VisioCorp (tables prefixed `culturefest_`) |
| GitHub Repo | github.com/Iamhamptom/263-culturefest-harare |

---

**Built with**: React 19, Vite, Tailwind CSS 4, Framer Motion, Supabase, Vercel

**Contact for technical changes**: Reach out via the usual channels. The site auto-deploys — any code pushed to GitHub goes live automatically.
