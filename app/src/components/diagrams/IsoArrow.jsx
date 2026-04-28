/**
 * IsoArrow — dashed SVG arrow connecting diagram elements.
 * @param {number} x1 - Start x
 * @param {number} y1 - Start y
 * @param {number} x2 - End x
 * @param {number} y2 - End y
 * @param {string} [color] - Stroke color
 * @param {boolean} [dashed] - Use dashed stroke
 * @param {string} [label] - Optional midpoint label
 */
export default function IsoArrow({ x1, y1, x2, y2, color = '#c8cde8', dashed = true, label }) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth="1.5"
        strokeDasharray={dashed ? '5,4' : undefined}
        markerEnd="url(#arrow-head)" />
      {label && (
        <text x={mx} y={my - 6} textAnchor="middle"
          fill={color} fontSize="10" fontWeight="600">
          {label}
        </text>
      )}
    </g>
  )
}
