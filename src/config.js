// ============================================================
// EDIT THIS FILE BEFORE LAUNCH — everything else is wired up.
// ============================================================

export const CONFIG = {
  // Lead form → SKYUP CRM website webhook. Both come from env (.env locally +
  // Cloudflare Pages env), so they survive design edits and stay out of source:
  //   VITE_FORM_ENDPOINT  = <your CRM backend root>/website-webhook
  //   VITE_WEBHOOK_SECRET = the secret set in CRM → Campaigns → Website integration
  FORM_ENDPOINT: import.meta.env.VITE_FORM_ENDPOINT || '',
  WEBHOOK_SECRET: import.meta.env.VITE_WEBHOOK_SECRET || '',

  // WhatsApp click-to-chat (country code, no +). Used by "Talk on WhatsApp" links.
  WHATSAPP_NUMBER: '918867867775',
  WHATSAPP_PREFILL: 'Hello, can I get more info on your CRM services?',

  // Shown in footer / contact
  COMPANY: 'SKYUP Digital Solutions LLP',
  CITY: 'Bengaluru',

  // Fires fbq('track', 'Lead') on successful form submit, 'Contact' on WhatsApp click.
  // Pixel ID itself lives in index.html (2 places).
}

// Loud warning if the CRM webhook wiring is incomplete — the #1 reason website
// leads silently fail to reach the CRM after a deploy.
if (!CONFIG.FORM_ENDPOINT || !CONFIG.WEBHOOK_SECRET) {
  console.warn('[SKYUP] Lead webhook not configured — set VITE_FORM_ENDPOINT (…/website-webhook) and VITE_WEBHOOK_SECRET (.env + Cloudflare Pages env), then rebuild. Leads will NOT reach the CRM until then.')
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