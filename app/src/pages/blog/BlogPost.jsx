import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import {
  getBlogPostBySlug, getRelatedPosts, POST_CATEGORIES,
  COMPANY_COLORS, formatDate,
} from '../../data/blog'

/* ── Category badge ── */
function CatBadge({ categoryId }) {
  const cat = POST_CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return null
  return (
    <span className="text-[0.68rem] font-bold px-3 py-1 rounded-full
      inline-flex items-center gap-1.5"
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
    <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-lg border"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 35%, #e2e5f0)`,
        background:  `color-mix(in srgb, ${color} 8%, #fff)`,
      }}>
      {company}
    </span>
  )
}

/* ── Article content renderer ── */
function ArticleBody({ content }) {
  return (
    <div className="flex flex-col gap-4">
      {content.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p key={i} className="text-[0.93rem] text-navy/80 leading-[1.9]">
              {block.text}
            </p>
          )
        }
        if (block.type === 'h2') {
          return (
            <h2 key={i} className="text-[1.15rem] font-black text-navy mt-4 mb-1
              border-l-4 border-accent pl-4">
              {block.text}
            </h2>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="flex flex-col gap-2 pl-4">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-[0.9rem] text-navy/80 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2"/>
                  {item}
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'tip') {
          return (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl
              bg-amber-50 border border-amber-200">
              <span className="text-[1.1rem] shrink-0">💡</span>
              <p className="text-[0.85rem] text-amber-900 leading-relaxed font-medium">
                {block.text}
              </p>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

/* ── Author card ── */
function AuthorCard({ author, date, readTime }) {
  return (
    <div className="bg-white rounded-2xl border border-line p-5">
      <p className="text-[0.62rem] font-bold uppercase tracking-[1.5px] text-muted mb-3">
        Author
      </p>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center
          text-[1rem] font-black text-white shrink-0"
          style={{ background: author.color }}>
          {author.initials}
        </div>
        <div>
          <div className="text-[0.88rem] font-extrabold text-navy">{author.name}</div>
          <div className="text-[0.7rem] text-muted mt-0.5">Engineer · EngiNotes</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[0.7rem] text-muted pt-3 border-t border-line">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        {formatDate(date)}
        <span className="mx-1">·</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        {readTime}
      </div>
    </div>
  )
}

/* ── Share card ── */
function ShareCard({ title }) {
  return (
    <div className="bg-white rounded-2xl border border-line p-5">
      <p className="text-[0.62rem] font-bold uppercase tracking-[1.5px] text-muted mb-3">
        Share
      </p>
      <div className="flex flex-col gap-2">
        {[
          { label: 'Copy Link', icon: '🔗', action: () => navigator.clipboard.writeText(window.location.href) },
          { label: 'Share on Twitter', icon: '𝕏', action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`) },
          { label: 'Share on LinkedIn', icon: 'in', action: () => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`) },
        ].map(s => (
          <button key={s.label}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.78rem]
              font-semibold text-navy hover:bg-base2 transition-colors text-left border border-line"
            onClick={s.action}>
            <span className="text-[0.85rem] w-5 text-center shrink-0">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Related post mini card ── */
function RelatedCard({ post, navigate }) {
  const cat = POST_CATEGORIES.find(c => c.id === post.category)
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-base2
        transition-colors cursor-pointer group"
      onClick={() => navigate(`/blog/${post.slug}`)}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
        style={{ background: `color-mix(in srgb, ${cat?.color || '#6366F1'} 12%, #f5f7ff)` }}>
        {cat?.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.78rem] font-bold text-navy group-hover:text-accent
          transition-colors leading-snug line-clamp-2">
          {post.title}
        </p>
        <p className="text-[0.65rem] text-muted mt-0.5">{post.readTime}</p>
      </div>
    </div>
  )
}

/* ── Blog Post Page ── */
export default function BlogPost() {
  const { slug } = useParams()
  const navigate  = useNavigate()

  const post    = getBlogPostBySlug(slug)
  const related = getRelatedPosts(slug, 3)

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 px-10 text-muted">
          <h2 className="text-2xl font-bold mb-5">Post not found</h2>
          <button className="px-6 py-3 rounded-xl border-2 border-line text-navy
            font-bold text-sm hover:bg-base2 transition-colors"
            onClick={() => navigate('/blog')}>
            ← Back to Blog
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const cat = POST_CATEGORIES.find(c => c.id === post.category)

  return (
    <>
      <Navbar />

      {/* ── Article header ── */}
      <div className="bg-white border-b border-line">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.78rem] mb-6">
            <button className="text-muted hover:text-navy transition-colors font-semibold"
              onClick={() => navigate('/blog')}>
              Blog
            </button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="text-[#b0b8d0]">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="text-muted font-semibold">{cat?.label}</span>
          </div>

          <motion.div
            className="max-w-[760px]"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <CatBadge categoryId={post.category}/>
              {post.company && <CompanyBadge company={post.company}/>}
            </div>

            <h1 className="text-[1.7rem] sm:text-[2.1rem] lg:text-[2.4rem] font-black
              text-navy leading-tight mb-5">
              {post.title}
            </h1>

            <p className="text-[0.95rem] text-muted leading-relaxed mb-6">
              {post.excerpt}
            </p>

            {/* Author + meta */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center
                  text-[0.78rem] font-black text-white shrink-0"
                  style={{ background: post.author.color }}>
                  {post.author.initials}
                </div>
                <div>
                  <div className="text-[0.82rem] font-bold text-navy">{post.author.name}</div>
                  <div className="text-[0.68rem] text-muted">{formatDate(post.date)}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[0.72rem] text-muted
                border-l border-line pl-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                {post.readTime}
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(t => (
                  <span key={t} className="text-[0.62rem] font-semibold px-2 py-0.5
                    rounded-md bg-base border border-line text-navy2">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Article body + sidebar ── */}
      <section className="py-10 lg:py-14 bg-base">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex gap-10 items-start">

            {/* ── Main article ── */}
            <motion.article
              className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="bg-white rounded-2xl border border-line p-6 sm:p-10">
                <ArticleBody content={post.content}/>
              </div>

              {/* Back to blog */}
              <motion.button
                className="mt-6 flex items-center gap-2 text-[0.82rem] font-bold
                  text-muted hover:text-navy transition-colors"
                onClick={() => navigate('/blog')}
                whileHover={{ x: -3 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Blog
              </motion.button>
            </motion.article>

            {/* ── Sticky sidebar ── */}
            <aside className="hidden lg:flex flex-col gap-5 w-[280px] shrink-0 sticky top-[90px]">
              <motion.div
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}>
                <AuthorCard author={post.author} date={post.date} readTime={post.readTime}/>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}>
                <ShareCard title={post.title}/>
              </motion.div>

              {related.length > 0 && (
                <motion.div
                  className="bg-white rounded-2xl border border-line p-5"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[1.5px] text-muted mb-3">
                    Related Posts
                  </p>
                  <div className="flex flex-col gap-1">
                    {related.map(r => (
                      <RelatedCard key={r.slug} post={r} navigate={navigate}/>
                    ))}
                  </div>
                </motion.div>
              )}
            </aside>
          </div>

          {/* ── Mobile: related posts ── */}
          {related.length > 0 && (
            <div className="lg:hidden mt-8">
              <h3 className="text-[0.82rem] font-bold uppercase tracking-wider text-muted mb-4">
                Related Posts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => {
                  const rCat = POST_CATEGORIES.find(c => c.id === r.category)
                  return (
                    <div key={r.slug}
                      className="bg-white border border-line rounded-xl p-4 cursor-pointer
                        hover:border-[#c5cae5] transition-all"
                      onClick={() => navigate(`/blog/${r.slug}`)}>
                      <div className="flex items-center gap-2 mb-2">
                        <span>{rCat?.emoji}</span>
                        <span className="text-[0.62rem] font-bold text-muted">{r.readTime}</span>
                      </div>
                      <p className="text-[0.82rem] font-bold text-navy leading-snug line-clamp-2">
                        {r.title}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── CTA banner ── */}
          <motion.div
            className="mt-12 bg-[#0f0f23] rounded-2xl px-6 sm:px-10 py-10
              text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(245,130,10,0.12) 0%, transparent 70%)' }}/>
            <div className="relative">
              <p className="text-[0.65rem] font-bold uppercase tracking-[2.5px] text-accent mb-3">
                Share Your Story
              </p>
              <h2 className="text-[1.4rem] sm:text-[1.7rem] font-black text-white mb-3">
                Had a recent interview experience?
              </h2>
              <p className="text-[0.85rem] text-white/40 max-w-[380px] mx-auto mb-6 leading-relaxed">
                Your story could help thousands of engineers prep for their next big interview.
              </p>
              <button className="px-6 py-3 rounded-xl font-bold text-[0.88rem] text-white
                bg-gradient-to-br from-accent to-accent2 hover:opacity-90 transition-opacity
                shadow-[0_4px_14px_rgba(245,130,10,0.3)]">
                Write a Post →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
