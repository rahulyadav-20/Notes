# Base Note Generation Prompt

**How to use:**
1. Copy everything between the `--- START ---` and `--- END ---` markers below
2. Paste it into Claude
3. Then paste your Topic Block (from `prompts/topics/`) directly after it
4. Send — Claude generates a complete `.jsx` note file

---

--- START ---

You are generating a complete React JSX engineering deep-dive note for a learning platform.

## Available Components

Import exactly as shown — never write raw HTML, CSS classes, or inline styles:

```js
import PageLayout             from '../../components/layout/PageLayout'
import Cover                  from '../../components/content/Cover'
import PartHeader             from '../../components/content/PartHeader'
import Section                from '../../components/content/Section'
import SubSection             from '../../components/content/SubSection'
import { SubSubSection }      from '../../components/content/SubSection'
import CodeBlock              from '../../components/content/CodeBlock'
import Callout                from '../../components/content/Callout'
import DataTable              from '../../components/content/DataTable'
import Divider                from '../../components/content/Divider'
import Diagram                from '../../components/diagrams/Diagram'
import IsoBox                 from '../../components/diagrams/IsoBox'
import IsoArrow               from '../../components/diagrams/IsoArrow'
```

## File Output Format

```jsx
// Single .jsx file, default export
// Sidebar config defined as const inside the file
// Everything wrapped in <PageLayout sidebar={sidebar} color="PRIMARY_HEX">

const sidebar = {
  brand: 'Topic Name',
  title: 'Deep-Dive Guide',
  iconLetter: 'X',
  gradStart: '#HEX1',
  gradEnd: '#HEX2',
  parts: [
    {
      label: 'Part I — Title',
      sections: [
        { id: 's1', num: 1, title: 'Section Title' },
        { id: 's2', num: 2, title: 'Section Title' },
      ]
    }
  ]
}

export default function TopicName() {
  return (
    <PageLayout sidebar={sidebar} color="#PRIMARY_HEX">
      <Cover ... />
      <div className="gc">
        <PartHeader ... />
        <Section title="1 — ..."> ... </Section>
        <Divider />
      </div>
    </PageLayout>
  )
}
```

## Depth Requirements

- **Minimum 15 Parts**, each with 3–8 Sections
- **Each Section** has 3–6 SubSections numbered X.Y
- **Key SubSections** have SubSubSections numbered X.Y.Z
- **Target length:** 150–400 pages depending on topic complexity
- **Cover every level:**
  - BASIC — what it is, real-world analogy, "In simple terms: ..."
  - INTERMEDIATE — internals, configuration, common patterns
  - ADVANCED — tuning numbers, failure modes, production war stories

## Writing Style (follow exactly)

- **Hook first:** open every Section with one sentence stating the problem it solves
- **Define before use:** every term explained in plain English the first time it appears
- **Simple terms:** after every new concept → *"In simple terms: [one sentence a fresher understands]"*
- **Analogy first:** give a real-world analogy BEFORE the technical definition
- **Wrong → Right:** show the wrong approach → explain why it fails → show the correct approach
- **Exact numbers:** "reduces latency by ~40%", "set heap to 2× segment cache", "P99 under 200ms"
- **Commented code:** every single line of code has a comment explaining what it does
- **Key Takeaways:** end every Section with 3–5 bullet takeaways in a `<Callout type="note">`

## Callout Usage

```jsx
<Callout type="info"    label="Engineering Insight"> deep technical insight </Callout>
<Callout type="pitfall" label="Common Pitfall">       mistake to avoid       </Callout>
<Callout type="note"    label="Production Note">      real-world tip         </Callout>
<Callout type="caution" label="Caution">              warning                </Callout>
```

## CodeBlock Usage

```jsx
<CodeBlock label="Descriptive title" lang="Java">
{`// Every line has a comment explaining what it does
public void example() {
    // Initialize the consumer with bootstrap servers
    KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
}`}
</CodeBlock>
```

## 3D Isometric Diagram Rules

- **Architecture diagrams** → use `IsoBox` + `IsoArrow` (true 3D isometric)
- **Flow / lifecycle diagrams** → flat SVG inside `<Diagram>` wrapper (circles, arrows, swimlanes)
- Every `IsoBox` must have: `tileW={64} tileH={32} tileD={22} glowId="iso-glow"`
- Color by role: source = `#4A90D9` blue · processor = `#E6522C` orange · sink = `#2ECC71` green · store = `#7C3AED` purple
- Every box and arrow must have a visible text label
- Calculate `viewBox` to fit all boxes before writing — add padding of ~40px each side

```jsx
// Architecture example
<Diagram title="System Architecture" viewBox="0 0 800 420" caption="Data flow overview">
  <IsoBox x={0} y={1} z={0} w={1} h={1} d={1}
    color="#4A90D9" label="Producer" sublabel="sends events"
    tileW={64} tileH={32} tileD={22} glowId="iso-glow" />
  <IsoArrow
    from={[1, 1, 0.5]} to={[3, 1, 0.5]}
    color="rgba(255,255,255,0.55)" label="events"
    tileW={64} tileH={32} tileD={22} />
  <IsoBox x={3} y={1} z={0} w={1} h={1} d={1}
    color="#E6522C" label="Broker" sublabel="stores & routes"
    tileW={64} tileH={32} tileD={22} glowId="iso-glow" />
</Diagram>
```

## Minimum Diagrams Per Note (spread across parts)

| # | Diagram | Type |
|---|---|---|
| 1 | System architecture — all major components | 3D IsoBox |
| 2 | Data flow / lifecycle — numbered steps | Flat SVG swimlane |
| 3 | Internals — what happens inside one component | 3D IsoBox |
| 4 | Comparison — side-by-side options or benchmark | Flat SVG bars |
| 5 | Failure & recovery — state machine or decision tree | Flat SVG |
| 6 | Ecosystem map — topic as center, integrations around it | 3D IsoBox |

## DataTable Usage

```jsx
<DataTable
  headers={['Parameter', 'Default', 'Recommended', 'Why']}
  rows={[
    ['batch.size',       '16 KB',  '64–256 KB', 'Higher throughput'],
    ['linger.ms',        '0',      '5–20 ms',   'Allows batching'],
    ['compression.type', 'none',   'lz4',        'Best speed/ratio'],
  ]}
/>
```

--- END ---

---

## Topic Blocks

Individual topic files are in `prompts/topics/`.
Paste the contents of the relevant file after the base prompt above.

| File | Topic |
|---|---|
| `topics/flink.md` | Apache Flink |
| `topics/druid.md` | Apache Druid |
| `topics/kafka.md` | Apache Kafka |
| `topics/spark.md` | Apache Spark |
| `topics/gcp.md` | GCP Data Engineering |
| `topics/machine_learning.md` | Machine Learning |
| `topics/langchain.md` | LangChain |
| `topics/react.md` | React.js |
| `topics/javascript.md` | JavaScript Deep Dive |
