export default function LoadingProgress({ loaded, total }) {
  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg px-6 py-3 flex items-center gap-3">
      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <div>
        <p className="text-sm font-medium text-gray-900">Loading accidents...</p>
        <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {loaded.toLocaleString()} / {total.toLocaleString()} ({pct}%)
        </p>
      </div>
    </div>
  )
}
