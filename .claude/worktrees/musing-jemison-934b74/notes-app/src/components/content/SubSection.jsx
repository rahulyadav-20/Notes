export default function SubSection({ title, children }) {
  return (
    <>
      <h3 className="ss">{title}</h3>
      {children}
    </>
  )
}

export function SubSubSection({ title, children }) {
  return (
    <>
      <h4 className="sss">{title}</h4>
      {children}
    </>
  )
}
