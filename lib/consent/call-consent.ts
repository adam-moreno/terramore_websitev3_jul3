/**
 * Consent to be called (owner decision 2026-10-12). The box under the phone field on the report form; the only path to
 * an automated or AI call. One source for the words: the form shows CALL_CONSENT_TEXT and the API records
 * CALL_CONSENT_VERSION with the time, page, IP and browser, so the record always names the exact wording agreed to.
 *
 * Change the wording → change the version. Plain-language draft written for Terramore (not copied from another site);
 * have counsel review before relying on it.
 */

export const CALL_CONSENT_VERSION = "call-consent-2026-10-12"

export const CALL_CONSENT_TEXT =
  "Call me about my report. Optional. By checking this box, I agree that Terramore may call and text me at the number above about my report and Terramore's services, including with automated technology and an AI or prerecorded voice. Calls are recorded. Consent isn't required to buy anything. I can opt out any time by saying \"stop calling\" or replying STOP. Msg & data rates may apply."

export type CallConsentRecord = {
  call_consent: "yes"
  call_consent_at: string
  call_consent_version: string
  call_consent_page: string | null
  call_consent_ip: string | null
  call_consent_ua: string | null
}

export function callConsentRecord(input: { at: string; page: string | null; ip: string | null; userAgent: string | null }): CallConsentRecord {
  return {
    call_consent: "yes",
    call_consent_at: input.at,
    call_consent_version: CALL_CONSENT_VERSION,
    call_consent_page: input.page ? input.page.slice(0, 300) : null,
    call_consent_ip: input.ip ? input.ip.slice(0, 64) : null,
    call_consent_ua: input.userAgent ? input.userAgent.slice(0, 200) : null,
  }
}
