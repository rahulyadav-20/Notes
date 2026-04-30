export default function Section({ id, title, children }) {
  return (
    <div id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-[1.6rem] font-black text-navy mb-6 pb-3 border-b border-line">{title}</h2>
      <div>{children}</div>
    </div>
  )
}
