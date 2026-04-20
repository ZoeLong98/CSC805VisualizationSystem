import InfoTooltip from '../common/InfoTooltip'
import { WEATHER_OPTIONS } from '../../lib/constants'

export default function WeatherFilter({ selected, onChange }) {
  const toggle = (w) => {
    const next = selected.includes(w)
      ? selected.filter((x) => x !== w)
      : [...selected, w]
    onChange(next)
  }

  return (
    <div className="mb-5">
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Weather Condition</h3>
        <InfoTooltip text="Filter by weather at time of accident. Leave all unchecked to show all conditions." />
      </div>
      <div className="space-y-1.5">
        {WEATHER_OPTIONS.map((w) => (
          <label key={w} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(w)}
              onChange={() => toggle(w)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{w}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
