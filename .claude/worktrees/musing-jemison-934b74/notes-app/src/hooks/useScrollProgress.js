import { useState, useEffect, useRef } from 'react'

export function useScrollProgress(headingSelector = 'h2.st') {
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState('')
  const headingsRef = useRef([])

  useEffect(() => {
    headingsRef.current = Array.from(document.querySelectorAll(headingSelector))

    const onScroll = () => {
      const scrollY = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docH > 0 ? Math.min(100, (scrollY / docH) * 100) : 0)

      let current = ''
      headingsRef.current.forEach(h => {
        if (scrollY >= h.offsetTop - 140) current = h.id
      })
      setActiveId(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [headingSelector])

  return { progress, activeId }
}
