import { Outlet } from 'react-router-dom'
import NavItem from './layout/NavItem'
import { ExplorerIcon, AnalyticsIcon, AboutIcon } from './layout/navIcons'

const NAV_ITEMS = [
  { to: '/explorer', label: 'Explorer', icon: ExplorerIcon },
  { to: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
  { to: '/about', label: 'About', icon: AboutIcon },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">US Accidents Visualization</h1>
          <p className="text-sm text-gray-500">CSC 805 Data Visualization Project</p>
        </div>
        <div className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
