import { useRef } from 'react'
import * as d3 from 'd3'

import ChartCard from '../common/ChartCard'
import SkeletonCard from '../common/SkeletonCard'
import { useJsonData } from '../../hooks/useJsonData'
import { useChartResize } from '../../hooks/useChartResize'
import { formatCount } from '../../lib/format'

const SEVERITY_CONFIG = [
  { severity: 1, label: 'S1 Minor', color: '#22c55e' },
  { severity: 2, label: 'S2 Moderate', color: '#f59e0b' },
  { severity: 3, label: 'S3 Serious', color: '#ef4444' },
  { severity: 4, label: 'S4 Fatal', color: '#991b1b' },
]

const COLOR_MAP = SEVERITY_CONFIG.reduce((acc, c) => ({ ...acc, [c.severity]: c.color }), {})

export default function SeverityDistribution() {
  const { data, loading } = useJsonData('/data/by_severity.json')
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useChartResize(containerRef, () => {
    if (!data || !svgRef.current) return
    drawDonut(svgRef.current, containerRef.current, data)
  }, [data])

  if (loading) return <SkeletonCard bodyHeight="h-48" />
  if (!data) return null

  const total = d3.sum(data, (d) => d.count)

  return (
    <ChartCard
      title="Severity Distribution"
      subtitle="Across all recorded accidents"
    >
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} />
      </div>
      <Legend data={data} total={total} />
    </ChartCard>
  )
}

function Legend({ data, total }) {
  return (
    <div className="mt-4 space-y-2">
      {SEVERITY_CONFIG.map((cfg) => {
        const item = data.find((d) => d.severity === cfg.severity)
        const pct = item ? ((item.count / total) * 100).toFixed(1) : '0.0'
        return (
          <div key={cfg.severity} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: cfg.color }} />
              <span className="text-gray-700">{cfg.label}</span>
            </div>
            <span className="text-gray-500 font-medium">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

function drawDonut(svgEl, containerEl, data) {
  const width = containerEl.clientWidth
  const size = Math.min(width, 240)
  const radius = size / 2
  const innerRadius = radius * 0.55

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('width', width).attr('height', size)

  const total = d3.sum(data, (d) => d.count)

  const pie = d3.pie().value((d) => d.count).sort(null)
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius - 4)

  const g = svg.append('g').attr('transform', `translate(${width / 2},${size / 2})`)

  g.selectAll('path')
    .data(pie(data))
    .join('path')
    .attr('d', arc)
    .attr('fill', (d) => COLOR_MAP[d.data.severity])
    .attr('stroke', 'white')
    .attr('stroke-width', 2)

  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '-0.2em')
    .attr('class', 'text-lg font-bold fill-gray-900')
    .text(formatCount(total))

  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.2em')
    .attr('class', 'text-xs fill-gray-400')
    .text('Total')
}
