import { useState, useEffect } from 'react'
import { Check, Zap, Crown, Star, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { createCheckoutSession, getTransactions } from '../services/billingService'
import { PLANS } from '../constants'
import { formatDate } from '../utils'

const PLAN_ICONS = { free: Zap, pro: Crown, premium: Star }
const PLAN_COLORS = { free: 'text-gray-600', pro: 'text-indigo-600', premium: 'text-purple-600' }

export default function Billing() {
  const { user, refreshUser } = useAuthStore()
  const [upgrading, setUpgrading] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setTxLoading(true)
      try {
        const { data } = await getTransactions()
        setTransactions(data.transactions || [])
      } catch {
        // silently fail
      } finally {
        setTxLoading(false)
      }
    }
    load()
  }, [])

  // Check for successful Stripe return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      toast.success('Payment successful! Your plan has been upgraded.')
      refreshUser()
      window.history.replaceState({}, '', '/billing')
    }
    if (params.get('cancelled') === 'true') {
      toast.error('Payment cancelled.')
      window.history.replaceState({}, '', '/billing')
    }
  }, [])

  const handleUpgrade = async (planId) => {
    if (planId === user?.plan) return
    setUpgrading(planId)
    try {
      const { data } = await createCheckoutSession(planId)

      // Dev mock mode — backend upgraded without Stripe
      if (data.mock) {
        toast.success(data.message || 'Plan upgraded!')
        await refreshUser()
        setUpgrading(null)
        return
      }

      // Real Stripe — redirect to checkout
      if (data.url) {
        window.location.href = data.url
        return
      }
    } catch (err) {
      toast.error(err.message || 'Failed to start checkout')
    }
    setUpgrading(null)
  }

  const currentPlanData = PLANS.find((p) => p.id === user?.plan)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan summary */}
      <Card>
        <CardHeader title="Current Plan" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant={user?.plan === 'pro' ? 'primary' : user?.plan === 'premium' ? 'purple' : 'default'}>
                {user?.plan?.toUpperCase()} PLAN
              </Badge>
              {user?.subscriptionStatus === 'active' && (
                <Badge variant="success">Active</Badge>
              )}
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Credits used this month</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(user?.totalCredits ?? 0) - (user?.credits ?? 0)} / {user?.totalCredits}
                </span>
              </div>
              <ProgressBar
                value={(user?.totalCredits ?? 0) - (user?.credits ?? 0)}
                max={user?.totalCredits ?? 1}
                showPercent={false}
                color={user?.credits < 20 ? 'red' : 'indigo'}
              />
            </div>
          </div>
          <div className="shrink-0">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${currentPlanData?.price ?? 0}
              <span className="text-base font-normal text-gray-500">/mo</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Pricing cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Choose a Plan</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((plan) => {
            const Icon = PLAN_ICONS[plan.id]
            const isCurrent = user?.plan === plan.id
            const isPopular = plan.highlighted

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 transition-all ${
                  isPopular
                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-1 text-xs font-bold text-white shadow">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${isPopular ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
                    <Icon className={`h-6 w-6 ${isPopular ? 'text-white' : PLAN_COLORS[plan.id]}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${isPopular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${isPopular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>${plan.price}</span>
                    <span className={isPopular ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}>/month</span>
                  </div>
                  <p className={`mt-1 text-sm ${isPopular ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {plan.credits} credits / month
                  </p>
                </div>
                <ul className="mb-6 space-y-2.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isPopular ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`} />
                      <span className={isPopular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-300'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isPopular ? 'secondary' : isCurrent ? 'ghost' : 'primary'}
                  className={`w-full ${isPopular && !isCurrent ? 'bg-white text-indigo-700 hover:bg-indigo-50' : ''}`}
                  loading={upgrading === plan.id}
                  disabled={isCurrent || (plan.price === 0 && user?.plan !== 'free')}
                  onClick={() => handleUpgrade(plan.id)}
                  icon={!isCurrent && plan.price > 0 ? ExternalLink : undefined}
                >
                  {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Free Plan' : 'Upgrade'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction history */}
      <Card>
        <CardHeader title="Transaction History" subtitle="Your billing history" />
        {txLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No transactions yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {tx.plan} Plan
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${tx.amount}
                  </span>
                  <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
