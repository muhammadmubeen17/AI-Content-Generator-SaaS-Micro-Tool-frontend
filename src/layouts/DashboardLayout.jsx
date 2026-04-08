import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function DashboardLayout() {
  const { isAuthenticated, refreshUser } = useAuthStore()

  // Sync user data from backend on every dashboard mount
  useEffect(() => {
    if (isAuthenticated) refreshUser()
  }, [])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
