import { useEffect, useRef, useState, useId } from 'react'
import LeadModal from './LeadModal'
import { CONFIG, track, waLink } from './config'
import {
  HERO_CATEGORIES, PROBLEMS, JOURNEY, BEFORE_POINTS, AFTER_POINTS,
  LEAD_STEPS, FEATURES, TOUR_TABS, IMPACT_STATS, TESTIMONIALS, WHY_CHOOSE, FAQS,
} from './data'

// must match the journey-hit / journey-arrow-flow animation durations in index.css
const JOURNEY_ORBIT_DURATION = 9

const WHATSAPP_GLYPH_PATH = 'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z'

// real WhatsApp brand mark — used wherever data.js has the placeholder '💬' icon
function WhatsAppIcon({ size = 24, tile = false }) {
  // Unique gradient id per instance — sharing one id across multiple inline
  // SVGs breaks the fill in most browsers, which made the icon render washed-out.
  const gradId = `wa-grad-${useId().replace(/:/g, '')}`
  if (!tile) {
    return (
      <svg width={size} height={size} viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d={WHATSAPP_GLYPH_PATH} fill="#fff" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#25D366" />
          <stop offset="1" stopColor="#128C46" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill={`url(#${gradId})`} />
      <g transform="translate(5.5,4) scale(0.046875)">
        <path d={WHATSAPP_GLYPH_PATH} fill="#fff" />
      </g>
    </svg>
  )
}

function renderIcon(icon, opts) {
  if (icon === '💬') return <WhatsAppIcon {...opts} />
  return icon
}

// Flat illustrated headshots for the testimonial cards (anonymous personas,
// so illustrated avatars rather than real photos). Two distinct looks.
const AVATAR_SCHEMES = [
  { bg1: '#ffe8d6', bg2: '#fdd9c0', skin: '#e8b48c', hair: '#3b2a1e', shirt: '#26324d',
    hairPath: 'M31 45 C31 30 39 24 48 24 C57 24 65 30 65 45 C65 37 60 34 48 34 C36 34 31 37 31 45 Z' },
  { bg1: '#d8ede4', bg2: '#cfe3f5', skin: '#d9a97e', hair: '#1e1712', shirt: '#1f7a5a',
    hairPath: 'M30 47 C30 29 39 23 48 23 C57 23 66 29 66 47 C66 38 62 35 60 40 C58 33 52 32 48 32 C44 32 38 33 36 40 C34 35 30 38 30 47 Z' },
]

function PersonAvatar({ scheme, size = 52 }) {
  const uid = useId().replace(/:/g, '')
  const bgId = `avbg-${uid}`, clipId = `avc-${uid}`
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor={scheme.bg1} />
          <stop offset="1" stopColor={scheme.bg2} />
        </linearGradient>
        <clipPath id={clipId}><circle cx="48" cy="48" r="48" /></clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="96" height="96" fill={`url(#${bgId})`} />
        <path d="M14 96 C14 73 30 65 48 65 C66 65 82 73 82 96 Z" fill={scheme.shirt} />
        <path d="M40 60 h16 v6 q-8 5 -16 0 Z" fill={scheme.skin} />
        <circle cx="48" cy="43" r="17" fill={scheme.skin} />
        <path d={scheme.hairPath} fill={scheme.hair} />
      </g>
    </svg>
  )
}

/* ---------- hooks ---------- */

function useExitIntent(onFire) {
  const fired = useRef(false)
  useEffect(() => {
    const handler = (e) => {
      if (fired.current) return
      if (e.clientY <= 8 && e.relatedTarget == null) {
        fired.current = true
        onFire()
      }
    }
    document.addEventListener('mouseout', handler)
    return () => document.removeEventListener('mouseout', handler)
  }, [onFire])
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add('in')),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ---------- small pieces ---------- */

const SectionTag = ({ children }) => <div className="section-tag">{children}</div>

const DASH_MENU = ['Dashboard', 'Leads', 'Campaigns', 'WhatsApp', 'Calls', 'Tasks', 'Reports', 'Team', 'Settings']
const DASH_MENU_CYCLE_LENGTH = DASH_MENU.length - 1 // auto-cycle Dashboard through Team; skip Settings

// content shown in the main panel — kept in sync with whichever sidebar item is active
const DASH_VIEWS = {
  Dashboard: {
    stats: [
      { l: 'Total Leads', v: '2,450', d: '+35.3%' },
      { l: 'New Leads', v: '1,560', d: '+31.2%' },
      { l: 'In Progress', v: '850', d: '+18.7%' },
      { l: 'Converted', v: '320', d: '+24.4%' },
    ],
    barsTitle: 'Leads Source',
    bars: [['Meta Ads', 40, '#1877F2'], ['Google Ads', 25, '#EA4335'], ['Website', 20, '#6366F1'], ['WhatsApp', 10, '#25D366'], ['Calls', 5, '#F59E0B']],
    actsTitle: 'Recent Activity',
    acts: [['🔵', 'New lead from Meta Ads', '2 min ago'], ['🎙️', 'Call recorded with Ravi', '15 min ago'], ['💬', 'WhatsApp sent to Neha', '30 min ago'], ['🔔', 'Follow-up reminder set', '1 hr ago']],
  },
  Leads: {
    stats: [
      { l: 'Total Leads', v: '2,450', d: '+35.3%' },
      { l: 'Hot Leads', v: '312', d: '+12.4%' },
      { l: 'Contacted', v: '1,180', d: '+9.1%' },
      { l: 'Converted', v: '320', d: '+24.4%' },
    ],
    barsTitle: 'Lead Status',
    bars: [['New', 35, '#1877F2'], ['Contacted', 30, '#6366F1'], ['Qualified', 20, '#F59E0B'], ['Converted', 15, '#25D366']],
    actsTitle: 'Recent Leads',
    acts: [['🆕', 'Aarav Sharma added', '2 min ago'], ['🔥', 'Priya Mehta marked Hot', '18 min ago'], ['📞', 'Rohan Verma contacted', '40 min ago'], ['✅', 'Neha Iyer converted', '1 hr ago']],
  },
  Campaigns: {
    stats: [
      { l: 'Active Campaigns', v: '11', d: '+2' },
      { l: 'Meta Leads', v: '634', d: '+22.1%' },
      { l: 'Google Leads', v: '289', d: '+14.3%' },
      { l: 'Website Leads', v: '178', d: '+8.6%' },
    ],
    barsTitle: 'Campaign Performance',
    bars: [['EduMate', 68, '#1877F2'], ['SwiftKart', 60, '#6366F1'], ['FitLife', 51, '#F59E0B'], ['GreenNest', 36, '#25D366']],
    actsTitle: 'Campaign Activity',
    acts: [['🚀', 'SwiftKart – E-commerce launched', '5 min ago'], ['⏸️', 'Dr. Care campaign paused', '22 min ago'], ['💰', 'EduMate budget increased', '1 hr ago'], ['🔄', 'Synced leads from Meta', '2 hr ago']],
  },
  WhatsApp: {
    stats: [
      { l: 'Conversations', v: '128', d: '+18.2%' },
      { l: 'Open Chats', v: '34', d: '+5.4%' },
      { l: 'Templates Sent', v: '560', d: '+30.1%' },
      { l: 'Response Rate', v: '92%', d: '+4.2%' },
    ],
    barsTitle: 'Chat Status',
    bars: [['Open', 45, '#25D366'], ['Waiting', 33, '#F59E0B'], ['Closed', 22, '#6366F1']],
    actsTitle: 'Recent Chats',
    acts: [['💬', 'Sunita Sharma: "Need more info..."', '10 min ago'], ['💬', 'Rahul Verma: "Please share details"', '25 min ago'], ['💬', 'Pooja Kulkarni: "Share pricing plan?"', '1 hr ago'], ['💬', 'Amit Bansal: "Looking for a demo"', '2 hr ago']],
  },
  Calls: {
    stats: [
      { l: 'Total Calls', v: '452', d: '+20.4%' },
      { l: 'Answered', v: '388', d: '+15.1%' },
      { l: 'Avg Duration', v: '4m 12s', d: '+8.3%' },
      { l: 'Recorded', v: '452', d: '+20.4%' },
    ],
    barsTitle: 'Call Outcomes',
    bars: [['Connected', 68, '#25D366'], ['Voicemail', 18, '#F59E0B'], ['No Answer', 14, '#EA4335']],
    actsTitle: 'Recent Calls',
    acts: [['🎙️', 'Call recorded with Ravi', '15 min ago'], ['📞', 'Call with Priya Mehta', '1 hr ago'], ['☎️', 'Missed call — Rohan Verma', '2 hr ago'], ['🎙️', 'Call recorded with Neha', '3 hr ago']],
  },
  Tasks: {
    stats: [
      { l: 'Open Tasks', v: '46', d: '+10.2%' },
      { l: 'Due Today', v: '12', d: '+0%' },
      { l: 'Overdue', v: '3', d: '−2%' },
      { l: 'Completed', v: '210', d: '+18.4%' },
    ],
    barsTitle: 'Task Status',
    bars: [['To Do', 40, '#F59E0B'], ['In Progress', 35, '#6366F1'], ['Done', 25, '#25D366']],
    actsTitle: 'Upcoming Tasks',
    acts: [['📝', 'Follow up with Aarav Sharma', 'Today'], ['📤', 'Send proposal to FitLife', 'Tomorrow'], ['📞', 'Call GreenNest — Home Decor', 'Today'], ['🗒️', 'Update CRM notes', 'This week']],
  },
  Reports: {
    stats: [
      { l: 'Conversion Rate', v: '24.4%', d: '+3.1%' },
      { l: 'Avg Response', v: '4m', d: '−12%' },
      { l: 'Productivity', v: '88%', d: '+6.2%' },
      { l: 'Revenue (MTD)', v: '₹8.2L', d: '+15.6%' },
    ],
    barsTitle: 'Channel ROI',
    bars: [['Meta Ads', 45, '#1877F2'], ['Google Ads', 30, '#EA4335'], ['Website', 15, '#6366F1'], ['WhatsApp', 10, '#25D366']],
    actsTitle: 'Top Performers',
    acts: [['🏆', 'Ismail Zabiulla — 68 leads closed', 'This week'], ['📈', 'Priya Sales — 54 leads closed', 'This week'], ['📊', 'Team conversion up 3.1%', 'This month'], ['⭐', 'Rohan hit monthly target', '2 days ago']],
  },
  Team: {
    stats: [
      { l: 'Team Members', v: '12', d: '+0%' },
      { l: 'Active Today', v: '9', d: '+0%' },
      { l: 'Avg Response', v: '3m', d: '+5%' },
      { l: 'Tasks Done', v: '210', d: '+18.4%' },
    ],
    barsTitle: 'Team Workload',
    bars: [['Ismail Z.', 40, '#1877F2'], ['Priya S.', 28, '#6366F1'], ['Rohan V.', 20, '#F59E0B'], ['Neha I.', 12, '#25D366']],
    actsTitle: 'Team Activity',
    acts: [['✅', 'Ismail closed a lead', '8 min ago'], ['💬', 'Priya sent a WhatsApp template', '25 min ago'], ['📞', 'Rohan logged a call', '1 hr ago'], ['📝', 'Neha completed a task', '2 hr ago']],
  },
}

function DashboardMock() {
  const [activeMenu, setActiveMenu] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveMenu((i) => (i + 1) % DASH_MENU_CYCLE_LENGTH)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const handleTilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.transform = `perspective(1000px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) scale(1.015)`
  }
  const resetTilt = (e) => { e.currentTarget.style.transform = '' }

  const activeName = DASH_MENU[activeMenu]
  const view = DASH_VIEWS[activeName]

  return (
    <div className="dash-float-wrap">
      <div className="dash reveal" onMouseMove={handleTilt} onMouseLeave={resetTilt}>
        <div className="dash-side">
          <div className="dash-logo">SKYUP <span>CRM</span></div>
          {DASH_MENU.map((m, i) => (
            <div key={m} className={`dash-menu ${i === activeMenu ? 'active' : ''}`}>{m}</div>
          ))}
        </div>
        <div className="dash-main">
          <div className="dash-stats" key={`${activeName}-stats`}>
            {view.stats.map((s, i) => (
              <div key={s.l} className="dash-stat" style={{ transitionDelay: `${i * 0.1}s`, animationDelay: `${i * 0.06}s` }}>
                <div className="dash-stat-l">{s.l}</div>
                <div className="dash-stat-v">{s.v}</div>
                <div className="dash-stat-d">▲ {s.d}</div>
              </div>
            ))}
          </div>
          <div className="dash-row">
            <div className="dash-card" key={`${activeName}-bars`}>
              <div className="dash-card-t">{view.barsTitle}</div>
              {view.bars.map(([n, p, c], i) => (
                <div key={n} className="dash-bar" style={{ animationDelay: `${i * 0.06}s` }}>
                  <span>{n}</span>
                  <div className="dash-bar-track"><div style={{ '--w': `${p}%`, background: c, transitionDelay: `${i * 0.12}s` }} /></div>
                  <b>{p}%</b>
                </div>
              ))}
            </div>
            <div className="dash-card" key={`${activeName}-acts`}>
              <div className="dash-card-t">{view.actsTitle}</div>
              {view.acts.map(([i, t, d], idx) => (
                <div key={t} className={`dash-act ${idx === 0 ? 'dash-act-live' : ''}`} style={{ transitionDelay: `${idx * 0.1}s`, animationDelay: `${idx * 0.06}s` }}>
                  <span>{i}</span><div><p>{t}</p><small>{d}</small></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export default function App() {
  const [modal, setModal] = useState({ open: false, source: 'cta' })
  const [tab, setTab] = useState(TOUR_TABS[0].id)
  const lastTourInteraction = useRef(0)
  const tourManualStop = useRef(false)
  const tourTabsRef = useRef(null)
  const tourTabRefs = useRef({})
  const [faqOpen, setFaqOpen] = useState(0)
  const [faqExpanded, setFaqExpanded] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)
  const [atFinalCta, setAtFinalCta] = useState(false)
  const finalCtaRef = useRef(null)
  const [openCats, setOpenCats] = useState(() => new Set())
  const heroCatsRef = useRef(null)
  const [navOpen, setNavOpen] = useState(false)
  const navRef = useRef(null)

  const openModal = (source) => {
    track('InitiateCheckout', { content_name: 'Demo CTA', source })
    setModal({ open: true, source })
  }

  useExitIntent(() => {
    if (!modal.open && !sessionStorage.getItem('exit_shown')) {
      sessionStorage.setItem('exit_shown', '1')
      setModal({ open: true, source: 'exit-intent' })
    }
  })

  useReveal()

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // When the final CTA section (which already has both buttons) comes into view,
  // retract the sticky bottom bar and the floating WhatsApp button.
  useEffect(() => {
    const el = finalCtaRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setAtFinalCta(entry.isIntersecting),
      { rootMargin: '0px 0px -35% 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Close the mobile menu when tapping outside it, scrolling, or pressing Escape.
  useEffect(() => {
    if (!navOpen) return
    const close = () => setNavOpen(false)
    const onDocClick = (e) => { if (navRef.current && !navRef.current.contains(e.target)) close() }
    const onKey = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, { passive: true })
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close)
    }
  }, [navOpen])

  // Mobile/tablet only (≤980px): auto-open each hero category as it crosses
  // the vertical middle of the screen, so users see every category while
  // scrolling — no tap needed. Desktop is untouched (hover + click).
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)')
    let io = null

    const attach = () => {
      if (io) { io.disconnect(); io = null }
      // Desktop: no scroll auto-open — clear anything the observer opened.
      if (!mq.matches) { setOpenCats(new Set()); return }
      const container = heroCatsRef.current
      if (!container) return
      const cards = Array.from(container.querySelectorAll('.hero-cat'))
      io = new IntersectionObserver(
        (entries) => {
          setOpenCats((prev) => {
            const next = new Set(prev)
            entries.forEach((en) => {
              const idx = cards.indexOf(en.target)
              if (idx === -1) return
              if (en.isIntersecting) next.add(idx)
              else next.delete(idx)
            })
            return next
          })
        },
        // A zero-height band at 50% viewport height = the screen's middle line.
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
      )
      cards.forEach((c) => io.observe(c))
    }

    attach()
    mq.addEventListener('change', attach) // re-wire on rotate / resize across the breakpoint
    return () => {
      if (io) io.disconnect()
      mq.removeEventListener('change', attach)
    }
  }, [])

  const activeTab = TOUR_TABS.find((t) => t.id === tab)

  const selectTab = (id) => {
    lastTourInteraction.current = Date.now()
    setTab(id)
  }

  // manual swipe/drag or a click on the tab strip stops the auto-advance for good
  const stopTourAutoAdvance = () => { tourManualStop.current = true }

  useEffect(() => {
    const id = setInterval(() => {
      if (tourManualStop.current) { clearInterval(id); return }
      if (Date.now() - lastTourInteraction.current < 4000) return
      setTab((current) => {
        const idx = TOUR_TABS.findIndex((t) => t.id === current)
        return TOUR_TABS[(idx + 1) % TOUR_TABS.length].id
      })
    }, 2500)
    return () => clearInterval(id)
  }, [])

  // keep the active tab aligned to the left edge of the (mobile) scrollable strip
  useEffect(() => {
    const container = tourTabsRef.current
    const btn = tourTabRefs.current[tab]
    if (!container || !btn) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = Math.max(0, btn.offsetLeft - 20)
    container.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [tab])

  return (
    <>
      {/* ============ NAV ============ */}
      <nav className="nav" ref={navRef}>
        <div className="container nav-in">
          <div className="brand">
            <img src="/screenshots/logo.png" alt="SKYUP Digital Solutions" className="brand-logo" />
            <span className="brand-crm">CRM</span>
          </div>
          <div className={`nav-links ${navOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setNavOpen(false)}>Features</a>
            <a href="#tour" onClick={() => setNavOpen(false)}>Product Tour</a>
            <a href="#why" onClick={() => setNavOpen(false)}>Why Us</a>
            <a href="#faq" onClick={() => setNavOpen(false)}>FAQ</a>
          </div>
          <button className="btn btn-orange btn-sm nav-cta" onClick={() => openModal('nav')}>Book Free CRM Demo</button>
          <button
            className="nav-toggle"
            aria-label="Menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ============ 1. HERO (CEO's) ============ */}
      <header className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow reveal" style={{ transitionDelay: '0s' }}>All your leads. One Smart CRM.</div>
              <h1 className="reveal" style={{ transitionDelay: '0.08s' }}>
                Stop Losing Customers You <em>Already Paid</em> to <span className="hero-accent-orange">Acquire</span>.
              </h1>
              <p className="reveal" style={{ transitionDelay: '0.16s' }}>
                Every missed follow-up, delayed response, and untracked enquiry costs your
                business money. SKYUP CRM captures every lead, assigns it instantly, tracks
                every activity, and helps your team convert more customers.
              </p>
              <div className="hero-categories reveal" ref={heroCatsRef} style={{ transitionDelay: '0.24s' }}>
                {HERO_CATEGORIES.map((c, i) => (
                  <div
                    key={c.title}
                    className={`hero-cat hero-cat-${c.color} ${openCats.has(i) ? 'open' : ''}`}
                    onClick={() =>
                      setOpenCats((prev) => {
                        const next = new Set(prev)
                        next.has(i) ? next.delete(i) : next.add(i)
                        return next
                      })
                    }
                  >
                    <span className="hero-cat-num">{i + 1}</span>
                    <div className="hero-cat-top">
                      <span className="hero-cat-icon">
                        {c.icon === '👥' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : renderIcon(c.icon, { size: 20 })}
                      </span>
                      <h4>{c.title}</h4>
                    </div>
                    <div className="hero-cat-points-wrap">
                      <ul className="hero-cat-points">
                        {c.points.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hero-ctas reveal" style={{ transitionDelay: '0.32s' }}>
                <button className="btn btn-ghost-orange" onClick={() => openModal('hero-leak-check')}>
                  📉 Check How Many Leads You Are Losing
                </button>
              </div>
            </div>
            <DashboardMock />
          </div>
        </div>
      </header>

      {/* ============ 2. PROBLEMS (red icons) ============ */}
      <section className="section section-white">
        <div className="container">
          <h2 className="reveal">Are You Losing Sales Without Realising It?</h2>
          <p className="section-sub reveal">
            Most businesses don't lose customers because they lack leads. They lose customers
            because their sales process is broken.
          </p>
          <div className="problems">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="problem-card reveal"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
                }}
              >
                <div className="problem-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. JOURNEY STRIP ============ */}
      <section className="section section-light">
        <div className="container">
          <h2 className="reveal">What If Every Lead Was Tracked Automatically?</h2>

          {/* circular flow — desktop/tablet */}
          <div className="journey-circle reveal">
            <div className="journey-ring" />
            <div className="journey-center"><span>🔁</span><b>Lead Journey</b></div>

            {JOURNEY.map((j, i) => {
              const step = 360 / JOURNEY.length
              const angle = step * i
              const midAngle = angle + step / 2
              // matches the 7s linear orbit in index.css, so each glow fires exactly as the light arrives
              const stepDuration = JOURNEY_ORBIT_DURATION / JOURNEY.length
              return (
                <div key={j.label} style={{ display: 'contents' }}>
                  <div className="journey-anchor">
                    <div className="journey-arm" style={{ transform: `rotate(${angle}deg) translateY(calc(-1 * var(--radius)))` }}>
                      <div className="journey-node" style={{ transform: `rotate(${-angle}deg)` }}>
                        <div className="journey-icon" style={{ '--hit-delay': `${i * stepDuration}s` }}>{renderIcon(j.icon, { tile: true, size: 28 })}</div>
                        <span>{j.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="journey-anchor">
                    <div className="journey-arm" style={{ transform: `rotate(${midAngle}deg) translateY(calc(-1 * var(--radius)))` }}>
                      <div className="journey-arrow" style={{ '--hit-delay': `${(i + 0.5) * stepDuration}s` }}>➜</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* stacked flow — mobile */}
          <div className="journey-mobile reveal">
            {JOURNEY.map((j, i) => {
              const stepDuration = JOURNEY_ORBIT_DURATION / JOURNEY.length
              return (
                <div key={j.label} className="journey-mobile-step">
                  <div className="journey-icon" style={{ '--hit-delay': `${i * stepDuration}s` }}>{renderIcon(j.icon, { tile: true, size: 28 })}</div>
                  <span>{j.label}</span>
                  {i < JOURNEY.length - 1 && (
                    <div className="journey-mobile-arrow" style={{ '--hit-delay': `${(i + 0.5) * stepDuration}s` }}>↓</div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="center reveal">
            <a href="#tour" className="btn btn-blue">See SKYUP CRM in Action →</a>
          </div>
        </div>
      </section>

      {/* ============ 4. BEFORE / AFTER ============ */}
      <section className="section section-white">
        <div className="container">
          <h2 className="reveal">From Confused Follow-ups to Complete Sales Clarity</h2>
          <div className="vs reveal">
            <div
              className="vs-col vs-before"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
              }}
            >
              <div className="vs-text">
                <div className="vs-head">Before <b>SKYUP CRM</b></div>
                {BEFORE_POINTS.map((p) => <div key={p} className="vs-point bad">✕ {p}</div>)}
              </div>
              <div className="vs-photo-wrap">
                <img className="vs-photo" src="/images/before-crm.png" alt="Overwhelmed salesperson before SKYUP CRM" />
              </div>
            </div>
            <div className="vs-badge">VS</div>
            <div
              className="vs-col vs-after"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
              }}
            >
              <div className="vs-text">
                <div className="vs-head">After <b>SKYUP CRM</b></div>
                {AFTER_POINTS.map((p) => <div key={p} className="vs-point good">✓ {p}</div>)}
              </div>
              <div className="vs-photo-wrap">
                <img className="vs-photo" src="/images/after-crm.png" alt="Confident salesperson after SKYUP CRM" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. PRODUCT TOUR (yours — real screenshots) ============ */}
      <section className="section section-navy" id="tour">
        <div className="container">
          <SectionTag>PRODUCT TOUR</SectionTag>
          <h2 className="reveal on-dark">See SKYUP CRM in Action</h2>
          <p className="section-sub on-dark reveal">
            Discover how SKYUP CRM helps businesses capture leads, automate follow-ups and
            manage their entire sales process from one dashboard.
          </p>
          <div
            className="tour-tabs reveal"
            ref={tourTabsRef}
            onPointerDown={stopTourAutoAdvance}
          >
            {TOUR_TABS.map((t) => (
              <button
                key={t.id}
                ref={(el) => { tourTabRefs.current[t.id] = el }}
                className={`tour-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => selectTab(t.id)}
                onMouseEnter={() => selectTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="tour-frame reveal">
            <img
              key={activeTab.id}
              src={activeTab.img}
              alt={`SKYUP CRM — ${activeTab.label}`}
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
            />
            <div className="tour-placeholder" style={{ display: 'none' }}>
              <span>📸</span>
              <p>Add screenshot: <code>/public/screenshots/{activeTab.id}.png</code></p>
            </div>
          </div>
          <p className="tour-caption reveal">
            <span key={activeTab.id} className="tour-caption-inner">
              <b>{activeTab.label}.</b> {activeTab.caption}
            </span>
          </p>
          <div className="center reveal">
            <button className="btn btn-orange" onClick={() => openModal('product-tour')}>Book Your Free CRM Demo</button>
          </div>
        </div>
      </section>

      {/* ============ 6. FEATURES + STEPS ============ */}
      <section className="section section-white" id="features">
        <div className="container">
          <h2 className="reveal">Everything Your Sales Team Needs to Convert More Leads</h2>
          <div className="features">
            {FEATURES.map((f) => (
              <div
                key={f.n}
                className="feature-card reveal"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
                }}
              >
                <div className="feature-top">
                  <span className="feature-num">{f.n}</span>
                  <span className="feature-icon">{renderIcon(f.icon, { tile: true, size: 32 })}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>

          <div className="steps-wrap reveal">
            <h3 className="steps-title">See What Happens After a Lead Arrives</h3>
            {LEAD_STEPS.map((s, i) => (
              <div key={s} className="step-row reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <span className="step-pill" style={{ '--pulse-delay': `${i * 0.3}s` }}>Step {i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. IMPACT + TESTIMONIALS ============ */}
      <section className="section section-light">
        <div className="container">
          <h2 className="reveal">Real Impact. Real Growth.</h2>
          <div className="impact reveal">
            {IMPACT_STATS.map((s, i) => (
              <div key={s.label} className="impact-stat reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.quote}
                className="testimonial reveal"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
                }}
              >
                <div className="quote-mark">"</div>
                <p>{t.quote}</p>
                <div className="stars">★★★★★</div>
                <div className="testi-who">
                  <span className="testi-avatar"><PersonAvatar scheme={AVATAR_SCHEMES[i % AVATAR_SCHEMES.length]} /></span>
                  <span className="testi-meta">— {t.name}<small>{t.role}</small></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. WHY CHOOSE ============ */}
      <section className="section section-white" id="why">
        <div className="container">
          <h2 className="reveal">Why Businesses Choose SKYUP CRM</h2>
          <div className="why-grid reveal">
            {[...WHY_CHOOSE].sort((a, b) => b.length - a.length).map((w, i) => (
              <div key={w} className="why-chip reveal" style={{ transitionDelay: `${i * 0.05}s`, '--wave-delay': `${i * 0.25}s` }}>
                ✓ {w}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 9. FAQ ============ */}
      <section className="section section-light" id="faq">
        <div className="container container-narrow">
          <h2 className="reveal">Frequently Asked Questions</h2>
          <div className="faqs reveal">
            {(faqExpanded ? FAQS : FAQS.slice(0, 4)).map((f, i) => (
              <div key={f.q} className={`faq ${faqOpen === i ? 'open' : ''}`} onMouseEnter={() => setFaqOpen(i)}>
                <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                  {f.q} <span>{faqOpen === i ? '−' : '+'}</span>
                </button>
                <div className="faq-a-wrap">
                  <div className="faq-a">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
          {FAQS.length > 4 && (
            <div className="center">
              <button className="faq-more" onClick={() => setFaqExpanded(!faqExpanded)}>
                {faqExpanded ? 'Show Less' : `See More (${FAQS.length - 4} more)`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============ 10. FINAL CTA ============ */}
      <section className="final-cta" ref={finalCtaRef}>
        <div className="container center">
          <h2 className="on-dark reveal">Stop Losing Customers You Already Paid to Acquire.</h2>
          <p className="on-dark reveal">
            Your leads are already coming in. Now make sure every enquiry is captured,
            followed up, tracked, and converted.
          </p>
          <div className="final-btns reveal">
            <button className="btn btn-orange btn-lg" onClick={() => openModal('final-cta')}>
              Book Your Free CRM Demo Today
            </button>
            <a
              className="btn btn-wa btn-lg"
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('Contact', { source: 'final-cta-whatsapp' })}
            >
              💬 Talk on WhatsApp
            </a>
          </div>
          <p className="final-note">No obligation. Speak with our team and see how SKYUP CRM fits your sales process.</p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="container footer-in">
          <div className="brand on-dark">
            <img src="/screenshots/logo.png" alt="SKYUP Digital Solutions" className="brand-logo" />
            <span className="brand-crm">CRM</span>
          </div>
          <p>SKYUP CRM — a product of {CONFIG.COMPANY}, {CONFIG.CITY}.</p>
          <p>© {new Date().getFullYear()} {CONFIG.COMPANY}. All rights reserved.</p>
        </div>
      </footer>

      {/* ============ MOBILE STICKY CTA ============ */}
      <div className={`sticky-cta ${stickyVisible && !atFinalCta ? 'show' : ''}`}>
        <button className="btn btn-orange btn-full" onClick={() => openModal('sticky-mobile')}>
          Book Free CRM Demo →
        </button>
      </div>

      {/* ============ FLOATING WHATSAPP CTA ============ */}
      <a
        className={`fab-whatsapp ${atFinalCta ? 'fab-hidden' : ''}`}
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        onClick={() => track('Contact', { source: 'fab-whatsapp' })}
        aria-label="Talk on WhatsApp"
      >
        <WhatsAppIcon size={30} />
      </a>

      <LeadModal open={modal.open} source={modal.source} onClose={() => setModal({ ...modal, open: false })} />
    </>
  )
}