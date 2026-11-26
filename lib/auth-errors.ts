import type { AuthError } from '@supabase/supabase-js'

// Keyed by Supabase error codes. Anything unlisted falls back, so a message
// from the server never reaches the page unfiltered.
const MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-Mail oder Passwort stimmt nicht.',
  email_not_confirmed: 'Öffne zuerst den Bestätigungslink in deiner E-Mail.',
  provider_email_needs_verification:
    'Öffne zuerst den Bestätigungslink in deiner E-Mail.',
  email_address_invalid: 'Diese E-Mail-Adresse gibt es so nicht.',
  email_address_not_authorized:
    'An diese Adresse dürfen wir nichts verschicken.',
  validation_failed: 'Bitte prüfe deine Eingaben.',
  weak_password: 'Das Passwort ist zu schwach. Nimm ein längeres.',
  same_password: 'Das ist dein bisheriges Passwort. Wähle ein anderes.',
  over_request_rate_limit: 'Zu viele Versuche. Warte ein paar Minuten.',
  over_email_send_rate_limit: 'Zu viele E-Mails. Warte ein paar Minuten.',
  signup_disabled: 'Neue Konten sind im Moment nicht möglich.',
  user_banned: 'Dieses Konto ist gesperrt.',
  otp_expired: 'Der Link ist abgelaufen. Fordere einen neuen an.',
  flow_state_expired: 'Der Link ist abgelaufen. Versuche es noch einmal.',
  flow_state_not_found: 'Der Link gilt nicht mehr. Versuche es noch einmal.',
  bad_code_verifier:
    'Dieser Link gehört zu einem anderen Gerät. Melde dich hier direkt an.',
  pkce_code_verifier_not_found:
    'Dieser Link gehört zu einem anderen Browser. Melde dich hier direkt an.',
  bad_oauth_state: 'Die Anmeldung wurde unterbrochen. Versuche es noch einmal.',
  bad_oauth_callback:
    'Die Anmeldung wurde unterbrochen. Versuche es noch einmal.',
  provider_disabled: 'Diese Anmeldeart ist nicht aktiv.',
  link_invalid: 'Dieser Link ist ungültig oder schon benutzt.',
  provider_denied: 'Die Anmeldung wurde abgebrochen.',
}

const FALLBACK = 'Das hat nicht geklappt. Versuche es bitte noch einmal.'

export function authMessage(code: string | null | undefined): string {
  return (code && MESSAGES[code]) || FALLBACK
}

export function germanAuthError(error: AuthError | null): string {
  return authMessage(error?.code)
}
