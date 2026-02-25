const LLMS_TXT = `# Terramore.io

> Top performance marketing and consulting agency. We help new and existing businesses scale with data-driven marketing, free courses, and free consultations.

Terramore.io offers consulting, marketing services, free courses, and free consultations. We serve both new and existing businesses with flexible, performance-focused solutions.

## Main

- [Home](https://terramore.io): Terramore.io – consulting, marketing, free courses & free consultations
- [About Terramore](https://terramore.io/about): Who we are – scale and grow with expert support
- [Services](https://terramore.io/solutions): Marketing and consulting services for your business
- [Contact & Partner](https://terramore.io/partner): Contact Terramore, partner with us, get in touch
- [Book a Free Consultation](https://terramore.io/workshops): Schedule a free consultation – data-driven marketing and consulting
- [Case Studies & Resources](https://terramore.io/resources): Results, case studies, and learning resources

## Courses

- [Foundation Course – Leads](https://terramore.io/courses/leads): Foundation course for lead generation
- [Make It Real – Offers](https://terramore.io/courses/offers): Offers and conversion
- [Build to Grow – Scaling](https://terramore.io/courses/scaling): Scaling your business

## Optional

- [Workshops](https://terramore.io/workshops): Workshops and free consultation booking
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
