import { PRODUCTION_HOSTS } from "./funnel-taxonomy"

/**
 * Inline Google tag bootstrap for the root layout.
 *
 * On www.terramore.io / terramore.io it loads gtag.js and queues the same `js` + `config` commands, in the same order,
 * as the original static tag. On every other host (Vercel previews, the production deployment's own *.vercel.app URL,
 * localhost, tests) it only defines `dataLayer` and `gtag()`: gtag.js is never loaded and nothing is configured, so
 * nothing reaches GA4 or Google Ads, while every would-be command stays inspectable in `window.dataLayer`.
 * For GA4 DebugView, use Tag Assistant on the production site.
 *
 * Pure string builder (no DOM at import time) so scripts/verify-funnel.mjs can execute the output.
 */
export function googleTagBootstrap(tagId: string, destinations: readonly string[]): string {
  const loader = JSON.stringify(`https://www.googletagmanager.com/gtag/js?id=${tagId}`)
  const configs = destinations.map((id) => `gtag('config', ${JSON.stringify(id)});`).join("\n")
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
if (${JSON.stringify(PRODUCTION_HOSTS)}.indexOf(location.hostname.toLowerCase()) !== -1) {
(function(){var s=document.createElement('script');s.async=true;s.src=${loader};document.head.appendChild(s);})();
gtag('js', new Date());
${configs}
}`
}
