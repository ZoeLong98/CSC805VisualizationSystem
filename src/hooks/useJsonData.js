import { useState, useEffect } from 'react'

export function useJsonData(url, transform) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then((res) => res.json())
      .then((d) => {
        if (cancelled) return
        setData(transform ? transform(d) : d)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [url])

  return { data, loading }
}
