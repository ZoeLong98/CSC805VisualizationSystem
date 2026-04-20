import DateRangeFilter from './DateRangeFilter'
import SeverityFilter from './SeverityFilter'
import WeatherFilter from './WeatherFilter'
import { SEVERITY_LEVELS } from '../../lib/constants'
import { toDateInputValue } from '../../lib/format'

export default function FilterSidebar({
  filters,
  onFilterChange,
  collapsed,
  onToggle,
  dateRange,
  onDateRangeInput,
}) {
  const handleReset = () => {
    const resetStartDate = dateRange ? toDateInputValue(dateRange.min) : ''
    const resetEndDate = dateRange ? toDateInputValue(dateRange.max) : ''
    onFilterChange({
      startDate: resetStartDate,
      endDate: resetEndDate,
      severity: [...SEVERITY_LEVELS],
      weather: [],
    })
    if (dateRange) {
      onDateRangeInput({ startDate: resetStartDate, endDate: resetEndDate })
    }
  }

  return (
    <div className="absolute top-0 left-0 z-[1000] h-full flex" style={{ pointerEvents: 'none' }}>
      <div
        className="bg-white shadow-lg flex flex-col transition-all duration-300 overflow-hidden"
        style={{ width: collapsed ? '0px' : '280px', pointerEvents: 'auto' }}
      >
        {!collapsed && (
          <div className="flex flex-col h-full overflow-y-auto p-4">
            <SidebarHeader onCollapse={onToggle} />

            <DateRangeFilter
              filters={filters}
              dateRange={dateRange}
              onInput={onDateRangeInput}
            />
            <SeverityFilter
              selected={filters.severity}
              onChange={(severity) => onFilterChange({ ...filters, severity })}
            />
            <WeatherFilter
              selected={filters.weather}
              onChange={(weather) => onFilterChange({ ...filters, weather })}
            />

            <button
              onClick={handleReset}
              className="mt-auto text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {collapsed && <ExpandButton onClick={onToggle} />}
    </div>
  )
}

function SidebarHeader({ onCollapse }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      <button
        onClick={onCollapse}
        className="p-1 hover:bg-gray-100 rounded text-gray-500"
        title="Collapse filters"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>
  )
}

function ExpandButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white shadow-lg rounded-r-lg px-2 py-3 hover:bg-gray-50 self-start mt-4"
      style={{ pointerEvents: 'auto' }}
      title="Expand filters"
    >
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    </button>
  )
}
