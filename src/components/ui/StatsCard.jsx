import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, subtitle, icon: Icon, iconBg, trend }) {
  const isPositive = trend && trend >= 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg || 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
            <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
      </div>
    </div>
  )
}
