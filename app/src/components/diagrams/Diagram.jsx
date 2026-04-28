/**
 * Diagram — SVG diagram container.
 * @param {string} viewBox - SVG viewBox e.g. "0 0 800 400"
 * @param {React.ReactNode} children - SVG child elements
 * @param {string} [className] - Additional CSS classes
 */
export default function Diagram({ viewBox = '0 0 800 400', children, className = '' }) {
  return (
    <div className={`dc ${className}`}>
      <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, sans-serif">
        {children}
      </svg>
    </div>
  )
}
