import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0a0e27] text-white/60 mt-auto">
      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                <span className="text-white text-xs font-black">E</span>
              </div>
              <span className="font-black text-white text-base tracking-tight">
                Engi<span className="text-accent">Notes</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Deep-dive engineering guides and interview prep for developers who take their craft seriously.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">Learn</h4>
            <ul className="space-y-2 text-sm">
              {['Notes', 'Courses', 'Interview Prep', 'Cheat Sheets'].map(l => (
                <li key={l}>
                  <Link to="#" className="hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">Topics</h4>
            <ul className="space-y-2 text-sm">
              {['Data Engineering', 'System Design', 'DSA', 'JavaScript', 'Python'].map(l => (
                <li key={l}>
                  <Link to="#" className="hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-widest">Company</h4>
            <ul className="space-y-2 text-sm">
              {['About', 'Pricing', 'Blog', 'Contact'].map(l => (
                <li key={l}>
                  <Link to="#" className="hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} EngiNotes. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
