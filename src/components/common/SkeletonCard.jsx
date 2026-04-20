export default function SkeletonCard({ bodyHeight = 'h-72' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-3 w-56 bg-gray-200 rounded animate-pulse mb-4" />
      <div className={`${bodyHeight} bg-gray-100 rounded animate-pulse`} />
    </div>
  )
}
