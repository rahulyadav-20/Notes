import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import { api } from '../../api/client'
import { COURSES_DATA } from '../../data/courses'

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
    </svg>
  )
}

const TYPE_META = {
  note:      { icon: '📚', label: 'Note',           color: '#4A90D9' },
  interview: { icon: '🎯', label: 'Interview Pack', color: '#6366F1' },
  course:    { icon: '🎓', label: 'Video Course',   color: '#f5820a' },
}

const NOTE_CATEGORY = {
  kafka: 'data-engineer', spark: 'data-engineer', flink: 'data-engineer',
  druid: 'data-engineer', gcp: 'data-engineer', 'data-modeling': 'data-engineer',
  sql: 'data-engineer', 'machine-learning': 'data-science', langchain: 'ai',
  kubernetes: 'devops', react: 'frontend', javascript: 'frontend',
}

function contentPath(type, slug) {
  if (type === 'note')      return `/notes/${NOTE_CATEGORY[slug] || 'data-engineer'}/${slug}`
  if (type === 'interview') return `/interview/${slug}`
  return '/courses'
}

export default function Checkout() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const type           = params.get('type') || 'note'
  const urlSlug        = params.get('slug') || params.get('itemSlug') || params.get('topicSlug') || null

  const { user, isLoggedIn, owns } = useAuth()
  const { init }       = useAuthStore()

  const [pricing,       setPricing]      = useState(null)
  const [mode,          setMode]         = useState('dummy')
  const [items,         setItems]        = useState([])      // available items for picker
  const [selectedSlug,  setSelectedSlug] = useState(urlSlug) // the chosen item slug
  const [step,          setStep]         = useState('form')
  const [error,         setError]        = useState('')
  const [alreadyOwned,  setAlreadyOwned] = useState(null)  // set to path when 409 received
  const [loading,       setLoading]      = useState(false)

  // Fetch plans + available items for this type
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search))
      return
    }

    const loadItems = async () => {
      try {
        if (type === 'note') {
          const { data } = await api.getNotes()
          setItems(data.notes.map(n => ({
            slug:  n.slug,
            title: n.title,
            icon:  n.icon  || '📚',
            color: n.color || '#4A90D9',
            price: n.price,
          })))
        } else if (type === 'interview') {
          const { data } = await api.getInterviewTopics()
          setItems(data.topics.map(t => ({
            slug:  t.slug,
            title: t.title,
            icon:  t.icon  || '🎯',
            color: t.color || '#6366F1',
            price: t.price,
          })))
        } else if (type === 'course') {
          setItems(
            Object.entries(COURSES_DATA)
              .filter(([, c]) => !c.soon)
              .map(([slug, c]) => ({
                slug,
                title: c.name,
                icon:  '🎓',
                color: c.color || '#f5820a',
                price: null,   // from pricing config
              }))
          )
        }
      } catch { /* keep empty */ }
    }

    Promise.all([
      api.getPlans().then(({ data }) => {
        setPricing(data.pricing)
        setMode(data.mode)
      }),
      loadItems(),
    ]).catch(() => {})
  }, [isLoggedIn, navigate, type])

  // Clear stale messages when selection changes
  const selectedItem = items.find(i => i.slug === selectedSlug)
  const meta         = TYPE_META[type] || TYPE_META.note

  // Price: item-specific from DB, or fall back to type-level price
  const itemPriceRaw = selectedItem?.price ?? pricing?.[type]?.amount
  const itemPrice    = itemPriceRaw != null
    ? `₹${Math.round(itemPriceRaw / 100).toLocaleString('en-IN')}`
    : pricing?.[type]?.price || '—'

  if (step === 'done') {
    navigate(`/payment/success?type=${type}&slug=${selectedSlug || ''}`)
    return null
  }

  // Build order slug
  const orderSlug = type === 'note'      ? selectedSlug
                  : type === 'interview' ? selectedSlug
                  : null
  const orderCourseId = type === 'course' ? selectedSlug : null   // pass slug; backend resolves

  async function startPayment() {
    if (!selectedSlug) { setError('Please select an item to purchase.'); return }
    setLoading(true)
    setError('')
    setAlreadyOwned(null)
    try {
      const body = { type }
      if (type === 'note')      body.itemSlug  = selectedSlug
      if (type === 'interview') body.topicSlug = selectedSlug
      if (type === 'course')    body.courseSlug = selectedSlug

      const { data: order } = await api.createOrder(body)

      if (mode === 'dummy') {
        setStep('processing')
        await new Promise(r => setTimeout(r, 1600))
        await completePayment({ orderId: order.orderId, paymentId: `dummy_${Date.now()}`, signature: '' })
      }
    } catch (e) {
      if (e.response?.status === 409) {
        setAlreadyOwned(contentPath(type, selectedSlug))
      } else {
        setError(e.response?.data?.error || 'Failed to create order.')
      }
      setLoading(false)
    }
  }

  async function completePayment({ orderId, paymentId, signature }) {
    try {
      const body = { orderId, paymentId, signature, type }
      if (type === 'note')      body.itemSlug  = selectedSlug
      if (type === 'interview') body.topicSlug = selectedSlug
      if (type === 'course')    body.courseSlug = selectedSlug

      await api.verifyPayment(body)
      await init()
      setStep('done')
    } catch (e) {
      setError(e.response?.data?.error || 'Verification failed.')
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-68px)] bg-base flex items-start justify-center py-12 px-4">
        <motion.div className="w-full max-w-[820px] flex gap-8 items-start flex-col lg:flex-row"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── Left: Order summary ── */}
          <div className="w-full lg:w-[320px] shrink-0">
            <button onClick={() => navigate('/upgrade')}
              className="flex items-center gap-1.5 text-[0.78rem] font-bold text-muted
                hover:text-navy transition-colors mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to pricing
            </button>

            <div className="bg-white rounded-2xl border border-line p-5">
              <p className="text-[0.65rem] font-black uppercase tracking-[2px] text-muted mb-4">
                Order Summary
              </p>

              {/* Item picker OR selected item display */}
              {!urlSlug ? (
                /* ── Picker: user must choose an item ── */
                <div className="mb-4">
                  <p className="text-[0.75rem] font-bold text-navy mb-2">
                    Select {meta.label}
                  </p>
                  <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto pr-1">
                    {items.length === 0 ? (
                      <div className="h-8 bg-base rounded animate-pulse"/>
                    ) : items.map(item => {
                      const owned = owns(type === 'interview' ? 'interview' : type, item.slug)
                      return (
                        <div key={item.slug}
                          onClick={() => {
                            if (owned) { navigate(contentPath(type, item.slug)); return }
                            setSelectedSlug(item.slug); setAlreadyOwned(null); setError('')
                          }}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left
                            border transition-all text-[0.82rem] cursor-pointer
                            ${owned
                              ? 'border-green-200 bg-green-50 opacity-80'
                              : selectedSlug === item.slug
                                ? 'border-accent bg-accent/5 font-bold text-navy'
                                : 'border-line hover:border-[var(--color-line-hover)] text-muted hover:text-navy'
                            }`}>
                          <span className="text-base shrink-0"
                            style={{ color: item.color }}>{item.icon || meta.icon}</span>
                          <span className={`flex-1 truncate ${owned ? 'text-green-800 font-semibold' : ''}`}>
                            {item.title}
                          </span>
                          {owned ? (
                            <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full
                              bg-green-100 text-green-700 border border-green-200 shrink-0">
                              ✓ Owned
                            </span>
                          ) : selectedSlug === item.slug ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="#f5820a" strokeWidth="3" strokeLinecap="round">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* ── Selected item info ── */
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: selectedItem?.color
                      ? `color-mix(in srgb, ${selectedItem.color} 12%, var(--color-tint))`
                      : `color-mix(in srgb, ${meta.color} 12%, var(--color-tint))` }}>
                    {selectedItem?.icon || meta.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.9rem] font-extrabold text-navy leading-snug">
                      {selectedItem?.title || urlSlug}
                    </p>
                    <p className="text-[0.7rem] text-muted mt-0.5">{meta.label}</p>
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              {selectedSlug && (
                <div className="border-t border-line pt-4 space-y-2">
                  <div className="flex justify-between text-[0.8rem]">
                    <span className="text-muted">Price</span>
                    <span className="font-bold text-navy">{itemPrice}</span>
                  </div>
                  <div className="flex justify-between text-[0.8rem]">
                    <span className="text-muted">Valid for</span>
                    <span className="font-bold text-navy">2 years</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-line">
                    <span className="text-[0.88rem] font-bold text-muted">Total</span>
                    <span className="text-[1.3rem] font-black text-navy">{itemPrice}</span>
                  </div>
                </div>
              )}

              {!selectedSlug && (
                <p className="text-[0.75rem] text-muted italic text-center py-2">
                  ← Select an item above to see the price
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 text-[0.68rem] text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Secure · 7-day refund guarantee
              </div>
            </div>
          </div>

          {/* ── Right: Payment form ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-line p-7">
              <h2 className="text-[1.15rem] font-black text-navy mb-1">
                {mode === 'dummy' ? 'Complete Purchase (Demo)' : 'Payment Details'}
              </h2>
              <p className="text-[0.8rem] text-muted mb-6">
                Signed in as <strong className="text-navy">{user?.email}</strong>
              </p>

              <AnimatePresence mode="wait">
                {step === 'processing' ? (
                  <motion.div key="processing"
                    className="flex flex-col items-center justify-center py-14 gap-5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <Spinner/>
                    </div>
                    <div className="text-center">
                      <p className="text-[0.92rem] font-bold text-navy">Processing payment…</p>
                      <p className="text-[0.78rem] text-muted mt-1">Just a moment</p>
                    </div>
                  </motion.div>
                ) : step === 'error' ? (
                  <motion.div key="error" className="flex flex-col gap-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[0.82rem] font-semibold">
                      ⚠️ {error}
                    </div>
                    <button onClick={() => { setStep('form'); setError('') }}
                      className="px-5 py-2.5 rounded-xl font-bold text-[0.85rem] text-navy
                        border border-line hover:bg-base2 transition-colors">
                      Try again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                    {/* Item not selected warning */}
                    {!selectedSlug && !urlSlug && (
                      <div className="mb-5 p-4 rounded-xl bg-base border border-line text-muted text-[0.82rem]">
                        ← Please select a {meta.label.toLowerCase()} from the left panel first.
                      </div>
                    )}

                    {mode === 'dummy' && selectedSlug && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5">
                        <span className="text-[1.2rem] shrink-0">🧪</span>
                        <div>
                          <p className="text-[0.82rem] font-bold text-amber-800">Demo Mode</p>
                          <p className="text-[0.75rem] text-amber-700 mt-0.5 leading-relaxed">
                            No real payment. Click "Complete Purchase" to simulate and unlock the content.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Already owned — show friendly redirect instead of error */}
                    {alreadyOwned && (
                      <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200">
                        <p className="text-[0.85rem] font-bold text-green-800 mb-1">
                          ✓ You already own this {meta.label.toLowerCase()}
                        </p>
                        <p className="text-[0.75rem] text-green-700 mb-3">
                          Your access is still active — no need to buy again.
                        </p>
                        <button
                          onClick={() => navigate(alreadyOwned)}
                          className="px-4 py-2 rounded-lg text-[0.78rem] font-bold text-white
                            bg-green-600 hover:bg-green-700 transition-colors">
                          Go to {meta.label} →
                        </button>
                      </div>
                    )}

                    {error && (
                      <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[0.8rem] font-semibold">
                        ⚠️ {error}
                      </div>
                    )}

                    {/* Demo card fields */}
                    {mode === 'dummy' && selectedSlug && (
                      <div className="flex flex-col gap-3 mb-5 opacity-60 pointer-events-none select-none">
                        <div>
                          <label className="text-[0.72rem] font-bold text-navy mb-1.5 block">Card Number</label>
                          <div className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem] text-navy font-mono bg-base">
                            4111 1111 1111 1111
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[0.72rem] font-bold text-navy mb-1.5 block">Expiry</label>
                            <div className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem] text-navy font-mono bg-base">12/28</div>
                          </div>
                          <div>
                            <label className="text-[0.72rem] font-bold text-navy mb-1.5 block">CVV</label>
                            <div className="w-full px-4 py-3 rounded-xl border border-line text-[0.88rem] text-navy font-mono bg-base">123</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={startPayment}
                      disabled={loading || !selectedSlug}
                      className="w-full py-4 rounded-xl font-black text-[1rem] text-white
                        bg-gradient-to-br from-accent to-accent2
                        shadow-[0_4px_20px_rgba(245,130,10,0.35)]
                        hover:opacity-90 transition-opacity disabled:opacity-40
                        flex items-center justify-center gap-2.5">
                      {loading
                        ? <><Spinner/> Processing…</>
                        : selectedSlug
                          ? `Complete Purchase — ${itemPrice}`
                          : `Select a ${meta.label} first`
                      }
                    </button>

                    <p className="text-center text-[0.7rem] text-muted mt-3">
                      {mode === 'dummy' ? '🔒 Demo — no real charge' : '🔒 Secured by Razorpay'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
