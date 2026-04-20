import { parseDate } from './dateUtils'
import { toDateInputValue } from './format'

export function computeDateRange(records) {
  let min = Infinity
  let max = -Infinity
  for (const r of records) {
    const d = parseDate(r.startTime)
    if (!d) continue
    const ts = d.getTime()
    if (ts < min) min = ts
    if (ts > max) max = ts
  }
  return min < Infinity && max > -Infinity ? { min, max } : null
}

export function syncFiltersWithRange(filters, range) {
  return {
    ...filters,
    startDate: toDateInputValue(range.min),
    endDate: toDateInputValue(range.max),
  }
}

export function clampRange(range, bounds) {
  const clamp = (v) => Math.max(bounds.min, Math.min(v, bounds.max))
  const start = clamp(range[0])
  const end = clamp(range[1])
  return [Math.min(start, end), Math.max(start, end)]
}
