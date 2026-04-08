import { Outlet, Navigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-indigo-600 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">ContentAI</span>
        </div>

        <div>
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            Generate powerful content with AI in seconds
          </h1>
          <p className="mb-8 text-lg text-indigo-200">
            Blog posts, ad copy, emails, and more — powered by cutting-edge AI that understands your brand.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Content Generated', value: '2M+' },
              { label: 'Active Users', value: '15K+' },
              { label: 'Templates', value: '50+' },
              { label: 'Languages', value: '25+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 p-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['A', 'B', 'C', 'D'].map((l) => (
              <div
                key={l}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-400 text-xs font-semibold"
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-sm text-indigo-200">Trusted by 15,000+ marketers & creators</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ContentAI</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
