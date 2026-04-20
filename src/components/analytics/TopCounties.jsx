import { useNavigate } from 'react-router-dom'
import { useJsonData } from '../../hooks/useJsonData'

export default function TopCounties() {
  const { data, loading } = useJsonData('/data/by_county_danger.json', (d) => d.slice(0, 10))

  if (loading) return <TopCountiesSkeleton />
  if (!data) return null

  const maxScore = data[0]?.score ?? 1

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          Top 10 Counties by Danger Score
        </h3>
        <p className="text-xs text-gray-400 mt-1">Click to view on map</p>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => (
          <CountyRow
            key={`${item.county}-${item.state}`}
            rank={index + 1}
            item={item}
            maxScore={maxScore}
          />
        ))}
      </div>
    </div>
  )
}

function CountyRow({ rank, item, maxScore }) {
  const navigate = useNavigate()

  const handleView = () => {
    const params = new URLSearchParams({ county: item.county, state: item.state })
    if (item.lat != null) params.set('lat', item.lat)
    if (item.lng != null) params.set('lng', item.lng)
    navigate(`/explorer?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <span className="w-6 text-right text-gray-400 font-semibold text-sm shrink-0">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-gray-800 font-medium truncate">
            {item.county}, {item.state}
          </span>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <span className="text-sm text-red-600 font-bold tabular-nums">
              {item.score.toFixed(1)}
            </span>
            <ViewOnMapButton onClick={handleView} location={`${item.county}, ${item.state}`} />
          </div>
        </div>
        <ScoreBar score={item.score} maxScore={maxScore} />
      </div>
    </div>
  )
}

function ViewOnMapButton({ onClick, location }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-300 hover:text-blue-500 transition-colors"
      title={`View ${location} on map`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </button>
  )
}

function ScoreBar({ score, maxScore }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full transition-all duration-300"
        style={{
          width: `${(score / maxScore) * 100}%`,
          background: 'linear-gradient(90deg, #fca5a5, #ef4444)',
        }}
      />
    </div>
  )
}

function TopCountiesSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="h-4 w-56 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-3 w-40 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="space-y-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
