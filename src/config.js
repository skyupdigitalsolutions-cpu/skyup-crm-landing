// ============================================================
// EDIT THIS FILE BEFORE LAUNCH — everything else is wired up.
// ============================================================

export const CONFIG = {
  // Where the lead form POSTs (JSON body).
  // Paste the Web App URL from deploying apps-script/Code.gs against:
  // https://docs.google.com/spreadsheets/d/1-ZigHe9r1DV_OfHWRSK2w1Pv2ddYAQkq3vViB1wWiDI/edit?usp=sharing
  FORM_ENDPOINT: 'YOUR_APPS_SCRIPT_WEB_APP_URL',

  // WhatsApp click-to-chat (country code, no +). Used by "Talk on WhatsApp" links.
  WHATSAPP_NUMBER: '918867867775',
  WHATSAPP_PREFILL: 'Hello, can I get more info on your CRM services?',

  // Shown in footer / contact
  COMPANY: 'Skyup Digital Solutions LLP',
  CITY: 'Bengaluru',

  // Fires fbq('track', 'Lead') on successful form submit, 'Contact' on WhatsApp click.
  // Pixel ID itself lives in index.html (2 places).
}

// Safe pixel helper — never crashes if fbq is blocked / not loaded
export const track = (event, params = {}) => {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', event, params)
    }
  } catch (e) { /* no-op */ }
}

export const waLink = () =>
  `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_PREFILL)}`
