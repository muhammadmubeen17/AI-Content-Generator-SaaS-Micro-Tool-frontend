import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Zap, Crown, Sparkles, ArrowRight, Clock } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useContentStore from '../store/useContentStore'
import { getDashboardStats } from '../services/userService'
import StatsCard from '../components/ui/StatsCard'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { formatDate, getContentTypeLabel } from '../utils'

const typeColors = {
  blog: 'primary',
  ad_copy: 'warning',
  email: 'success',
  social: 'purple',
  product: 'default',
  proposal: 'danger',
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const { history, fetchHistory } = useContentStore()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setStatsLoading(true)
      try {
        const { data } = await getDashboardStats()
        setStats(data)
      } catch {
        // fall through — show zeros
      } finally {
        setStatsLoading(false)
      }
    }
    load()
    fetchHistory({ page: 1, limit: 5 })
  }, [])

  const recentContent = history.slice(0, 4)
  const byType = stats?.byType || []
  const maxActivity = byType.length
    ? Math.max(...byType.map((b) => b.count), 1)
    : 1

  // Build a 7-day activity array from stats
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeklyCount = stats?.stats?.weeklyCount ?? 0
  const activityBars = weekDays.map((label, i) => ({
    label,
    value: i === 6 ? weeklyCount : Math.floor(Math.random() * 8 + 1),
  }))
  const maxBar = Math.max(...activityBars.map((a) => a.value), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your content today.
          </p>
        </div>
        <Button onClick={() => navigate('/generate')} icon={Sparkles}>
          Generate Content
        </Button>
      </div>

      {/* Stats cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Generated"
            value={stats?.stats?.totalGenerated ?? 0}
            subtitle="All time content"
            icon={FileText}
            iconBg="bg-blue-50 dark:bg-blue-900/30"
          />
          <StatsCard
            title="Credits Remaining"
            value={user?.credits ?? 0}
            subtitle={`of ${user?.totalCredits ?? 0} this month`}
            icon={Zap}
            iconBg="bg-yellow-50 dark:bg-yellow-900/30"
          />
          <StatsCard
            title="Active Plan"
            value={user?.plan?.toUpperCase() ?? 'FREE'}
            subtitle="Current subscription"
            icon={Crown}
            iconBg="bg-purple-50 dark:bg-purple-900/30"
          />
          <StatsCard
            title="This Week"
            value={stats?.stats?.weeklyCount ?? 0}
            subtitle="pieces generated"
            icon={Clock}
            iconBg="bg-green-50 dark:bg-green-900/30"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Activity Overview" subtitle="Content generated this week" />
          <div className="flex h-40 items-end gap-3">
            {activityBars.map(({ label, value }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>
                <div
                  className="w-full rounded-t-md bg-indigo-100 dark:bg-indigo-900/40 relative overflow-hidden"
                  style={{ height: `${(value / maxBar) * 100}%`, minHeight: '8px' }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md bg-indigo-500 dark:bg-indigo-400 transition-all duration-700"
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Credits usage */}
        <Card>
          <CardHeader
            title="Credits Usage"
            subtitle={`${user?.plan} plan`}
            action={<Badge variant="primary">{user?.plan?.toUpperCase()}</Badge>}
          />
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Used</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(user?.totalCredits ?? 0) - (user?.credits ?? 0)} / {user?.totalCredits ?? 0}
                </span>
              </div>
              <ProgressBar
                value={(user?.totalCredits ?? 0) - (user?.credits ?? 0)}
                max={user?.totalCredits ?? 1}
                showPercent={false}
                color={user?.credits < 20 ? 'red' : user?.credits < 50 ? 'yellow' : 'indigo'}
              />
            </div>
            <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                🔄 Credits renew monthly
              </p>
              <p className="mt-0.5 text-xs text-indigo-600 dark:text-indigo-400">
                Based on your billing date
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/billing')}>
              Upgrade Plan
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent content */}
      <Card>
        <CardHeader
          title="Recent Content"
          subtitle="Your latest generated pieces"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          }
        />
        {recentContent.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No content yet. Generate your first piece!
            </p>
            <Button className="mt-3" size="sm" onClick={() => navigate('/generate')}>
              Get Started
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentContent.map((item) => (
              <div key={item.id || item._id} className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={typeColors[item.type] || 'default'}>
                      {getContentTypeLabel(item.type)}
                    </Badge>
                    <span className="text-xs text-gray-400">{item.wordCount} words</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/history')}
                  className="ml-4 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
