/**
 * Callout — styled info/warning/tip box.
 * @param {'info'|'pitfall'|'note'} variant - Visual style: 'info' (blue), 'pitfall' (red), 'note' (green)
 * @param {string} label - Bold label text e.g. "Info", "Pitfall", "Production Note"
 * @param {React.ReactNode} children - Callout body content
 */
export default function Callout({ variant = 'info', label, children }) {
  const variantClass = {
    info:    'co-i',
    pitfall: 'co-p',
    note:    'co-n',
  }[variant] || 'co-i'

  return (
    <div className={`co ${variantClass}`}>
      {label && <span className="cl">{label}</span>}
      {children}
    </div>
  )
}
