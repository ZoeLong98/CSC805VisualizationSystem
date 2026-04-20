import InfoTooltip from '../common/InfoTooltip'
import { formatSliderDate } from '../../lib/format'

export default function TimelineSlider({ dateRange, sliderRange, onRangeChange }) {
  if (!dateRange || !sliderRange) return null

  const { min, max } = dateRange
  const [start, end] = sliderRange

  const handleStartChange = (e) => {
    const val = Number(e.target.value)
    onRangeChange([Math.min(val, end), end])
  }

  const handleEndChange = (e) => {
    const val = Number(e.target.value)
    onRangeChange([start, Math.max(val, start)])
  }

  const leftPct = ((start - min) / (max - min)) * 100
  const rightPct = ((end - min) / (max - min)) * 100

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000]" style={{ pointerEvents: 'none' }}>
      <div
        className="bg-white/95 backdrop-blur shadow-lg border-t border-gray-200 px-6 py-3"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap flex items-center">
            Timeline
            <InfoTooltip text="Drag the handles to select a time window. This syncs with the Date Range filter in the sidebar." />
          </span>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
              <span>{formatSliderDate(start)}</span>
              <span>{formatSliderDate(end)}</span>
            </div>
            <div className="relative h-6">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full" />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-blue-500 rounded-full"
                style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
              />
              <input
                type="range"
                min={min}
                max={max}
                value={start}
                onChange={handleStartChange}
                className="timeline-range-input absolute inset-0 w-full"
                style={{ zIndex: start > min + (max - min) * 0.9 ? 4 : 3 }}
              />
              <input
                type="range"
                min={min}
                max={max}
                value={end}
                onChange={handleEndChange}
                className="timeline-range-input absolute inset-0 w-full"
                style={{ zIndex: 3 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>{formatSliderDate(min)}</span>
              <span>{formatSliderDate(max)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
