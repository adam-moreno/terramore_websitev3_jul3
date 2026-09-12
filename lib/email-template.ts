/**
 * One small, reusable HTML email layout for Terramore's transactional mail.
 *
 * Email clients (Gmail, Outlook) are limited: no flex/grid, no external CSS,
 * unreliable <style> support, and no SVG. So everything here is a centered
 * table with inline styles, a max width of 600px, and a hosted PNG logo.
 *
 * Brand palette (from tailwind.config.ts):
 *   ink   #0f1e2e   cream #fcf9f8   brand #2a66ff (hover #2252cc)
 *   gold  #f7b844 -> #c68809
 */

const INK = "#0f1e2e"
const CREAM = "#fcf9f8"
const BRAND = "#2a66ff"
const MUTED = "#6b7280"
const BORDER = "#e6e2df"

/** White Terramore wordmark the site already serves from Cloudinary; renders on the dark banner. */
const LOGO_URL =
  "https://res.cloudinary.com/dzzzkruux/image/upload/v1768374924/Screenshot_2026-01-13_at_11_11_07_PM-Picsart-BackgroundRemover_vwxvqo.png"

const REPLY_NOTE = "Replies reach Adam at adam.moreno@terramore.io."

/** Minimal HTML escaping so names and notes cannot break the markup. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** A button that hides an ugly URL behind a label. The href keeps the raw link (and any token). */
export function emailButton(label: string, href: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
    <tr>
      <td align="center" bgcolor="${BRAND}" style="border-radius:8px;">
        <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;">${esc(label)}</a>
      </td>
    </tr>
  </table>`
}

/** Wraps content in the banner + white card + footer shell. bodyHtml is trusted, pre-built HTML. */
export function emailShell(options: { heading: string; bodyHtml: string; previewText?: string }): string {
  const { heading, bodyHtml, previewText } = options
  const preview = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(previewText)}</div>`
    : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
</head>
<body style="margin:0;padding:0;background-color:${CREAM};">
${preview}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
        <tr>
          <td align="center" bgcolor="${INK}" style="background-color:${INK};border-radius:12px 12px 0 0;padding:22px 24px;">
            <img src="${LOGO_URL}" alt="Terramore" height="26" style="height:26px;width:auto;display:block;border:0;outline:none;text-decoration:none;">
          </td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" style="background-color:#ffffff;border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};border-radius:0 0 12px 12px;padding:32px 32px 28px 32px;font-family:Arial,Helvetica,sans-serif;color:${INK};">
            <h1 style="margin:0 0 18px 0;font-size:22px;line-height:1.3;font-weight:bold;color:${INK};">${esc(heading)}</h1>
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">
            <strong style="color:${INK};">Terramore</strong><br>
            ${esc(REPLY_NOTE)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/** A paragraph in the card's body voice. */
export function emailP(text: string): string {
  return `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:${INK};">${esc(text)}</p>`
}

/** A labelled detail row, e.g. "When: Monday at 2:00 PM". Value is escaped. */
export function emailDetail(label: string, value: string): string {
  return `<p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${INK};"><strong>${esc(label)}:</strong> ${esc(value)}</p>`
}

/** A signature block in the muted-but-readable body voice. */
export function emailSignoff(name: string, org: string): string {
  return `<p style="margin:20px 0 0 0;font-size:15px;line-height:1.5;color:${INK};">${esc(name)}<br><span style="color:${MUTED};">${esc(org)}</span></p>`
}
