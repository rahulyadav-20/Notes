import { useState } from 'react'

export default function CodeBlock({ label, lang, children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = typeof children === 'string'
      ? children
      : children?.props?.children ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="cbw cbw-wrapper">
      <div className="cbh">
        <span>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {lang && <span className="lb">{lang}</span>}
          <button
            className={`cb-copy-btn${copied ? ' copied' : ''}`}
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="cb">{children}</pre>
    </div>
  )
}

/* Syntax highlight span helpers — use inside CodeBlock children */
export const Kw = ({ c }) => <span className="kw">{c}</span>
export const Sr = ({ c }) => <span className="sr">{c}</span>
export const Nm = ({ c }) => <span className="nm">{c}</span>
export const Fn = ({ c }) => <span className="fn">{c}</span>
export const Cm = ({ c }) => <span className="cm">{c}</span>
