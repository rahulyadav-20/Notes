/**
 * DataTable — styled table component.
 * @param {string[]} headers - Array of column header strings
 * @param {string[][]} rows - 2D array of cell values
 */
export default function DataTable({ headers = [], rows = [] }) {
  return (
    <table className="tb">
      {headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
