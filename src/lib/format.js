export function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return n.toString()
}

export function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return n.toString()
}

export function formatHour(h) {
  if (h === 0) return '12:00 AM'
  if (h === 12) return '12:00 PM'
  return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`
}

export function formatSliderDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function toDateInputValue(ts) {
  return new Date(ts).toISOString().slice(0, 10)
}
