/**
 * PartHeader — dark gradient banner separating major parts.
 * @param {string} label - Part label e.g. "Part 1"
 * @param {string} title - Part title
 * @param {string} subtitle - Optional subtitle
 */
export default function PartHeader({ label, title, subtitle }) {
  return (
    <div className="ph">
      {label && <div className="pl">{label}</div>}
      <h1>{title}</h1>
      {subtitle && <div className="ps">{subtitle}</div>}
    </div>
  )
}
