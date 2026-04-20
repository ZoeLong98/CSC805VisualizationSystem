import InfoTooltip from '../common/InfoTooltip'
import { toDateInputValue } from '../../lib/format'

export default function DateRangeFilter({ filters, dateRange, onInput }) {
  const minAttr = dateRange ? toDateInputValue(dateRange.min) : ''
  const maxAttr = dateRange ? toDateInputValue(dateRange.max) : ''

  return (
    <div className="mb-5">
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Date Range</h3>
        <InfoTooltip text="Set start and end dates to filter accidents. This syncs with the timeline slider at the bottom of the map." />
      </div>
      <div className="space-y-2">
        <DateInput
          label="Start Date"
          value={filters.startDate}
          min={minAttr}
          max={filters.endDate || maxAttr}
          onChange={(v) => onInput({ startDate: v })}
        />
        <DateInput
          label="End Date"
          value={filters.endDate}
          min={filters.startDate || minAttr}
          max={maxAttr}
          onChange={(v) => onInput({ endDate: v })}
        />
      </div>
    </div>
  )
}

function DateInput({ label, value, min, max, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}
