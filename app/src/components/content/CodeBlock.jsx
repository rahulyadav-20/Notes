/**
 * CodeBlock — syntax-highlighted code block.
 * @param {string} description - Header description label
 * @param {string} language - Language label e.g. "Python", "Bash"
 * @param {string} code - Raw code string (use dangerouslySetInnerHTML for pre-highlighted HTML)
 * @param {React.ReactNode} children - Alternative: pass pre-highlighted JSX spans as children
 */
export default function CodeBlock({ description, language, code, children }) {
  return (
    <div className="cbw">
      <div className="cbh">
        <span>{description}</span>
        {language && <span className="lb">{language}</span>}
      </div>
      <pre className="cb">
        {children || code}
      </pre>
    </div>
  )
}
