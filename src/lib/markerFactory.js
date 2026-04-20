import L from 'leaflet'
import { SEVERITY_COLORS } from './constants'

export function createCircleIcon(severity) {
  const color = SEVERITY_COLORS[severity] || '#6b7280'
  return L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

function clusterStyle(count) {
  if (count < 10) return { size: 30, bg: '#d2b48c' }
  if (count < 50) return { size: 36, bg: '#b8860b' }
  if (count < 100) return { size: 42, bg: '#a0522d' }
  if (count < 500) return { size: 48, bg: '#8b4513' }
  return { size: 54, bg: '#5c2d0e' }
}

function clusterLabel(count) {
  return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : String(count)
}

export function createClusterIcon(cluster) {
  const count = cluster.getChildCount()
  const { size, bg } = clusterStyle(count)
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${bg};
      display:flex;align-items:center;justify-content:center;
      color:white;font-size:${size < 36 ? 11 : 13}px;font-weight:600;
      border:1px solid rgba(255,255,255,0.4);
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    ">${clusterLabel(count)}</div>`,
    className: '',
    iconSize: L.point(size, size),
  })
}
