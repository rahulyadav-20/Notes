/**
 * Sidebar — sticky note navigation.
 * Used by NotePage. Shows part list with active highlight.
 * Props: parts (string[]), activePart (number), onSelect (fn), noteColor (string), noteName (string), noteIcon (string)
 */
export default function Sidebar({ parts, activePart, onSelect, noteColor, noteName, noteIcon }) {
  // stub — renders a vertical list of part buttons
  return (
    <aside className="sidebar-accent hidden lg:flex lg:flex-col lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:overflow-y-auto">
      <div className="flex items-center gap-3 px-5 pb-5 border-b border-line mb-3 shrink-0 pt-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `color-mix(in srgb, ${noteColor} 12%, #f5f7ff)` }}>
          {noteIcon}
        </div>
        <div>
          <div className="text-[0.88rem] font-extrabold text-navy">{noteName}</div>
          <div className="text-[0.7rem] text-muted mt-0.5">{parts.length} parts</div>
        </div>
      </div>
      <nav className="flex flex-col px-3 pb-6">
        {parts.map((title, i) => (
          <button key={i}
            className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-colors
              ${activePart === i ? 'sidebar-part-active' : 'hover:bg-base2'}`}
            style={{ '--nc': noteColor }}
            onClick={() => onSelect(i)}>
            <span className={`w-[22px] h-[22px] rounded-md shrink-0 flex items-center justify-center text-[0.68rem] font-bold mt-0.5
              ${activePart === i ? 'part-num' : 'bg-base2 text-muted'}`}>
              {i + 1}
            </span>
            <span className="flex flex-col flex-1 min-w-0">
              <span className="text-[0.62rem] text-muted font-semibold uppercase tracking-[0.5px]">Part {i + 1}</span>
              <span className={`text-[0.78rem] font-bold leading-snug mt-0.5 part-title ${activePart === i ? '' : 'text-navy'}`}>{title}</span>
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
