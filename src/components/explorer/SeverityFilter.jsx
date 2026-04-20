import InfoTooltip from '../common/InfoTooltip'
import { SEVERITY_COLORS, SEVERITY_LABELS, SEVERITY_LEVELS } from '../../lib/constants'

export default function SeverityFilter({ selected, onChange }) {
  const toggle = (level) => {
    const next = selected.includes(level)
      ? selected.filter((s) => s !== level)
      : [...selected, level]
    onChange(next)
  }

  return (
    <div className="mb-5">
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Severity</h3>
        <InfoTooltip text="Filter accidents by severity level. Level 1 (Minor) to Level 4 (Fatal)." />
      </div>
      <div className="space-y-1.5">
        {SEVERITY_LEVELS.map((level) => (
          <label key={level} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(level)}
              onChange={() => toggle(level)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: SEVERITY_COLORS[level] }}
            />
            <span className="text-sm text-gray-700">
              {level} - {SEVERITY_LABELS[level]}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
