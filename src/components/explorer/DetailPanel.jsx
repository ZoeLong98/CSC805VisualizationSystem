import { parseDate } from '../../lib/dateUtils'
import { SEVERITY_COLORS, SEVERITY_LABELS } from '../../lib/constants'

export default function DetailPanel({ accident, onClose }) {
  return (
    <div
      className="absolute top-0 right-0 z-[1000] h-full flex"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className={`bg-white shadow-lg w-[320px] ${accident ? 'flex flex-col h-full overflow-y-auto' : 'flex items-center justify-center p-6'}`}
        style={{ pointerEvents: 'auto' }}
      >
        {accident ? <AccidentDetails accident={accident} onClose={onClose} /> : <EmptyState />}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center text-gray-400">
      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
      <p className="text-sm">Click on an accident marker to view details</p>
    </div>
  )
}

function AccidentDetails({ accident, onClose }) {
  const date = parseDate(accident.startTime)
  const formattedDate = date
    ? date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown'
  const formattedTime = date
    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Accident Details</h2>
        <CloseButton onClose={onClose} />
      </div>

      <LocationSection accident={accident} />
      <Field label="Date & Time">
        <p className="text-sm text-gray-900">{formattedDate}</p>
        {formattedTime && <p className="text-sm text-gray-600">{formattedTime}</p>}
      </Field>

      <Field label="Severity">
        <SeverityBadge severity={accident.severity} />
      </Field>

      {accident.distance != null && (
        <Field label="Distance (mi)">
          <p className="text-sm text-gray-900">{Number(accident.distance).toFixed(2)}</p>
        </Field>
      )}

      {accident.description && (
        <Field label="Description">
          <p className="text-sm text-gray-700 leading-relaxed">{accident.description}</p>
        </Field>
      )}

      <WeatherSection accident={accident} />
    </div>
  )
}

function CloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="p-1 hover:bg-gray-100 rounded text-gray-500"
      title="Close panel"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

function LocationSection({ accident }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-900">
        {accident.street || 'Unknown Street'}
      </p>
      <p className="text-sm text-gray-500">
        {accident.city}, {accident.state}
      </p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</h3>
      {children}
    </div>
  )
}

function SeverityBadge({ severity }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium text-white"
      style={{ background: SEVERITY_COLORS[severity] }}
    >
      <span className="w-2 h-2 rounded-full bg-white/40" />
      Level {severity} — {SEVERITY_LABELS[severity]}
    </span>
  )
}

function WeatherSection({ accident }) {
  const items = [
    { label: 'Temperature', value: accident.temperature != null ? `${accident.temperature}°F` : 'N/A' },
    { label: 'Humidity', value: accident.humidity != null ? `${accident.humidity}%` : 'N/A' },
    { label: 'Visibility', value: accident.visibility != null ? `${accident.visibility} mi` : 'N/A' },
    { label: 'Wind Speed', value: accident.windSpeed != null ? `${accident.windSpeed} mph` : 'N/A' },
  ]

  return (
    <div className="border-t border-gray-200 pt-4 mt-2">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Weather Conditions</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-sm font-medium text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
      {accident.weatherCondition && (
        <p className="mt-3 text-sm text-gray-600">
          <span className="text-gray-500">Condition:</span> {accident.weatherCondition}
        </p>
      )}
    </div>
  )
}
