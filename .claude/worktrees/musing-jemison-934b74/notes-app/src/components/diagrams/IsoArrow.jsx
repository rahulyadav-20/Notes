import { isoProject } from './IsoBox'

export default function IsoArrow({
  from = [0, 0, 0],
  to   = [1, 0, 0],
  color = 'rgba(255,255,255,0.55)',
  tileW = 64, tileH = 32, tileD = 22,
  label,
  dashed = false,
}) {
  const [fx, fy, fz] = from
  const [tx, ty, tz] = to

  const p1 = isoProject(fx, fy, fz, tileW, tileH, tileD)
  const p2 = isoProject(tx, ty, tz, tileW, tileH, tileD)

  const mx = (p1.sx + p2.sx) / 2
  const my = (p1.sy + p2.sy) / 2

  const strokeProps = dashed
    ? { strokeDasharray: '5,4' }
    : {}

  return (
    <g>
      <defs>
        <marker
          id={`arr-${color.replace(/[^a-z0-9]/gi, '')}`}
          markerWidth="7" markerHeight="7"
          refX="6" refY="3.5"
          orient="auto"
        >
          <polygon points="0,0 7,3.5 0,7" fill={color} />
        </marker>
      </defs>
      <line
        x1={p1.sx} y1={p1.sy}
        x2={p2.sx} y2={p2.sy}
        stroke={color}
        strokeWidth="1.8"
        markerEnd={`url(#arr-${color.replace(/[^a-z0-9]/gi, '')})`}
        {...strokeProps}
      />
      {label && (
        <text
          x={mx} y={my - 6}
          textAnchor="middle"
          fill={color}
          fontSize="9"
          fontFamily="Segoe UI, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  )
}
