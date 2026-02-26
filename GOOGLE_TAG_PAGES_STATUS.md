# Google Tag (G-BQN6VCY579) – Page List & Status

## How the tag is applied

- The Google tag is in **`app/layout.tsx`** (root layout), in `<head>` immediately after the opening tag.
- In Next.js App Router, **every route** is wrapped by the root layout. Nested layouts (about, partner, resources, solutions, workshops) only add metadata and return `children`; they do not replace `<html>` or `<head>`.
- **Result:** Every page receives exactly one Google tag, and `<GoogleAnalytics />` in the root layout sends `page_view` on route change so GA4 sees each page.

---

## All page names and URLs

| # | Page name (route) | URL path | Google tag status |
|---|-------------------|----------|--------------------|
| 1 | Home | `/` | Yes |
| 2 | About | `/about` | Yes |
| 3 | Solutions (Services) | `/solutions` | Yes |
| 4 | Partner (Contact) | `/partner` | Yes |
| 5 | Resources (Case Studies) | `/resources` | Yes |
| 6 | Workshops (Book consultation) | `/workshops` | Yes |
| 7 | Courses – Leads (Foundation) | `/courses/leads` | Yes |
| 8 | Courses – Offers (Make It Real) | `/courses/offers` | Yes |
| 9 | Courses – Scaling (Build to Grow) | `/courses/scaling` | Yes |
| 10 | Privacy | `/privacy` | Yes |
| 11 | Terms | `/terms` | Yes |
| 12 | Careers | `/careers` | Yes |
| 13 | Disclosure | `/disclosure` | Yes |
| 14 | DMCA | `/dmca` | Yes |

**Total: 14 pages.** All use the root layout and therefore have the Google tag.

---

## Status check summary

| Check | Status |
|-------|--------|
| Tag in root layout only (no duplicate) | OK – single tag in `app/layout.tsx` |
| Tag first in `<head>` | OK – first content after `<head>` |
| Tag on every page | OK – root layout wraps all 14 routes |
| Per-page tracking in GA4 | OK – `GoogleAnalytics` sends `page_view` on route change |
| Tag ID | `G-BQN6VCY579` |

---

## Files involved

- **`app/layout.tsx`** – Google tag scripts in `<head>`, `<GoogleAnalytics />` in `<body>`.
- **`components/google-analytics.tsx`** – Sends `page_view` to GA4 on client-side navigation.

No other pages or layouts override the root layout, so no page is missing the tag.
