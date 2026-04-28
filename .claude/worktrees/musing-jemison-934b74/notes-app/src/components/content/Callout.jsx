const LABELS = { info: 'Info', pitfall: 'Pitfall', note: 'Production Note', caution: 'Caution', api: 'API Note' }
const MODS   = { info: 'co-i', pitfall: 'co-p', note: 'co-n', caution: 'co-c', api: 'co-a' }

export default function Callout({ type = 'info', label, children }) {
  return (
    <div className={`co ${MODS[type] || 'co-i'}`}>
      <span className="cl">{label || LABELS[type] || 'Info'}</span>
      {children}
    </div>
  )
}
