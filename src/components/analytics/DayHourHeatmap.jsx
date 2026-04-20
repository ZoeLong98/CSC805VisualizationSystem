import { useRef } from 'react'
import * as d3 from 'd3'

import ChartCard from '../common/ChartCard'
import SkeletonCard from '../common/SkeletonCard'
import { useJsonData } from '../../hooks/useJsonData'
import { useChartResize } from '../../hooks/useChartResize'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return '12a'
  if (i < 12) return `${i}a`
  if (i === 12) return '12p'
  return `${i - 12}p`
})

export default function DayHourHeatmap() {
  const { data, loading } = useJsonData('/data/by_day_hour.json')
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useChartResize(containerRef, () => {
    if (!data || !svgRef.current) return
    drawHeatmap(svgRef.current, containerRef.current, data)
  }, [data])

  if (loading) return <SkeletonCard bodyHeight="h-48" />
  if (!data) return null

  return (
    <ChartCard
      title="Accident Heatmap by Day & Hour"
      subtitle="Intensity shows accident density — darker = more accidents"
    >
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} />
      </div>
    </ChartCard>
  )
}

function drawHeatmap(svgEl, containerEl, data) {
  const width = containerEl.clientWidth
  const margin = { top: 10, right: 20, bottom: 40, left: 44 }
  const innerW = width - margin.left - margin.right
  const cellW = innerW / 24
  const cellH = Math.max(cellW * 0.8, 20)
  const innerH = cellH * 7
  const height = innerH + margin.top + margin.bottom

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('width', width).attr('height', height)

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const allCounts = data.flatMap((d) => d.hours)
  const maxCount = d3.max(allCounts)
  const minCount = d3.min(allCounts)

  const colorScale = d3
    .scaleSequential()
    .domain([minCount, maxCount])
    .interpolator(d3.interpolateYlOrRd)

  drawCells(g, data, colorScale, cellW, cellH)
  drawDayLabels(g, cellH)
  drawHourLabels(g, cellW, innerH)
  drawLegend(svg, g, colorScale, innerW, innerH, minCount, maxCount)
}

function drawCells(g, data, colorScale, cellW, cellH) {
  data.forEach((dayData, dayIdx) => {
    dayData.hours.forEach((count, hourIdx) => {
      g.append('rect')
        .attr('x', hourIdx * cellW)
        .attr('y', dayIdx * cellH)
        .attr('width', cellW - 1)
        .attr('height', cellH - 1)
        .attr('fill', colorScale(count))
        .attr('rx', 2)
    })
  })
}

function drawDayLabels(g, cellH) {
  DAYS.forEach((day, i) => {
    g.append('text')
      .attr('x', -6)
      .attr('y', i * cellH + cellH / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('class', 'text-[10px] fill-gray-500')
      .text(day)
  })
}

function drawHourLabels(g, cellW, innerH) {
  HOURS.forEach((label, i) => {
    if (i % 2 !== 0) return
    g.append('text')
      .attr('x', i * cellW + cellW / 2)
      .attr('y', innerH + 16)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-[10px] fill-gray-500')
      .text(label)
  })
}

function drawLegend(svg, g, colorScale, innerW, innerH, minCount, maxCount) {
  const legendW = Math.min(200, innerW * 0.4)
  const legendH = 8
  const legendX = (innerW - legendW) / 2
  const legendY = innerH + 28

  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'heatmap-gradient')
  gradient.append('stop').attr('offset', '0%').attr('stop-color', colorScale(minCount))
  gradient.append('stop').attr('offset', '100%').attr('stop-color', colorScale(maxCount))

  g.append('rect')
    .attr('x', legendX)
    .attr('y', legendY)
    .attr('width', legendW)
    .attr('height', legendH)
    .attr('rx', 4)
    .attr('fill', 'url(#heatmap-gradient)')

  g.append('text')
    .attr('x', legendX - 4)
    .attr('y', legendY + legendH / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .attr('class', 'text-[10px] fill-gray-400')
    .text('Less')

  g.append('text')
    .attr('x', legendX + legendW + 4)
    .attr('y', legendY + legendH / 2)
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('class', 'text-[10px] fill-gray-400')
    .text('More')
}
