import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../api/client'

const VALID_LABEL = '2 years'

const ITEMS = [
  {
    type:     'note',
    icon:     '📚',
    color:    '#4A90D9',
    title:    'Individual Note',
    desc:     'Buy any single deep-dive note. Full access to all parts — valid for 2 years.',
    features: ['All parts unlocked', '3D architecture diagrams', 'Code examples', 'Production patterns'],
    example:  'e.g. Apache Kafka, Spark, GCP…',
  },
  {
    type:     'interview',
    icon:     '🎯',
    color:    '#6366F1',
    title:    'Interview Topic Pack',
    desc:     'Unlock all premium questions for one topic — valid for 2 years.',
    features: ['Full answers + code', 'Hints & complexity', 'Company tags', 'Difficulty breakdown'],
    example:  'e.g. DSA, System Design, SQL…',
    popular:  true,
  },
  {
    type:     'course',
    icon:     '🎓',
    color:    '#f5820a',
    title:    'Video Course',
    desc:     'Buy one full video course with projects and certificate — valid for 2 years.',
    features: ['Full video access', 'Downloadable project files', 'Certificate on completion', 'Lifetime updates'],
    example:  'e.g. Kafka Masterclass…',
  },
]

const FAQS = [
  { q: 'What does "valid for 2 years" mean?',       a: 'Once you buy an item, you have full access for 730 days from the purchase date. After that, you can re-purchase at the same price.' },
  { q: 'Can I buy multiple notes?',                  a: 'Yes — each note, interview topic, and course is purchased individually. You only pay for what you need.' },
  { q: 'What\'s free without purchasing anything?', a: 'The first 2 parts of every note, up to 10 free questions per interview topic, full blog access, and all course previews.' },
  { q: 'Can I get a refund?',                        a: '7-day full refund if you\'re not satisfied — no questions asked.' },
  { q: 'Do admins pay?',                             a: 'Admin accounts have full access to all content at no charge.' },
]

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line last:border-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="text-[0.9rem] font-bold text-navy">{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && <p className="pb-4 text-[0.82rem] text-muted leading-relaxed">{a}</p>}
    </div>
  )
}

export default function Upgrade() {
  const navigate = useNavigate()
  const { isLoggedIn, isAdmin } = useAuth()
  const [pricing, setPricing] = useState(null)
  const [mode,    setMode]    = useState('dummy')

  useEffect(() => {
    api.getPlans()
      .then(({ data }) => { setPricing(data.pricing); setMode(data.mode) })
      .catch(() => {})
  }, [])

  function startPurchase(type) {
    if (!isLoggedIn) { navigate(`/login?redirect=/upgrade`); return }
    navigate(`/checkout?type=${type}`)
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-line py-14 lg:py-20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          {mode === 'dummy' && (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200
              text-amber-700 text-[0.72rem] font-bold px-3 py-1.5 rounded-full mb-6">
              🧪 Demo mode — no real payment
            </div>
          )}
          {isAdmin && (
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200
              text-green-700 text-[0.82rem] font-bold px-4 py-2 rounded-xl mb-6">
              ✓ You have admin access — all content is free for you
            </div>
          )}
          <motion.h1
            className="text-[2.4rem] sm:text-[3.2rem] font-black text-navy tracking-tight leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Pay only for what you use.
          </motion.h1>
          <motion.p className="text-[1rem] text-muted max-w-[500px] mx-auto leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            No subscriptions. Buy individual notes, interview packs, or courses.
            Each purchase is valid for <strong className="text-navy">{VALID_LABEL}</strong>.
          </motion.p>
        </div>
      </div>

      {/* Pricing cards */}
      <section className="py-14 lg:py-20 bg-base">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {ITEMS.map((item, i) => {
              const price = pricing?.[item.type]
              return (
                <motion.div key={item.type}
                  className={`relative flex flex-col rounded-3xl border-2 p-7 bg-white transition-all
                    ${item.popular
                      ? 'border-accent shadow-[0_8px_40px_rgba(245,130,10,0.18)]'
                      : 'border-line hover:border-[var(--color-line-hover)]'
                    }`}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>

                  {item.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2
                      px-4 py-1 rounded-full text-[0.7rem] font-black text-white whitespace-nowrap
                      bg-gradient-to-r from-accent to-accent2">
                      Most Popular
                    </div>
                  )}

                  {/* Icon + title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `color-mix(in srgb, ${item.color} 12%, var(--color-tint))` }}>
                      {item.icon}
                    </div>
                    <h3 className="text-[1rem] font-extrabold text-navy">{item.title}</h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {price ? (
                      <div className="flex items-end gap-1 leading-none">
                        <span className="text-[2.8rem] font-black text-navy tracking-tight">{price.price}</span>
                        <span className="text-[0.78rem] text-muted mb-1.5">per item</span>
                      </div>
                    ) : (
                      <div className="h-12 w-24 bg-base rounded-lg animate-pulse"/>
                    )}
                    <p className="text-[0.72rem] text-muted mt-1">
                      Valid for <strong className="text-navy">{VALID_LABEL}</strong> from purchase date
                    </p>
                  </div>

                  <p className="text-[0.8rem] text-muted leading-relaxed mb-5">{item.desc}</p>
                  <p className="text-[0.7rem] text-muted/60 italic mb-5">{item.example}</p>

                  {/* CTA */}
                  <button
                    onClick={() => startPurchase(item.type)}
                    disabled={isAdmin}
                    className={`w-full py-3 rounded-xl font-bold text-[0.9rem] transition-all mb-6
                      ${isAdmin
                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                        : item.popular
                          ? 'bg-gradient-to-br from-accent to-accent2 text-white shadow-[0_4px_16px_rgba(245,130,10,0.3)] hover:opacity-90'
                          : 'bg-navy text-white hover:bg-navy2'
                      }`}>
                    {isAdmin ? '✓ Free for you' : `Browse & Buy ${item.icon}`}
                  </button>

                  <div className="h-px bg-line mb-5"/>

                  <div className="flex flex-col gap-2.5 flex-1">
                    {item.features.map(f => (
                      <div key={f} className="flex items-center gap-2.5 text-[0.8rem]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="#10B981" strokeWidth="3" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        <span className="text-navy">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Free tier comparison */}
      <section className="py-14 bg-white border-t border-line">
        <div className="max-w-[720px] mx-auto px-6">
          <h2 className="text-[1.5rem] font-black text-navy text-center mb-8">
            What's always free
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📖', title: 'Note previews',      desc: 'First 2 parts of every note — no purchase needed' },
              { icon: '❓', title: 'Free questions',     desc: '10 free questions per interview topic' },
              { icon: '📰', title: 'Full blog access',   desc: 'All articles and interview stories forever' },
              { icon: '🎬', title: 'Course previews',    desc: 'First lesson of every course for free' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3 p-4 rounded-xl border border-line bg-base">
                <span className="text-[1.3rem] shrink-0">{f.icon}</span>
                <div>
                  <p className="text-[0.85rem] font-bold text-navy">{f.title}</p>
                  <p className="text-[0.75rem] text-muted mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-base border-t border-line">
        <div className="max-w-[680px] mx-auto px-6">
          <h2 className="text-[1.5rem] font-black text-navy text-center mb-8">Questions</h2>
          <div className="bg-white rounded-2xl border border-line px-6">
            {FAQS.map(faq => <FAQ key={faq.q} {...faq}/>)}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
