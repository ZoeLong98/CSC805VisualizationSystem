import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const SEVERITY_CONFIG = [
  { severity: 1, label: 'S1 Minor', color: '#22c55e' },
  { severity: 2, label: 'S2 Moderate', color: '#f59e0b' },
  { severity: 3, label: 'S3 Serious', color: '#ef4444' },
  { severity: 4, label: 'S4 Fatal', color: '#991b1b' },
]

export default function SeverityDistribution() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetch('/data/by_severity.json')
      .then((res) => res.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return

    const drawChart = () => {
      const container = containerRef.current
      const width = container.clientWidth
      const size = Math.min(width, 240)
      const radius = size / 2
      const innerRadius = radius * 0.55

      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()
      svg.attr('width', width).attr('height', size)

      const total = d3.sum(data, (d) => d.count)

      const colorMap = {}
      SEVERITY_CONFIG.forEach((c) => {
        colorMap[c.severity] = c.color
      })

      const pie = d3
        .pie()
        .value((d) => d.count)
        .sort(null)

      const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius - 4)

      const g = svg
        .append('g')
        .attr('transform', `translate(${width / 2},${size / 2})`)

      g.selectAll('path')
        .data(pie(data))
        .join('path')
        .attr('d', arc)
        .attr('fill', (d) => colorMap[d.data.severity])
        .attr('stroke', 'white')
        .attr('stroke-width', 2)

      // Center total label
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.2em')
        .attr('class', 'text-lg font-bold fill-gray-900')
        .text(total >= 1_000_000 ? (total / 1_000_000).toFixed(1) + 'M' : total >= 1_000 ? (total / 1_000).toFixed(0) + 'K' : total)

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .attr('class', 'text-xs fill-gray-400')
        .text('Total')
    }

    drawChart()

    const observer = new ResizeObserver(drawChart)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [data])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 w-56 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-48 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  if (!data) return null

  const total = d3.sum(data, (d) => d.count)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Severity Distribution
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Across all recorded accidents
        </p>
      </div>
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} />
      </div>
      <div className="mt-4 space-y-2">
        {SEVERITY_CONFIG.map((cfg) => {
          const item = data.find((d) => d.severity === cfg.severity)
          const pct = item ? ((item.count / total) * 100).toFixed(1) : '0.0'
          return (
            <div key={cfg.severity} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: cfg.color }}
                />
                <span className="text-gray-700">{cfg.label}</span>
              </div>
              <span className="text-gray-500 font-medium">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
