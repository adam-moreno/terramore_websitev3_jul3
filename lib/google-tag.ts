import { PRODUCTION_HOSTS } from "./funnel-taxonomy"

/** First-party cookie marking Terramore's own devices (set with ?internal=on). */
export const INTERNAL_COOKIE = "tm_internal"

/**
 * Inline Google tag bootstrap for the root layout.
 *
 * On www.terramore.io / terramore.io it loads gtag.js and queues the same `js` + `config` commands, in the same order,
 * as the original static tag. On every other host (Vercel previews, the production deployment's own *.vercel.app URL,
 * localhost, tests) it only defines `dataLayer` and `gtag()`: gtag.js is never loaded and nothing is configured, so
 * nothing reaches GA4 or Google Ads, while every would-be command stays inspectable in `window.dataLayer`.
 * For GA4 DebugView, use Tag Assistant on the production site.
 *
 * Internal visitors (Terramore's own devices) load nothing either, so test reports and bookings never count as Google
 * Ads conversions or GA4 traffic: visit any page once with `?internal=on` (sets the first-party `tm_internal` cookie
 * for a year); `?internal=off` clears it. lib/analytics.ts `isInternalVisitor()` reads the same cookie for Meta/TikTok.
 *
 * Pure string builder (no DOM at import time) so scripts/verify-funnel.mjs can execute the output.
 */
export function googleTagBootstrap(tagId: string, destinations: readonly string[]): string {
  const loader = JSON.stringify(`https://www.googletagmanager.com/gtag/js?id=${tagId}`)
  const configs = destinations.map((id) => `gtag('config', ${JSON.stringify(id)});`).join("\n")
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var tmInternal = (function(){try{
var m = /[?&]internal=(on|off)(?:&|$)/.exec(location.search || '');
if (m) { document.cookie = '${INTERNAL_COOKIE}=' + (m[1] === 'on' ? '1' : '') + '; path=/; max-age=' + (m[1] === 'on' ? 31536000 : 0) + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); return m[1] === 'on'; }
return /(?:^|;\\s*)${INTERNAL_COOKIE}=1(?:;|$)/.test(document.cookie || '');
}catch(e){return false;}})();
if (!tmInternal && ${JSON.stringify(PRODUCTION_HOSTS)}.indexOf(location.hostname.toLowerCase()) !== -1) {
(function(){var s=document.createElement('script');s.async=true;s.src=${loader};document.head.appendChild(s);})();
gtag('js', new Date());
${configs}
}`
}
