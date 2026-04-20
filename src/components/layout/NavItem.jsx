import { NavLink } from 'react-router-dom'

const ACTIVE_CLASS =
  'flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium'
const INACTIVE_CLASS =
  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 text-sm font-medium'

export default function NavItem({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? ACTIVE_CLASS : INACTIVE_CLASS)}>
      {icon}
      {label}
    </NavLink>
  )
}
