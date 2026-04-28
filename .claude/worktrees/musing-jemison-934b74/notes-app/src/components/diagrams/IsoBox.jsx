import { useState } from 'react'
import { motion } from 'framer-motion'

/* Isometric projection: 3D (x,y,z) → 2D screen coords */
export function isoProject(x, y, z, tileW = 64, tileH = 32, tileD = 22) {
  return {
    sx: (x - y) * tileW,
    sy: (x + y) * tileH - z * tileD,
  }
}

/* Lighten / darken a hex color by a ratio */
function adjustColor(hex, factor) {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, Math.round(((n >> 16) & 0xff) * factor)))
  const g = Math.min(255, Math.max(0, Math.round(((n >> 8) & 0xff) * factor)))
  const b = Math.min(255, Math.max(0, Math.round((n & 0xff) * factor)))
  return `rgb(${r},${g},${b})`
}

/*
  IsoBox renders a 3D isometric box at grid position (x, y, z).
  w, h, d = width, height (depth into screen), stackHeight in grid units.
  tileW/H/D = pixel scale per grid unit (passed from parent Diagram).
*/
export default function IsoBox({
  x = 0, y = 0, z = 0,
  w = 1, h = 1, d = 1,
  color = '#4A90D9',
  label,
  sublabel,
  tileW = 64, tileH = 32, tileD = 22,
  glowId,
}) {
  const [hovered, setHovered] = useState(false)

  const top   = adjustColor(color, 1.25)
  const left  = adjustColor(color, 0.75)
  const right = adjustColor(color, 0.55)

  // Corner points of the box in 3D
  const proj = (px, py, pz) => isoProject(px, py, pz, tileW, tileH, tileD)

  const p000 = proj(x,     y,     z)
  const p100 = proj(x + w, y,     z)
  const p010 = proj(x,     y + h, z)
  const p110 = proj(x + w, y + h, z)
  const p001 = proj(x,     y,     z + d)
  const p101 = proj(x + w, y,     z + d)
  const p011 = proj(x,     y + h, z + d)
  const p111 = proj(x + w, y + h, z + d)

  const pts = (corners) => corners.map(c => `${c.sx},${c.sy}`).join(' ')

  // Top face
  const topPoly    = pts([p001, p101, p111, p011])
  // Left face (front-left)
  const leftPoly   = pts([p000, p001, p011, p010])
  // Right face (front-right)
  const rightPoly  = pts([p100, p101, p111, p110])

  // Label anchor = center of top face
  const lx = (p001.sx + p101.sx + p111.sx + p011.sx) / 4
  const ly = (p001.sy + p101.sy + p111.sy + p011.sy) / 4

  const glowFilter = hovered && glowId ? `url(#${glowId})` : undefined

  return (
    <motion.g
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ cursor: 'default' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'backOut' }}
      filter={glowFilter}
    >
      {/* Top face */}
      <polygon points={topPoly}   fill={top}   stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
      {/* Left face */}
      <polygon points={leftPoly}  fill={left}  stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
      {/* Right face */}
      <polygon points={rightPoly} fill={right} stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />

      {/* Label */}
      {label && (
        <text
          x={lx}
          y={ly + 5}
          textAnchor="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="700"
          fontFamily="Segoe UI, sans-serif"
          style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          {label}
        </text>
      )}
      {sublabel && (
        <text
          x={lx}
          y={ly + 18}
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize="8.5"
          fontFamily="Segoe UI, sans-serif"
          style={{ pointerEvents: 'none' }}
        >
          {sublabel}
        </text>
      )}
    </motion.g>
  )
}
