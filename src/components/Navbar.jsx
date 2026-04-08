import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sun, Moon, Bell, ChevronDown, Settings, LogOut, CreditCard, Zap } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useAppStore from '../store/useAppStore'
import Avatar from './ui/Avatar'
import Badge from './ui/Badge'

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Your content has been generated successfully', time: '2 min ago', read: false },
  { id: 2, text: 'Credits running low — 30 credits remaining', time: '1 hour ago', read: false },
  { id: 3, text: 'New template added: YouTube Script', time: '1 day ago', read: true },
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useAppStore()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const userMenuRef = useRef(null)
  const notifRef = useRef(null)

  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const planColors = { free: 'default', pro: 'primary', premium: 'purple' }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Credits pill */}
      <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 dark:border-indigo-800 dark:bg-indigo-900/30">
        <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {user?.credits ?? 0} credits
        </span>
        <span className="text-xs text-indigo-400 dark:text-indigo-500">/ {user?.totalCredits}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                  >
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-gray-300' : 'bg-indigo-500'}`} />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
          >
            <Avatar name={user?.name} size="sm" />
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                <Badge variant={planColors[user?.plan] || 'default'}>
                  {user?.plan?.toUpperCase()}
                </Badge>
              </div>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <div className="py-1">
                {[
                  { label: 'Settings', icon: Settings, path: '/settings' },
                  { label: 'Billing', icon: CreditCard, path: '/billing' },
                ].map(({ label, icon: Icon, path }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-200 py-1 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
