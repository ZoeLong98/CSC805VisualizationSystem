import KpiCards from '../components/analytics/KpiCards'
import AccidentsOverTime from '../components/analytics/AccidentsOverTime'
import SeverityDistribution from '../components/analytics/SeverityDistribution'

export default function Analytics() {
  return (
    <div className="bg-gray-50 flex-1 p-6 space-y-6">
      <KpiCards />
      <AccidentsOverTime />
      <SeverityDistribution />
    </div>
  )
}
