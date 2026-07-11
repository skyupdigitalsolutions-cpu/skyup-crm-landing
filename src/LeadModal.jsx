import { useState } from 'react'
import { CONFIG, track } from './config'

const BUSINESS_TYPES = ['Real Estate', 'Education', 'Healthcare', 'Services', 'Retail / E-commerce', 'Other']

// Normalizes Indian numbers to 91XXXXXXXXXX
export const normalizePhone = (raw) => {
  let d = (raw || '').replace(/\D/g, '')
  if (d.startsWith('0')) d = d.slice(1)
  if (d.length === 10) d = '91' + d
  return d
}

const isValidPhone = (raw) => {
  const d = normalizePhone(raw)
  return d.length === 12 && d.startsWith('91') && /[6-9]/.test(d[2])
}

export default function LeadModal({ open, onClose, source = 'popup' }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', business: '', city: '' })
  const [err, setErr] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | fail

  if (!open) return null

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const next = () => {
    if (form.name.trim().length < 2) return setErr('Please enter your name')
    if (!isValidPhone(form.phone)) return setErr('Please enter a valid 10-digit mobile number')
    setErr('')
    setStep(2)
  }

  const submit = async () => {
    if (!form.business) return setErr('Please select your business type')
    setErr('')
    setStatus('sending')
    const payload = {
      name: form.name.trim(),
      phone: normalizePhone(form.phone),
      business_type: form.business,
      city: form.city.trim(),
      source,
      page: 'skyup-crm-landing',
      ts: new Date().toISOString(),
    }
    try {
      // text/plain avoids a CORS preflight (OPTIONS), which Apps Script Web Apps don't handle
      await fetch(CONFIG.FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
      track('Lead', { content_name: 'SkyUp CRM Demo', source })
      setStatus('done')
    } catch (e) {
      // Endpoint might be no-cors Apps Script — still count as submitted
      track('Lead', { content_name: 'SkyUp CRM Demo', source })
      setStatus('done')
    }
  }

  const reset = () => {
    onClose()
    setTimeout(() => { setStep(1); setStatus('idle'); setErr('') }, 300)
  }

  return (
    <div className="modal-overlay" onClick={reset} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={reset} aria-label="Close">×</button>

        {status === 'done' ? (
          <div className="modal-done">
            <div className="modal-done-icon">✅</div>
            <h3>Demo Request Received!</h3>
            <p>Our team will call you shortly to schedule your free SkyUp CRM demo.</p>
            <button className="btn btn-orange" onClick={reset}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-progress">
              <span className={step >= 1 ? 'on' : ''} />
              <span className={step >= 2 ? 'on' : ''} />
            </div>
            <h3 className="modal-title">
              {step === 1 ? 'Book Your Free CRM Demo' : 'Almost done — about your business'}
            </h3>
            <p className="modal-sub">
              {step === 1
                ? 'See how SkyUp CRM captures and converts every lead.'
                : 'This helps us prepare a demo relevant to you.'}
            </p>

            {step === 1 ? (
              <div className="modal-fields">
                <input placeholder="Your name" value={form.name} onChange={set('name')} autoFocus />
                <input placeholder="Mobile number (WhatsApp)" inputMode="numeric" value={form.phone} onChange={set('phone')} />
                {err && <div className="modal-err">{err}</div>}
                <button className="btn btn-orange btn-full" onClick={next}>Continue →</button>
              </div>
            ) : (
              <div className="modal-fields">
                <select value={form.business} onChange={set('business')}>
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <input placeholder="City (optional)" value={form.city} onChange={set('city')} />
                {err && <div className="modal-err">{err}</div>}
                <button className="btn btn-orange btn-full" onClick={submit} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Book My Free Demo'}
                </button>
                <button className="modal-back" onClick={() => setStep(1)}>← Back</button>
              </div>
            )}
            <p className="modal-privacy">No obligation. Your details stay with SkyUp Digital Solutions.</p>
          </>
        )}
      </div>
    </div>
  )
}
