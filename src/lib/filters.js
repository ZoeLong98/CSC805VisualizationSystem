import { parseDate } from './dateUtils'

export function matchesFilters(data, filters) {
  if (!filters.severity.includes(data.severity)) return false

  if (filters.startDate || filters.endDate) {
    const d = parseDate(data.startTime)
    if (d) {
      if (filters.startDate && d < new Date(filters.startDate)) return false
      if (filters.endDate) {
        const end = new Date(filters.endDate)
        end.setHours(23, 59, 59, 999)
        if (d > end) return false
      }
    }
  }

  if (filters.weather.length > 0) {
    const wc = (data.weatherCondition || '').toLowerCase()
    const match = filters.weather.some((w) => wc.includes(w.toLowerCase()))
    if (!match) return false
  }

  return true
}

export function withinTimestampRange(record, range) {
  if (!range) return true
  const d = parseDate(record.startTime)
  if (!d) return true
  const ts = d.getTime()
  return ts >= range[0] && ts <= range[1]
}
