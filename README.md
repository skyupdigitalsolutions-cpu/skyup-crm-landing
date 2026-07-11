# SkyUp CRM Landing Page (Vite + React)

Merged version: CEO's funnel structure + real product tour + popup/exit-intent/sticky CTA mechanics.

## Run

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # production build → dist/
```

## Launch checklist (only 3 things)

1. **Meta Pixel** → `index.html`, replace `YOUR_PIXEL_ID` in **2 places**.
2. **Form endpoint** → `src/config.js`, set `FORM_ENDPOINT` (CRM webhook / Apps Script URL).
   Payload sent (JSON POST): `{ name, phone (91XXXXXXXXXX), business_type, city, source, page, ts }`
3. **WhatsApp number** → `src/config.js`, set `WHATSAPP_NUMBER`.

## Product tour screenshots

Drop your real CRM screenshots into `public/screenshots/` with these names:

```
leads.png  campaigns.png  whatsapp.png  sms.png  attendance.png  team.png
```

Until you add them, the tab shows a styled placeholder (page won't break).
Recommended: 1600px wide PNG/WebP, < 300 KB each.

## Pixel events fired

| Event | When |
|---|---|
| PageView | page load |
| InitiateCheckout | any demo CTA clicked (source tagged) |
| Lead | form submitted successfully |
| Contact | WhatsApp button clicked |

Every CTA passes a `source` value (hero-primary, hero-leak-check, product-tour, exit-intent, sticky-mobile, final-cta, nav) — you'll see it in the form payload, so you can tell which section converts.

## Edit content

All copy lives in `src/data.js` — headlines, problems, features, FAQs, testimonials. No need to touch components.
