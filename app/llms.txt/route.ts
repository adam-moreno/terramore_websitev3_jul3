const LLMS_TXT = `# Terramore

> Terramore is a growth partner for small businesses. It finds where a business loses customers, fixes it, and runs the marketing (ads, content, web, automation), measured in its own software, TerraIQ. A senior team led by Adam Moreno, formerly at Samba TV and Kantar measuring ad results for Fortune 500 brands.

Terramore is based in Los Angeles and serves owners with a shop, a service, or a customer list across the US. Three ways to start, all free:
- Check my business: enter a website for an instant score, then request the free Digital Footprint report (the website and Google listing, read the way a customer sees them; in your inbox in minutes).
- Growth Workspace: after the check, connect two tools (Shopify, Square, Instagram, Facebook, Google Ads, Meta Ads, Google Analytics) and get a plan from your own numbers.
- Book a free 30-minute call with the team.

Terms: scope and price agreed before work starts; month to month or a year paid up front; financing up to $10,000 through PayPal, subject to approval. Software has a free start and monthly plans. The client owns the data and assets.

## Main

- [Home](https://www.terramore.io): What Terramore does, how the work happens, use cases, and the free report
- [Book a free call](https://www.terramore.io/book): Pick a time for the free 30-minute call, shown in your time zone
- [Pricing](https://www.terramore.io/pricing): Free call; services month to month or yearly; software free to start, then monthly
- [Free Digital Footprint report](https://www.terramore.io/report): What is in the report, how long it takes, and how we send it
- [Sample report](https://www.terramore.io/report/example): Ecommerce and service-business sample reports (illustrative demos)
- [About](https://www.terramore.io/about): Adam Moreno and the team behind Terramore
- [Marketing](https://www.terramore.io/marketing): Done-for-you marketing: ads, creative, pages, follow-up, measurement
- [Contractors](https://www.terramore.io/industries/construction): Growth for construction and trade businesses
- [Security](https://www.terramore.io/security): How client data stays private and in the client's control
- [Start here](https://www.terramore.io/resources): Every page in the order owners ask about them

## Solutions

- [All solutions](https://www.terramore.io/solutions): Pick the job, then the capability behind it
- [Marketing and Sales](https://www.terramore.io/solutions/marketing-and-sales): Advertising, the store, and follow-up as one path
- [Get found](https://www.terramore.io/solutions/discoverability): Maps, search, stores, and listing sites
- [Audience](https://www.terramore.io/solutions/audience): Reach the people who already looked
- [Artificial Intelligence](https://www.terramore.io/solutions/artificial-intelligence): An assistant that answers, drafts, and books, with a person in charge
- [Operations](https://www.terramore.io/solutions/operations): After-hours coverage, a shared lead, and ship dates you can hit

## Integrations

- [All integrations](https://www.terramore.io/integrations): The tools we sit in
- [Email Marketing](https://www.terramore.io/integrations/email-marketing): Connect the list to the store so the next note can become an order
- [Calls, texts, and chat](https://www.terramore.io/integrations/communications): Missed calls and DMs that become a booked job
- [Advertising](https://www.terramore.io/integrations/advertising): Google Ads, Meta, TikTok, and Pinterest tied to a page that can finish
- [Ecommerce](https://www.terramore.io/integrations/ecommerce): Shopify, WooCommerce, WordPress, and Etsy
- [Payments](https://www.terramore.io/integrations/payments): Stripe, PayPal, and Square

## Articles

- [Three numbers before raising ad spend](https://www.terramore.io/articles/three-numbers-before-raising-ad-spend)
- [Why your best ad stops working](https://www.terramore.io/articles/why-your-best-ad-stops-working)
- [Your landing page is the problem](https://www.terramore.io/articles/your-landing-page-is-the-problem)

## Legal

- [Privacy Policy](https://www.terramore.io/privacy): Privacy policy
- [Terms of Service](https://www.terramore.io/terms): Terms of service
`

export function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
