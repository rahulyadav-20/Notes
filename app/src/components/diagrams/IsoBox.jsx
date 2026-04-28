/**
 * IsoBox — isometric 3D box for architecture diagrams.
 * @param {number} x - SVG x position of top-left front corner
 * @param {number} y - SVG y position of top-left front corner
 * @param {number} w - Width of box face
 * @param {number} h - Height of box face
 * @param {number} depth - Isometric depth offset
 * @param {string} color - Base fill color (hex)
 * @param {string} [label] - Optional text label on box face
 */
export default function IsoBox({ x = 0, y = 0, w = 100, h = 60, depth = 20, color = '#4A90D9', label }) {
  const d = depth
  // Front face
  const front = `${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`
  // Top face (parallelogram offset upward)
  const top = `${x},${y} ${x+w},${y} ${x+w+d},${y-d} ${x+d},${y-d}`
  // Right face
  const right = `${x+w},${y} ${x+w+d},${y-d} ${x+w+d},${y+h-d} ${x+w},${y+h}`

  return (
    <g>
      <polygon points={top}   fill={`color-mix(in srgb, ${color} 70%, white)`} />
      <polygon points={right} fill={`color-mix(in srgb, ${color} 50%, #111)`} />
      <polygon points={front} fill={color} />
      {label && (
        <text x={x + w / 2} y={y + h / 2 + 5}
          textAnchor="middle" fill="#fff"
          fontSize="12" fontWeight="700">
          {label}
        </text>
      )}
    </g>
  )
}
