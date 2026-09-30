/**
 * Cloudflare Email Address Obfuscation rewrites plain-text addresses in the served HTML, so the page no
 * longer matches what React hydrates (error #418). Cloudflare skips text wrapped in email_off comments.
 */
export function PlainEmail({ address }: { address: string }) {
  return <span dangerouslySetInnerHTML={{ __html: `<!--email_off-->${address}<!--/email_off-->` }} />
}
