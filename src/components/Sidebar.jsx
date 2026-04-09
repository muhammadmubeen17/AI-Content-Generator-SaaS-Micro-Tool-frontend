import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, LayoutTemplate, History as HistoryIcon,
  CreditCard, Settings, Sparkle, Sparkles,
  ChevronLeft, ChevronRight, ChevronDown, LogOut,
  PlayCircle, Briefcase, ShoppingBag, Users, FileText,
  Megaphone, Mail, Share2, Package,
} from 'lucide-react'
import { TOOLS } from '../constants'
import useAuthStore from '../store/useAuthStore'
import useAppStore from '../store/useAppStore'
import Avatar from './ui/Avatar'
import ProgressBar from './ui/ProgressBar'

const ICON_MAP = {
  PlayCircle, Briefcase, ShoppingBag, Users, FileText, Megaphone, Mail, Share2, Package,
}

const BOTTOM_NAV = [
  { path: '/templates', label: 'Templates', icon: LayoutTemplate },
  { path: '/history', label: 'History', icon: HistoryIcon },
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
]

const NAV_LINK_BASE = 'flex items-center rounded-lg transition-all duration-150'
const NAV_ACTIVE = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
const NAV_IDLE = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isOnToolPage = location.pathname.startsWith('/tools/')
  const [toolsOpen, setToolsOpen] = useState(isOnToolPage)

  // Auto-expand the tools menu whenever the user lands on a tool page
  useEffect(() => {
    if (isOnToolPage) setToolsOpen(true)
  }, [isOnToolPage])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // When collapsed, clicking the Sparkles icon expands the sidebar + opens tools menu
  const handleCollapsedToolsClick = () => {
    toggleSidebar()
    setToolsOpen(true)
  }

  return (
    <aside
      className={`
        relative flex h-screen flex-col border-r border-gray-200 bg-white
        transition-all duration-300 dark:border-gray-700 dark:bg-gray-900
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? 'justify-center px-3 py-4' : 'gap-2.5 px-5 py-4'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Sparkle className="h-4 w-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-bold text-gray-900 dark:text-white">ContentAI</span>
        )}
      </div>

      {/* ── Collapse toggle ───────────────────────────────────────────────── */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-14 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        {sidebarCollapsed
          ? <ChevronRight className="h-3 w-3 text-gray-500" />
          : <ChevronLeft className="h-3 w-3 text-gray-500" />
        }
      </button>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <div className={`space-y-0.5 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
          {!sidebarCollapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Menu
            </p>
          )}

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            title={sidebarCollapsed ? 'Dashboard' : undefined}
            className={({ isActive }) =>
              `${NAV_LINK_BASE} ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} ${isActive ? NAV_ACTIVE : NAV_IDLE}`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                {!sidebarCollapsed && <span className="text-sm font-medium">Dashboard</span>}
              </>
            )}
          </NavLink>

          {/* ── Generate Content — collapsible section ─────────────────── */}
          {sidebarCollapsed ? (
            // Collapsed: single Sparkles icon that expands sidebar + opens tools
            <button
              onClick={handleCollapsedToolsClick}
              title="Generate Content"
              className={`w-full flex justify-center items-center p-2.5 rounded-lg transition-all duration-150 ${
                isOnToolPage ? NAV_ACTIVE : NAV_IDLE
              }`}
            >
              <Sparkles className={`h-5 w-5 shrink-0 ${isOnToolPage ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
            </button>
          ) : (
            <div>
              {/* Section header / toggle */}
              <button
                onClick={() => setToolsOpen((o) => !o)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isOnToolPage ? NAV_ACTIVE : NAV_IDLE
                }`}
              >
                <Sparkles className={`h-5 w-5 shrink-0 ${isOnToolPage ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span className="flex-1 text-left text-sm font-medium">Generate Content</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Tool sub-items */}
              {toolsOpen && (
                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
                  {TOOLS.map((tool) => {
                    const Icon = ICON_MAP[tool.icon]
                    return (
                      <NavLink
                        key={tool.id}
                        to={`/tools/${tool.id}`}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-all duration-150 ${
                            isActive
                              ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {Icon && (
                              <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                            )}
                            <span>{tool.label}</span>
                          </>
                        )}
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Spacer between tools and rest of nav */}
          {!sidebarCollapsed && (
            <div className="pt-2">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Workspace
              </p>
            </div>
          )}

          {/* Bottom nav items */}
          {BOTTOM_NAV.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive }) =>
                `${NAV_LINK_BASE} ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} ${isActive ? NAV_ACTIVE : NAV_IDLE}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Credits bar ──────────────────────────────────────────────────── */}
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

      {/* ── User footer ──────────────────────────────────────────────────── */}
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
            className={`rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 ${sidebarCollapsed ? 'hidden' : ''}`}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
