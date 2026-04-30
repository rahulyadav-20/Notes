import PartHeader from './PartHeader'
import Section    from './Section'
import SubSection from './SubSection'
import CodeBlock  from './CodeBlock'
import Callout    from './Callout'
import DataTable  from './DataTable'
import Divider    from './Divider'
import { DIAGRAM_REGISTRY } from '../diagrams/DiagramRegistry'

/* ── Inline markdown → JSX ─────────────────────────────────
   Supports: **bold**  *italic*  `code`
─────────────────────────────────────────────────────────── */
function Inline({ text = '' }) {
  const parts = []
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0, m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[2])      parts.push(<strong key={m.index}>{m[2]}</strong>)
    else if (m[3]) parts.push(<em key={m.index}>{m[3]}</em>)
    else if (m[4]) parts.push(<code key={m.index}>{m[4]}</code>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

function Sub3({ title, blocks, sectionIds, sectionCounter }) {
  return (
    <div className="sss">
      <h4>{title}</h4>
      <Blocks blocks={blocks} sectionIds={sectionIds} sectionCounter={sectionCounter} />
    </div>
  )
}

/* ── Single block renderer ─────────────────────────────── */
function Block({ block, sectionIds, sectionCounter }) {
  switch (block.type) {

    case 'ph':
      return <PartHeader label={block.label} title={block.title} subtitle={block.subtitle} />

    case 'section': {
      const id = sectionIds[sectionCounter.current++]
      return (
        <div className="sb" style={{ '--nc': 'var(--note-color, #4A90D9)' }}>
          <Section id={id} title={block.title}>
            <Blocks blocks={block.blocks} sectionIds={sectionIds} sectionCounter={sectionCounter} />
          </Section>
        </div>
      )
    }

    case 'ss':
      return (
        <SubSection title={block.title}>
          <Blocks blocks={block.blocks} sectionIds={sectionIds} sectionCounter={sectionCounter} />
        </SubSection>
      )

    case 's3':
      return <Sub3 title={block.title} blocks={block.blocks} sectionIds={sectionIds} sectionCounter={sectionCounter} />

    case 'p':
      return <p><Inline text={block.md} /></p>

    case 'ul':
      return (
        <ul>
          {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
        </ul>
      )

    case 'ol':
      return (
        <ol>
          {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
        </ol>
      )

    case 'callout':
      return (
        <Callout variant={block.variant} label={block.label}>
          {block.md && <p><Inline text={block.md} /></p>}
          {block.items?.length > 0 && (
            <ul>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</ul>
          )}
        </Callout>
      )

    case 'code':
      return <CodeBlock description={block.desc} language={block.lang} code={block.code} />

    case 'table':
      return <DataTable headers={block.headers} rows={block.rows} />

    case 'divider':
      return <Divider />

    case 'diagram': {
      const DiagramComponent = DIAGRAM_REGISTRY[block.name]
      if (!DiagramComponent) return null
      return <DiagramComponent />
    }

    // Raw inline SVG stored as a string in the DB
    case 'rawsvg':
      return (
        <div className="dc"
          dangerouslySetInnerHTML={{ __html: block.svg }} />
      )

    default:
      return null
  }
}

function Blocks({ blocks = [], sectionIds, sectionCounter }) {
  return (
    <>{blocks.map((b, i) => (
      <Block key={i} block={b} sectionIds={sectionIds} sectionCounter={sectionCounter} />
    ))}</>
  )
}

/* ── Main export ───────────────────────────────────────── */
export default function NoteRenderer({ blocks = [], sectionIds = [] }) {
  // Use a plain object as a mutable counter passed by reference through the tree
  const sectionCounter = { current: 0 }
  return (
    <div className="gc">
      <Blocks blocks={blocks} sectionIds={sectionIds} sectionCounter={sectionCounter} />
    </div>
  )
}
