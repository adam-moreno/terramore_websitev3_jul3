const LLMS_TXT = `# Terramore

> A growth team for owners. Terramore is a founder-led growth consultancy that works inside the store, ads, and email a business already pays for, finds where it loses sales, and fixes that step.

Terramore serves owners with a shop, a service, or a customer list. Work starts with a free call. A free Digital Footprint report is the backup if they are not ready to talk. The client dashboard (Terra IQ) is invite only for current clients. The client owns the data and assets. Monthly work is optional.

## Main

- [Home](https://terramore.io): What Terramore does, how the work happens, use cases, and the free report
- [Talk with us](https://terramore.io/partner): Tell us where the business is stuck and we reply within one business day
- [Book a call](https://terramore.io/book): Pick a time for the free 30-minute call, shown in your time zone
- [Pricing](https://terramore.io/pricing): Talk is free, Start is a deposit after scope, Stay is optional monthly
- [Free Digital Footprint report](https://terramore.io/report): What is in the report, how long it takes, and how we send it
- [Sample report](https://terramore.io/report/example): Northline Atelier sample report
- [About](https://terramore.io/about): Adam Moreno and why the work looks like a growth team
- [Security](https://terramore.io/security): CCPA and HIPAA handling of client data
- [Start here](https://terramore.io/resources): Every page in the order owners ask about them

## Solutions

- [All solutions](https://terramore.io/solutions): Pick the job, then the capability behind it
- [Marketing and Sales](https://terramore.io/solutions/marketing-and-sales): Advertising, the store, and follow-up as one path
- [Get found](https://terramore.io/solutions/discoverability): Maps, search, stores, and listing sites
- [Audience](https://terramore.io/solutions/audience): Reach the people who already looked
- [Artificial Intelligence](https://terramore.io/solutions/artificial-intelligence): An assistant that answers, drafts, and books, with a person in charge
- [Operations](https://terramore.io/solutions/operations): After-hours coverage, a shared lead, and ship dates you can hit

## Integrations

- [All integrations](https://terramore.io/integrations): The tools we sit in
- [Email Marketing](https://terramore.io/integrations/email-marketing): Connect the list to the store so the next note can become an order
- [Calls, texts, and chat](https://terramore.io/integrations/communications): Missed calls and DMs that become a booked job
- [Advertising](https://terramore.io/integrations/advertising): Google Ads, Meta, TikTok, and Pinterest tied to a page that can finish
- [Ecommerce](https://terramore.io/integrations/ecommerce): Shopify, WooCommerce, WordPress, and Etsy
- [Payments](https://terramore.io/integrations/payments): Stripe, PayPal, and Square

## Legal

- [Privacy Policy](https://terramore.io/privacy): Privacy policy
- [Terms of Service](https://terramore.io/terms): Terms of service
`

export function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
