// All copy & content lives here so it can be edited without touching components.

export const CHANNELS = ['Meta Ads', 'Google Ads', 'Website', 'WhatsApp', 'Calls']

export const HERO_CATEGORIES = [
  {
    icon: '👥', title: 'Lead Management', color: 'blue',
    points: ['Auto lead capture', 'Lead assignment', 'Pipeline tracking', 'Lead status'],
  },
  {
    icon: '💬', title: 'WhatsApp & Communication', color: 'green',
    points: ['WhatsApp CRM', 'Email campaigns', 'SMS', 'Call management'],
  },
  {
    icon: '🤖', title: 'AI Automation', color: 'orange',
    points: ['AI call summaries', 'AI transcription', 'AI insights', 'AI voice bot'],
  },
  {
    icon: '⚙️', title: 'Sales & Workflow Automation', color: 'blue',
    points: ['Auto follow-ups', 'Task reminders', 'Workflow automation', 'Notifications'],
  },
  {
    icon: '👥', title: 'Workforce Management', color: 'blue',
    points: ['GPS attendance', 'Live tracking', 'Team chat', 'Project tracking'],
  },
  {
    icon: '📈', title: 'Reports & Analytics', color: 'blue',
    points: ['Dashboards', 'KPIs', 'Real-time reports', 'Customer 360° view'],
  },
]

export const PROBLEMS = [
  {
    icon: '📞',
    title: 'You Paid for the Lead. Nobody Called.',
    body: 'Your ad budget brings enquiries, but missed calls and delayed follow-ups push customers to competitors.',
  },
  {
    icon: '⏱️',
    title: 'Your Competitor Responds Before You Do.',
    body: 'The first business to respond often wins the customer. Every delayed response increases the chance of losing them.',
  },
  {
    icon: '❓',
    title: "Managers Don't Know What Happened.",
    body: 'Salespeople say they called, but there is no proof, no recording, and no follow-up visibility.',
  },
  {
    icon: '📤',
    title: 'Customer Data Leaves With Employees.',
    body: 'Leads stored in personal phones and Excel sheets disappear when staff leave.',
  },
]

export const JOURNEY = [
  { icon: '📥', label: 'Lead received' },
  { icon: '👤', label: 'Assigned to salesperson' },
  { icon: '💬', label: 'WhatsApp message sent' },
  { icon: '🔔', label: 'Follow-up reminder created' },
  { icon: '📞', label: 'Call recorded' },
  { icon: '📊', label: 'Manager sees status' },
  { icon: '🏆', label: 'Customer converted' },
]

export const BEFORE_POINTS = [
  'Leads scattered in WhatsApp, Excel, calls, and ads',
  'No accountability',
  'Missed follow-ups',
  'No customer history',
  'Manual reports',
]

export const AFTER_POINTS = [
  'All leads in one dashboard',
  'Auto assignment',
  'Follow-up reminders',
  'Call recording and AI summaries',
  'Real-time reports',
]

export const LEAD_STEPS = [
  'Lead captured from Meta Ads, Google Ads, Website or WhatsApp',
  'Lead assigned automatically',
  'Salesperson receives task',
  'WhatsApp confirmation sent',
  'Follow-up reminder created',
  'Manager tracks progress in real time',
]

export const FEATURES = [
  { n: 1, icon: '🧲', title: 'Lead Capture', body: 'Collect enquiries from Meta Ads, Google Ads, website forms, WhatsApp, calls, and manual entries in one CRM.' },
  { n: 2, icon: '🎯', title: 'Smart Lead Assignment', body: 'Send each lead instantly to the right salesperson without manual allocation.' },
  { n: 3, icon: '🔔', title: 'Follow-up Automation', body: 'Never forget customer follow-ups with automated reminders.' },
  { n: 4, icon: '💬', title: 'WhatsApp Integration', body: 'Manage customer conversations without losing communication history.' },
  { n: 5, icon: '🎙️', title: 'Call Recording', body: 'Verify calls, improve accountability, and protect customer conversations.' },
  { n: 6, icon: '🤖', title: 'AI Call Summary', body: 'Know what happened in every call without listening to full recordings.' },
  { n: 7, icon: '📍', title: 'Attendance & GPS Tracking', body: 'Track field visits, attendance, and team movement in real time.' },
  { n: 8, icon: '📈', title: 'Reports & Analytics', body: 'See lead response time, conversions, team performance, and campaign ROI.' },
  { n: 9, icon: '📱', title: 'Mobile CRM', body: 'Manage leads, calls, meetings, and follow-ups from anywhere.' },
]

// Product tour tabs — drop real screenshots into /public/screenshots/ with these filenames.
export const TOUR_TABS = [
  { id: 'leads', label: 'Leads', img: '/screenshots/leads.png', caption: 'Every enquiry in one place — with call recordings, AI insights, and one-click WhatsApp meeting scheduling.' },
  { id: 'campaigns', label: 'Campaigns', img: '/screenshots/campaigns.png', caption: 'See which ad campaigns bring leads that actually convert — not just clicks.' },
  { id: 'whatsapp', label: 'WhatsApp', img: '/screenshots/whatsapp.png', caption: 'Send template messages, confirmations, and follow-ups without leaving the CRM.' },
  { id: 'sms', label: 'SMS', img: '/screenshots/sms.png', caption: 'DLT-compliant SMS follow-ups and OTPs, tracked against each lead.' },
  { id: 'attendance', label: 'Attendance', img: '/screenshots/attendance.png', caption: 'Field team check-ins with GPS — know who visited which customer, when.' },
  { id: 'team', label: 'Team', img: '/screenshots/team.png', caption: 'Per-salesperson performance: response time, follow-ups done, conversions.' },
]

export const IMPACT_STATS = [
  { value: '50+', label: 'Business processes automated' },
  { value: '24/7', label: 'Customer support' },
  { value: 'Real-time', label: 'Sales visibility' },
  { value: 'Faster', label: 'Response time' },
  { value: 'Better', label: 'Team accountability & productivity' },
]

export const TESTIMONIALS = [
  {
    quote: 'Earlier we were losing leads because follow-ups were missed. With SkyUp CRM, every enquiry is tracked and our team is accountable.',
    name: 'Business Owner',
    role: 'Real Estate, Bengaluru',
  },
  {
    quote: 'Automation and real-time insights helped our sales team respond faster and convert more enquiries.',
    name: 'Sales Manager',
    role: 'Education Services',
  },
]

export const WHY_CHOOSE = [
  'Built for Indian businesses',
  'Easy implementation',
  'Dedicated onboarding',
  'Mobile-first CRM',
  'Secure customer database',
  'AI-powered productivity',
  'Track every sales activity',
  'Improve ROI on advertising',
  'Make better business decisions',
]

export const FAQS = [
  { q: 'Can SkyUp CRM capture leads from Meta Ads and Google Ads?', a: 'Yes. SkyUp CRM connects directly to Meta lead forms and Google Ads lead forms via webhooks, so every enquiry lands in the CRM within seconds — no manual downloading of CSVs.' },
  { q: 'Can leads be assigned automatically?', a: 'Yes. Set assignment rules by source, location, or round-robin, and every new lead reaches the right salesperson instantly with a notification.' },
  { q: 'Does it support WhatsApp communication?', a: 'Yes. Send approved WhatsApp template messages, confirmations, and follow-ups from inside the CRM, with the complete conversation history saved on the lead.' },
  { q: 'Can managers track sales team performance?', a: 'Yes. Managers see response times, follow-ups completed, call recordings, field visits, and conversions per salesperson in real time.' },
  { q: 'Can we migrate existing Excel / customer data?', a: 'Yes. Our onboarding team imports your existing Excel sheets and customer lists with phone-number cleanup and duplicate detection included.' },
  { q: 'Is it useful for real estate, education, services, and field sales teams?', a: 'Yes. SkyUp CRM is built for enquiry-driven Indian businesses — real estate, education, healthcare, services, and any team that runs on calls, WhatsApp, and field visits.' },
  { q: 'How long does implementation take?', a: 'Most businesses are live within 2–5 working days, including lead source connections, WhatsApp templates, and team onboarding.' },
  { q: 'Does SkyUp CRM have AI call summaries?', a: 'Yes. Every recorded call gets an AI-generated summary so managers know what was discussed without listening to full recordings.' },
]
