import { useState, useEffect } from 'react'
import { explorerCache } from '../components/explorer/explorerCache'

export function useAccidentRecords() {
  const [records, setRecords] = useState(explorerCache.records)
  const [progress, setProgress] = useState(
    explorerCache.records
      ? { loaded: explorerCache.records.length, total: explorerCache.records.length }
      : { loaded: 0, total: 0 }
  )
  const [loading, setLoading] = useState(!explorerCache.records)

  useEffect(() => {
    if (explorerCache.records) return

    let cancelled = false

    async function load() {
      try {
        const manifest = await fetch('/data/map/manifest.json').then((r) => r.json())
        if (cancelled) return
        setProgress({ loaded: 0, total: manifest.totalRecords })

        const all = []
        for (const chunkFile of manifest.chunks) {
          const chunk = await fetch(`/data/map/${chunkFile}`).then((r) => r.json())
          if (cancelled) return
          all.push(...chunk)
          setProgress({ loaded: all.length, total: manifest.totalRecords })
        }

        explorerCache.records = all
        setRecords(all)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load map data:', err)
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { records, progress, loading }
}
