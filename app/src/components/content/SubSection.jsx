/**
 * SubSection — wraps a subsection within a Section.
 * @param {string} title - Subsection heading
 * @param {React.ReactNode} children
 */
export default function SubSection({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="ss">{title}</h3>
      <div className="ct">{children}</div>
    </div>
  )
}
