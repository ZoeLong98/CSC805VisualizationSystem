import { useRef } from 'react'
import * as d3 from 'd3'

import ChartCard from '../common/ChartCard'
import SkeletonCard from '../common/SkeletonCard'
import { useJsonData } from '../../hooks/useJsonData'
import { useChartResize } from '../../hooks/useChartResize'
import { formatCount } from '../../lib/format'

export default function AccidentsOverTime() {
  const { data, loading } = useJsonData('/data/by_month.json')
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useChartResize(containerRef, () => {
    if (!data || !svgRef.current) return
    drawChart(svgRef.current, containerRef.current, data)
  }, [data])

  if (loading) return <SkeletonCard />
  if (!data) return null

  const peak = findPeak(data)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <ChartCard
      title="Monthly Accident Trend"
      subtitle={`2022 monthly distribution — ${formatCount(total)} total`}
      badge={peak && <PeakBadge month={peak.month} />}
    >
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} />
      </div>
    </ChartCard>
  )
}

function PeakBadge({ month }) {
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">
      Peak: {month}
    </span>
  )
}

function findPeak(data) {
  return data.reduce((max, d) => (d.count > max.count ? d : max), data[0])
}

function drawChart(svgEl, containerEl, data) {
  const width = containerEl.clientWidth
  const height = 300
  const margin = { top: 20, right: 20, bottom: 40, left: 55 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('width', width).attr('height', height)

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand().domain(data.map((d) => d.month)).range([0, innerW]).padding(0.25)
  const xPoint = d3
    .scalePoint()
    .domain(data.map((d) => d.month))
    .range([x.bandwidth() / 2, innerW - x.bandwidth() / 2])

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count) * 1.15])
    .nice()
    .range([innerH, 0])

  drawGridlines(g, y, innerW)
  drawAxes(g, x, y, innerH)

  const peak = findPeak(data)

  g.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(d.month))
    .attr('y', (d) => y(d.count))
    .attr('width', x.bandwidth())
    .attr('height', (d) => innerH - y(d.count))
    .attr('fill', (d) => (d.month === peak.month ? '#3b82f6' : '#bfdbfe'))
    .attr('rx', 3)

  const line = d3
    .line()
    .x((d) => xPoint(d.month))
    .y((d) => y(d.count))
    .curve(d3.curveMonotoneX)

  g.append('path')
    .datum(data)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#1d4ed8')
    .attr('stroke-width', 2)

  g.selectAll('.dot')
    .data(data)
    .join('circle')
    .attr('cx', (d) => xPoint(d.month))
    .attr('cy', (d) => y(d.count))
    .attr('r', (d) => (d.month === peak.month ? 5 : 3))
    .attr('fill', (d) => (d.month === peak.month ? '#1d4ed8' : '#fff'))
    .attr('stroke', '#1d4ed8')
    .attr('stroke-width', 1.5)
}

function drawGridlines(g, y, innerW) {
  g.append('g')
    .selectAll('line')
    .data(y.ticks(5))
    .join('line')
    .attr('x1', 0)
    .attr('x2', innerW)
    .attr('y1', (d) => y(d))
    .attr('y2', (d) => y(d))
    .attr('stroke', '#f3f4f6')
}

function drawAxes(g, x, y, innerH) {
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('class', 'text-xs fill-gray-500')

  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat((d) => formatCount(d)))
    .selectAll('text')
    .attr('class', 'text-xs fill-gray-500')

  g.selectAll('.domain').remove()
  g.selectAll('.tick line').attr('stroke', '#e5e7eb')
}
