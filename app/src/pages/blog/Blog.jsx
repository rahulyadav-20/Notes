import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import {
  BLOG_POSTS, POST_CATEGORIES, COMPANY_COLORS,
  getFeaturedPost, getBlogPostsByCategory, formatDate,
} from '../../data/blog'

/* ── Category badge ── */
function CatBadge({ categoryId, small }) {
  const cat = POST_CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return null
  return (
    <span className={`font-bold rounded-full inline-flex items-center gap-1
      ${small ? 'text-[0.6rem] px-2 py-0.5' : 'text-[0.65rem] px-2.5 py-1'}`}
      style={{ color: cat.color, background: `color-mix(in srgb, ${cat.color} 12%, #f5f7ff)` }}>
      {cat.emoji} {cat.label}
    </span>
  )
}

/* ── Company badge ── */
function CompanyBadge({ company }) {
  if (!company) return null
  const color = COMPANY_COLORS[company] || '#6b7280'
  return (
    <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-md border"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 30%, #e2e5f0)`,
        background:  `color-mix(in srgb, ${color} 8%, #fff)`,
      }}>
      {company}
    </span>
  )
}

/* ── Author avatar ── */
function Avatar({ author, size = 'sm' }) {
  const s = size === 'lg' ? 'w-10 h-10 text-[0.85rem]' : 'w-7 h-7 text-[0.65rem]'
  return (
    <div className={`${s} rounded-full flex items-center justify-center font-black text-white shrink-0`}
      style={{ background: author.color }}>
      {author.initials}
    </div>
  )
}

/* ── Featured post card ── */
function FeaturedCard({ post }) {
  const navigate = useNavigate()
  const cat = POST_CATEGORIES.find(c => c.id === post.category)

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer group
        border border-line hover:border-[#c5cae5] transition-all
        hover:shadow-[0_16px_48px_rgba(18,18,58,0.10)]"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onClick={() => navigate(`/blog/${post.slug}`)}>

      {/* Background gradient */}
      <div className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg,
            color-mix(in srgb, ${cat?.color || '#6366F1'} 8%, #fff) 0%,
            #fff 60%)`,
        }}/>

      <div className="relative flex flex-col lg:flex-row gap-0 min-h-[280px]">
        {/* Left: content */}
        <div className="flex-1 p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full
                bg-amber-100 text-amber-700 border border-amber-200">
                ★ Featured
              </span>
              <CatBadge categoryId={post.category}/>
              {post.company && <CompanyBadge company={post.company}/>}
            </div>

            <h2 className="text-[1.4rem] sm:text-[1.7rem] font-black text-navy
              leading-snug mb-3 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            <p className="text-[0.88rem] text-muted leading-relaxed line-clamp-3 max-w-[560px]">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <div className="flex items-center gap-2.5">
              <Avatar author={post.author} size="lg"/>
              <div>
                <div className="text-[0.8rem] font-bold text-navy">{post.author.name}</div>
                <div className="text-[0.68rem] text-muted">{formatDate(post.date)}</div>
              </div>
            </div>
            <span className="text-[0.72rem] text-muted border-l border-line pl-4">
              {post.readTime}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map(t => (
                <span key={t} className="text-[0.62rem] font-semibold px-2 py-0.5
                  rounded-md bg-base border border-line text-navy2">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: decorative panel */}
        <div className="hidden lg:flex w-[280px] shrink-0 items-center justify-center
          border-l border-line/50 p-8"
          style={{ background: `color-mix(in srgb, ${cat?.color || '#6366F1'} 6%, #fafbff)` }}>
          <div className="text-center">
            <div className="text-[5rem] mb-3 select-none">{cat?.emoji || '📝'}</div>
            <div className="text-[0.72rem] font-bold text-muted uppercase tracking-wider">
              {cat?.label}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Blog post card ── */
function PostCard({ post, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col
        cursor-pointer group hover:border-[#c5cae5]
        hover:shadow-[0_8px_32px_rgba(18,18,58,0.08)] transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/blog/${post.slug}`)}>

      {/* Color strip top */}
      {(() => {
        const cat = POST_CATEGORIES.find(c => c.id === post.category)
        return (
          <div className="h-1 w-full"
            style={{ background: cat?.color || '#6b7280' }}/>
        )
      })()}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <CatBadge categoryId={post.category} small/>
          {post.company && <CompanyBadge company={post.company}/>}
        </div>

        {/* Title */}
        <h3 className="text-[0.95rem] font-extrabold text-navy leading-snug
          group-hover:text-accent transition-colors line-clamp-3 flex-1">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[0.78rem] text-muted leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[0.6rem] font-semibold px-1.5 py-0.5
              rounded bg-base border border-line text-navy2">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-line flex items-center gap-3 bg-base/30">
        <Avatar author={post.author}/>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[0.72rem] font-bold text-navy truncate">
            {post.author.name}
          </span>
          <span className="text-[0.65rem] text-muted">{formatDate(post.date)}</span>
        </div>
        <span className="text-[0.65rem] text-muted shrink-0">{post.readTime}</span>
      </div>
    </motion.div>
  )
}

/* ── Write CTA banner ── */
function WriteBanner() {
  return (
    <motion.div
      className="bg-[#0f0f23] rounded-2xl p-6 sm:p-8 relative overflow-hidden
        flex items-center gap-6 flex-wrap"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 0% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)' }}/>
      <div className="relative flex-1 min-w-[200px]">
        <p className="text-[0.65rem] font-bold uppercase tracking-[2px] text-accent mb-1.5">
          Write for EngiNotes
        </p>
        <h3 className="text-[1.1rem] font-black text-white leading-snug mb-1.5">
          Share your interview experience or write a tech article
        </h3>
        <p className="text-[0.78rem] text-white/40 leading-relaxed">
          Help thousands of engineers prep smarter. All experience levels welcome.
        </p>
      </div>
      <div className="relative flex flex-col gap-2 shrink-0">
        <button className="px-5 py-2.5 rounded-xl font-bold text-[0.85rem] text-white
          bg-gradient-to-br from-accent to-accent2 hover:opacity-90 transition-opacity
          shadow-[0_4px_16px_rgba(245,130,10,0.3)]">
          Submit a Post
        </button>
        <span className="text-[0.62rem] text-white/25 text-center">
          Community review · No account needed yet
        </span>
      </div>
    </motion.div>
  )
}

/* ── Blog page ── */
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('all')

  const featured  = getFeaturedPost()
  const allOthers = BLOG_POSTS.filter(p => !p.featured)
  const filtered  = activeCategory === 'all'
    ? allOthers
    : allOthers.filter(p => p.category === activeCategory)

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-white border-b border-line py-12 lg:py-14">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <p className="text-[0.68rem] font-bold uppercase tracking-[3px] text-accent mb-3">
              Blog
            </p>
            <h1 className="text-3xl sm:text-[2.6rem] font-black text-navy
              tracking-tight leading-tight mb-3">
              Real Stories. Real Prep.<br/>
              <span className="text-accent">From Engineers Who've Been There.</span>
            </h1>
            <p className="text-[0.92rem] text-muted max-w-[500px] leading-relaxed">
              Interview experiences, engineering deep dives, and career advice
              from engineers at Google, Amazon, Meta and beyond.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="bg-white border-b border-line">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-8 py-4 overflow-x-auto">
            {[
              { num: `${BLOG_POSTS.length}`, label: 'Articles' },
              { num: `${BLOG_POSTS.filter(p => p.category === 'interview-experience').length}`, label: 'Interview Stories' },
              { num: `${new Set(BLOG_POSTS.map(p => p.author.name)).size}`, label: 'Authors' },
              { num: `${new Set(BLOG_POSTS.flatMap(p => p.company ? [p.company] : [])).size}`, label: 'Companies Covered' },
            ].map((s, i) => (
              <motion.div key={s.label}
                className="flex items-center gap-2 shrink-0"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}>
                <span className="text-[1.5rem] font-black text-accent">{s.num}</span>
                <span className="text-[0.68rem] font-semibold text-muted uppercase tracking-wide">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured post ── */}
      <section className="pt-10 pb-4 bg-base">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <FeaturedCard post={featured}/>
        </div>
      </section>

      {/* ── Filter + grid ── */}
      <section className="py-8 lg:py-12 bg-base">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 flex-wrap">
            <button
              className={`shrink-0 px-4 py-1.5 rounded-lg text-[0.8rem] font-bold
                border transition-all ${activeCategory === 'all'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-muted border-line hover:border-[#c5cae5]'}`}
              onClick={() => setActiveCategory('all')}>
              All Posts
            </button>
            {POST_CATEGORIES.map(cat => (
              <button key={cat.id}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-lg
                  text-[0.8rem] font-bold border transition-all ${
                  activeCategory === cat.id
                    ? 'text-white border-transparent'
                    : 'bg-white text-muted border-line hover:border-[#c5cae5]'
                }`}
                style={activeCategory === cat.id
                  ? { background: cat.color, borderColor: cat.color }
                  : {}}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.emoji} {cat.label}
              </button>
            ))}
            <span className="text-[0.78rem] text-muted ml-auto shrink-0">
              {filtered.length + (activeCategory === 'all' ? 1 : 0)} post{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {filtered.length > 0
                ? filtered.map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i}/>
                  ))
                : (
                  <div className="col-span-full text-center py-16 text-muted">
                    <div className="text-4xl mb-3">📭</div>
                    <p>No posts in this category yet</p>
                  </div>
                )
              }
            </motion.div>
          </AnimatePresence>

          {/* Write CTA */}
          <div className="mt-12">
            <WriteBanner/>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
