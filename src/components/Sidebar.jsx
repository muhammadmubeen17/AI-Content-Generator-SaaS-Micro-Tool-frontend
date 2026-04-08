import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Sparkles, LayoutTemplate, History,
  CreditCard, Settings, Sparkle, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useAppStore from '../store/useAppStore'
import Avatar from './ui/Avatar'
import ProgressBar from './ui/ProgressBar'

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/generate', label: 'Generate Content', icon: Sparkles },
  { path: '/templates', label: 'Templates', icon: LayoutTemplate },
  { path: '/history', label: 'History', icon: History },
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={`
        relative flex h-screen flex-col border-r border-gray-200 bg-white
        transition-all duration-300 dark:border-gray-700 dark:bg-gray-900
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'justify-center px-3 py-4' : 'gap-2.5 px-5 py-4'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Sparkle className="h-4 w-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-bold text-gray-900 dark:text-white">ContentAI</span>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-14 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        {sidebarCollapsed
          ? <ChevronRight className="h-3 w-3 text-gray-500" />
          : <ChevronLeft className="h-3 w-3 text-gray-500" />
        }
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <div className={`space-y-0.5 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
          {!sidebarCollapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Menu
            </p>
          )}
          {NAV.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive }) => `
                flex items-center rounded-lg transition-all duration-150
                ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Credits bar */}
      {!sidebarCollapsed && user && (
        <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Credits</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {user.credits}/{user.totalCredits}
            </span>
          </div>
          <ProgressBar value={user.credits} max={user.totalCredits} showPercent={false} />
        </div>
      )}

      {/* User footer */}
      <div className={`border-t border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed ? (
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name={user?.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
          ) : (
            <Avatar name={user?.name} size="sm" />
          )}

          <button
            onClick={handleLogout}
            title="Logout"
            className={`rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-900/20 dark:hover:text-red-400 ${sidebarCollapsed ? 'hidden' : ''}`}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
