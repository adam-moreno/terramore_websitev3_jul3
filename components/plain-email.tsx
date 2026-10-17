/**
 * Cloudflare Email Address Obfuscation rewrites plain-text addresses in the served HTML, so the page no
 * longer matches what React hydrates (error #418). Cloudflare skips text wrapped in email_off comments.
 */
export function PlainEmail({ address }: { address: string }) {
  return <span dangerouslySetInnerHTML={{ __html: `<!--email_off-->${address}<!--/email_off-->` }} />
}

/**
 * The same protection for a whole mailto link. Cloudflare also rewrites mailto hrefs into
 * /cdn-cgi/l/email-protection links, which crawlers report as broken (Semrush: 66 pages, 2026-10-16).
 * Address and class are our own constants, never user input.
 */
export function PlainEmailLink({ address, className }: { address: string; className?: string }) {
  const cls = className ? ` class="${className}"` : ""
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!--email_off--><a href="mailto:${address}"${cls}>${address}</a><!--/email_off-->`,
      }}
    />
  )
}
