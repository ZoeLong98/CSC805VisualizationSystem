import { useEffect } from 'react'

export function useChartResize(containerRef, draw, deps) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
