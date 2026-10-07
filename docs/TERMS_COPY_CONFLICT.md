# Term-length copy conflict (open, owner decision)

**Status:** unresolved. Nothing here changes copy. Commercial terms are the owner's decision; this file only records
where Terramore currently promises a term length, and the neutral wording to use until the terms are final.
**Last checked:** 2026-10-06, against production code (website `origin/main` 597fd49, dashboard `origin/main` c1229af).

## The conflict

Public website copy says engagements are **month to month with no long lock-in**. Production nurture email says
engagements are **12-month partnerships**. A prospect can read both.

## Month-to-month / no lock-in (website)

| Surface | File | Exact copy | Live? |
|---|---|---|---|
| `/book` trust facts | `app/book/page.tsx:27` | `value: "Month to month"`, `label: "No long lock-ins — we keep the work by performing, not by contract"` | Yes |
| `/marketing` FAQ | `app/marketing/page.tsx:109–110` at 597fd49 | Q "Is there a long-term contract?" A "No long lock-ins. Engagements are month to month after the initial setup period. We keep clients by performing, not by contract." | Yes (production). Removed on `feature/marketing-growth-system`, not merged |

## 12-month (dashboard nurture, production)

| Surface | File | Exact copy |
|---|---|---|
| Drip email body | `lib/email/drip-templates.ts:225` (dashboard) | "We don't take on many clients. Our engagements are long-term: 12-month partnerships, infrastructure builds, and systems that compound over time." |
| Drip email "We Partner Long Term" | `lib/email/drip-templates.ts:330` | "We're not a vendor. We're a partner. Our engagements are 12-month builds: infrastructure, systems, and teams that can run and improve over time." |
| Drip email "Partnership Over Projects" | `lib/email/drip-templates.ts:361` | "We don't do projects. We do partnerships. 12-month engagements. Infrastructure that compounds. If that's what you want, book a call." |
| SMS/email export for the Drip Campaigns uploader | `docs/terramore-lead-sms-email-sequences.md:19, 58, 66, 75, 85, 95, 233, 1013, 1173, 1353, 1553, 1753` (dashboard) | The same three statements, repeated across days 7, 46, 54, 63, 73, 83 and the plain-text bodies |

## Recommendation (until terms are final)

Use one neutral line everywhere a term is mentioned, and avoid naming a length:

> Scope, price and term are agreed with you up front, in writing, before any work starts.

- `/book`: replace the "Month to month" fact with a non-term fact, or this line.
- `/marketing` (production FAQ): already absent on the feature branch.
- Drip templates: replace "12-month partnerships / builds / engagements" with "long-term partnerships" or the line above.

**Who decides:** the owner (commercial terms), with counsel if contracts already in force say otherwise. Changing
the drip templates touches production email; ship it as its own reviewed change.
