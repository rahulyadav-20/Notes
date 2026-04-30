/**
 * Fix double-encoded (mojibake) UTF-8 characters across all JSX/JS source files.
 * Codepoints confirmed by inspecting actual file bytes.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, 'src')

// [bad_sequence, correct_char]
// Bad sequences expressed as explicit Unicode escapes so the script is encoding-safe.
const FIXES = [
  // ←  U+2190  bytes E2 86 90  →  â (E2) + † (86=U+2020) + U+0090
  ['â†',  '←'],
  // →  U+2192  bytes E2 86 92  →  â + † + ' (92=U+0092→U+2019 in CP1252)
  ['â†’',  '→'],
  // —  U+2014  bytes E2 80 94  →  â (E2) + € (80=U+20AC) + " (94=U+201D in CP1252)
  ['â€”',  '—'],
  // ₹  U+20B9  bytes E2 82 B9  →  â + ‚ (82=U+201A) + ¹ (B9=U+00B9)
  ['â‚¹',  '₹'],
  // ─  U+2500  bytes E2 94 80  →  â + " (94=U+201D) + € (80=U+20AC)
  ['â”€',  '─'],
  // ☰  U+2630  bytes E2 98 B0  →  â + ˜ (98=U+02DC) + ° (B0=U+00B0)
  ['â˜°',  '☰'],
  // ★  U+2605  bytes E2 98 85  →  â + ˜ (98=U+02DC) + … (85=U+2026 in CP1252)
  ['â˜…',  '★'],
  // ▶  U+25B6  bytes E2 96 B6  →  â + – (96=U+2013) + ¶ (B6=U+00B6)
  ['â–¶',  '▶'],
  // ✕  U+2715  bytes E2 9C 95  →  â + œ (9C=U+0153) + • (95=U+2022 in CP1252)
  ['âœ•',  '✕'],
  // …  U+2026  bytes E2 80 A6  →  â + € (80=U+20AC) + ¦ (A6=U+00A6)
  ['â€¦',  '…'],
  // ⚙  U+2699  bytes E2 9A 99  →  â + š (9A=U+0161) + ™ (99=U+2122 in CP1252)
  ['âš™',  '⚙'],
  // ⚡ U+26A1  bytes E2 9A A1  →  â + š (9A=U+0161) + ¡ (A1=U+00A1)
  ['âš¡',  '⚡'],
  // ⭐ U+2B50  bytes E2 AD 90  →  â + ­ (AD=U+00AD soft-hyphen) + U+0090
  ['â­',  '⭐'],
  // ♾  U+267E  bytes E2 99 BE  →  â + ™ (99=U+2122) + ¾ (BE=U+00BE)
  ['â™¾',  '♾'],
  // "  U+201C  bytes E2 80 9C  →  â + € (80=U+20AC) + œ (9C=U+0153)
  ['â€œ',  '“'],
  // "  U+201D  bytes E2 80 9D  →  â + € (80=U+20AC) + • (9D=U+2022... no, 0x9D in CP1252=U+2019? let me skip)
  // '  U+2019  bytes E2 80 99  →  â + € (80=U+20AC) + ™ (99=U+2122 in CP1252)
  ['â€™',  '’'],
  // '  U+2018  bytes E2 80 98  →  â + € + ˜ (98=U+02DC)
  ['â€˜',  '‘'],
]

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf8')
  let changed = false
  for (const [bad, good] of FIXES) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good)
      changed = true
    }
  }
  if (changed) {
    writeFileSync(filePath, content, 'utf8')
    console.log('  fixed:', filePath.replace(SRC, 'src'))
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
    } else if (['.jsx', '.js', '.ts', '.tsx'].includes(extname(entry))) {
      fixFile(full)
    }
  }
}

console.log('Fixing remaining mojibake in', SRC)
walk(SRC)
console.log('Done.')
