/**
 * Cover — full-screen note cover page.
 * @param {string} title - Main note title
 * @param {string} subtitle - Subtitle line
 * @param {string} tagline - Description paragraph
 * @param {string} color - Brand color (hex)
 * @param {string} icon - Emoji or character icon
 * @param {number} parts - Total number of parts
 * @param {number} sections - Total number of sections
 * @param {string} level - Difficulty level e.g. "Intermediate"
 */
export default function Cover({ title, subtitle, tagline, color, icon, parts, sections, level }) {
  return (
    <div className="cover">
      <div className="gc">
        <div className="cover-badge">Production Engineering Reference</div>
        <h1>{title}</h1>
        {subtitle && <div className="cover-sub">{subtitle}</div>}
        {tagline && <p className="cover-tagline">{tagline}</p>}
        <div className="cover-meta">
          {parts   && <div className="cover-meta-item"><span className="num">{parts}</span><span className="lbl">Parts</span></div>}
          {sections && <div className="cover-meta-item"><span className="num">{sections}</span><span className="lbl">Sections</span></div>}
          {level   && <div className="cover-meta-item"><span className="num">{level}</span><span className="lbl">Level</span></div>}
        </div>
      </div>
    </div>
  )
}
