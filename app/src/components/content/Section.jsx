/**
 * Section — wraps a major note section.
 * @param {string} title - Section heading e.g. "1 — Consumer Groups"
 * @param {React.ReactNode} children
 */
export default function Section({ title, children }) {
  return (
    <div className="mb-12">
      <h2 className="text-[1.6rem] font-black text-navy mb-6 pb-3 border-b border-line">{title}</h2>
      <div>{children}</div>
    </div>
  )
}
