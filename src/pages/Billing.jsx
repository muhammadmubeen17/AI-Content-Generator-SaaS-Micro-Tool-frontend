import { useState, useEffect } from 'react'
import {
  Check, Zap, Crown, Star, ExternalLink, ArrowDown,
  TrendingUp, TrendingDown, RefreshCw, ShoppingCart,
  Plus, Minus, Receipt, Coins, AlertTriangle, Package,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import Modal from '../components/ui/Modal'
import { CardSkeleton } from '../components/ui/Skeleton'
import {
  createCheckoutSession,
  getTransactions,
  downgrade as downgradePlan,
  purchaseCredits as purchaseCreditsApi,
  getCreditHistory,
  renewPlan,
  getPortalSession,
} from '../services/billingService'
import { PLANS, CREDIT_PACKS } from '../constants'
import { formatDate } from '../utils'

const PLAN_ICONS = { free: Zap, pro: Crown, premium: Star }
const PLAN_COLORS = { free: 'text-gray-600', pro: 'text-indigo-600', premium: 'text-purple-600' }
const PLAN_BADGE = { free: 'default', pro: 'primary', premium: 'purple' }

const LEDGER_ICONS = {
  plan_upgrade: TrendingUp,
  plan_downgrade: TrendingDown,
  monthly_reset: RefreshCw,
  top_up: ShoppingCart,
  generation: Minus,
  admin_add: Plus,
  refund: RefreshCw,
}
const LEDGER_COLORS = {
  plan_upgrade: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
  plan_downgrade: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30',
  monthly_reset: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30',
  top_up: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30',
  generation: 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
  admin_add: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
  refund: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-900/30',
}

export default function Billing() {
  const { user, refreshUser } = useAuthStore()
  const [upgrading, setUpgrading] = useState(null)
  const [downgrading, setDowngrading] = useState(false)
  const [purchasingPack, setPurchasingPack] = useState(null)
  const [renewing, setRenewing] = useState(false)
  const [portaling, setPortaling] = useState(false)

  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(true)

  const [creditHistory, setCreditHistory] = useState([])
  const [creditHistoryPagination, setCreditHistoryPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [creditHistoryLoading, setCreditHistoryLoading] = useState(true)

  const [showDowngradeModal, setShowDowngradeModal] = useState(false)

  // ─── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    loadTransactions()
    loadCreditHistory(1)
  }, [])

  // Check for successful Stripe return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      toast.success('Payment successful! Your plan has been upgraded.')
      refreshUser()
      loadCreditHistory(1)
      loadTransactions()
      window.history.replaceState({}, '', '/billing')
    }
    if (params.get('credits_success') === 'true') {
      toast.success('Credits purchased successfully!')
      refreshUser()
      loadCreditHistory(1)
      loadTransactions()
      window.history.replaceState({}, '', '/billing')
    }
    if (params.get('cancelled') === 'true') {
      toast.error('Payment cancelled.')
      window.history.replaceState({}, '', '/billing')
    }
  }, [])

  const loadTransactions = async () => {
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

  const loadCreditHistory = async (page) => {
    setCreditHistoryLoading(true)
    try {
      const { data } = await getCreditHistory({ page, limit: 8 })
      setCreditHistory(data.entries || [])
      setCreditHistoryPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    } catch {
      // silently fail
    } finally {
      setCreditHistoryLoading(false)
    }
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleUpgrade = async (planId) => {
    if (planId === user?.plan) return
    setUpgrading(planId)
    try {
      const { data } = await createCheckoutSession(planId)

      if (data.mock) {
        toast.success(data.message || 'Plan upgraded!')
        await refreshUser()
        loadCreditHistory(1)
        loadTransactions()
        setUpgrading(null)
        return
      }

      if (data.url) {
        window.location.href = data.url
        return
      }
    } catch (err) {
      toast.error(err.message || 'Failed to start checkout')
    }
    setUpgrading(null)
  }

  const handleDowngrade = async () => {
    setDowngrading(true)
    try {
      const { data } = await downgradePlan()
      toast.success(data.message || 'Downgraded to free plan.')
      await refreshUser()
      loadCreditHistory(1)
      loadTransactions()
      setShowDowngradeModal(false)
    } catch (err) {
      toast.error(err.message || 'Failed to downgrade.')
    }
    setDowngrading(false)
  }

  const handlePurchaseCredits = async (packId) => {
    setPurchasingPack(packId)
    try {
      const { data } = await purchaseCreditsApi(packId)

      // Dev mock mode — credits added directly
      if (data.mock) {
        toast.success(data.message || 'Credits purchased!')
        await refreshUser()
        loadCreditHistory(1)
        loadTransactions()
        setPurchasingPack(null)
        return
      }

      // Real Stripe — redirect to checkout
      if (data.url) {
        window.location.href = data.url
        return
      }
    } catch (err) {
      toast.error(err.message || 'Failed to purchase credits.')
    }
    setPurchasingPack(null)
  }

  const handleRenew = async () => {
    setRenewing(true)
    try {
      const { data } = await renewPlan()
      toast.success(data.message || 'Plan renewed!')
      await refreshUser()
      loadCreditHistory(1)
      loadTransactions()
    } catch (err) {
      toast.error(err.message || 'Failed to renew plan.')
    }
    setRenewing(false)
  }

  const handleOpenPortal = async () => {
    setPortaling(true)
    try {
      const { data } = await getPortalSession()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast.error(err.message || 'Failed to open billing portal.')
    }
    setPortaling(false)
  }

  const currentPlanData = PLANS.find((p) => p.id === user?.plan)
  const creditsUsed = (user?.totalCredits ?? 0) - (user?.credits ?? 0)
  const creditsPercent = user?.totalCredits ? Math.round((user.credits / user.totalCredits) * 100) : 0
  const isPaidPlan = user?.plan !== 'free'

  const resetDate = user?.creditsResetAt
    ? new Date(user.creditsResetAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  const expiryDate = user?.planExpiresAt
    ? new Date(user.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Credits</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your plan, purchase credits, and view billing history.
        </p>
      </div>

      {/* ── Section 1: Current Plan + Credit Balance ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Current Plan Summary */}
        <Card className="lg:col-span-2">
          <CardHeader title="Current Plan" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isPaidPlan ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {currentPlanData && (() => { const Icon = PLAN_ICONS[currentPlanData.id]; return <Icon className={`h-6 w-6 ${PLAN_COLORS[currentPlanData.id]}`} /> })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{currentPlanData?.name} Plan</span>
                    <Badge variant={user?.subscriptionStatus === 'cancelling' ? 'orange' : PLAN_BADGE[user?.plan] || 'default'}>
                      {user?.subscriptionStatus === 'cancelling' ? 'Cancelling' : user?.subscriptionStatus === 'active' ? 'Active' : user?.plan === 'free' ? 'Free' : user?.subscriptionStatus?.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${currentPlanData?.price ?? 0}/month • {currentPlanData?.credits} credits/month
                  </p>
                </div>
              </div>

              {/* Credits bar */}
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Credits remaining</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user?.credits ?? 0} / {user?.totalCredits ?? 0}
                  </span>
                </div>
                <ProgressBar
                  value={creditsUsed}
                  max={user?.totalCredits ?? 1}
                  showPercent={false}
                  color={user?.credits < 10 ? 'red' : user?.credits < 30 ? 'yellow' : 'indigo'}
                />
              </div>

               {/* Reset date / Expiry date */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {user?.subscriptionStatus === 'cancelling' ? (
                    <span className="text-orange-600 dark:text-orange-400">Plan ends on: <strong>{expiryDate}</strong></span>
                  ) : (
                    <span>Credits reset: <strong className="text-gray-700 dark:text-gray-300">{resetDate}</strong></span>
                  )}
                </div>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{creditsPercent}% remaining</span>
              </div>
            </div>

            {/* Price & Primary Action */}
            <div className="shrink-0 flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${currentPlanData?.price ?? 0}
                  <span className="text-base font-normal text-gray-500">/mo</span>
                </p>
                {isPaidPlan && user?.subscriptionStatus !== 'cancelling' && (
                  <button
                    onClick={() => setShowDowngradeModal(true)}
                    className="mt-1 text-xs text-red-500 hover:text-red-600 hover:underline transition-colors"
                  >
                    Downgrade to Free
                  </button>
                )}
                {user?.subscriptionStatus === 'cancelling' && (
                  <p className="mt-1 text-[10px] font-medium uppercase text-orange-600 dark:text-orange-400">
                    Downgrade pending
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {user?.subscriptionStatus === 'cancelling' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    loading={renewing}
                    onClick={handleRenew}
                    icon={RefreshCw}
                  >
                    Renew Plan
                  </Button>
                ) : isPaidPlan ? (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={portaling}
                    onClick={handleOpenPortal}
                    icon={Receipt}
                  >
                    Update Payment
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        {/* Credit Balance Meter */}
        <Card>
          <CardHeader title="Credit Balance" />
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-3">
              <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${
                user?.credits < 10
                  ? 'border-red-200 dark:border-red-800'
                  : user?.credits < 30
                    ? 'border-yellow-200 dark:border-yellow-800'
                    : 'border-indigo-200 dark:border-indigo-800'
              }`}>
                <div>
                  <p className={`text-2xl font-bold ${
                    user?.credits < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {user?.credits ?? 0}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">credits</p>
                </div>
              </div>
              {user?.credits < 10 && (
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow">
                  <AlertTriangle className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.credits < 10
                ? 'Low credits! Purchase more below.'
                : `${creditsPercent}% of plan allocation remaining`
              }
            </p>
            <div className="mt-3 w-full rounded-lg bg-indigo-50 px-3 py-2 dark:bg-indigo-900/20">
              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                🔄 Resets on {resetDate}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Section 2: Credit Top-Up Packs ───────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Coins className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Buy More Credits</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative rounded-2xl border p-5 transition-all hover:shadow-md ${
                pack.popular
                  ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 dark:border-purple-700 dark:from-purple-950/30 dark:to-indigo-950/30'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                    Best Value
                  </span>
                </div>
              )}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                  <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-medium text-gray-400">{pack.pricePerCredit}/credit</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{pack.credits} Credits</h3>
              <div className="mt-1 mb-4 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">${pack.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">one-time</span>
              </div>
              <Button
                variant={pack.popular ? 'primary' : 'outline'}
                className="w-full"
                loading={purchasingPack === pack.id}
                onClick={() => handlePurchaseCredits(pack.id)}
                icon={Plus}
              >
                Buy Credits
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Plan Comparison Grid ──────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Choose a Plan</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:max-w-4xl">
          {PLANS.map((plan) => {
            const Icon = PLAN_ICONS[plan.id]
            const isCurrent = user?.plan === plan.id
            const isPopular = plan.highlighted
            const userPlanRank = { free: 0, pro: 1 }
            const isDowngrade = userPlanRank[plan.id] < userPlanRank[user?.plan]
            const isUpgrade = userPlanRank[plan.id] > userPlanRank[user?.plan]

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
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
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isPopular ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`} />
                      <span className={isPopular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-300'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {isCurrent ? (
                    user?.subscriptionStatus === 'cancelling' ? (
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full"
                        loading={renewing}
                        onClick={handleRenew}
                        icon={RefreshCw}
                      >
                        Renew Plan
                      </Button>
                    ) : (
                      <button
                        disabled
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                      >
                        ✓ Current Plan
                      </button>
                    )
                  ) : isUpgrade ? (
                    <Button
                      variant={isPopular ? 'secondary' : 'primary'}
                      className={`w-full ${isPopular && 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
                      loading={upgrading === plan.id}
                      onClick={() => handleUpgrade(plan.id)}
                      icon={ExternalLink}
                    >
                      Upgrade
                    </Button>
                  ) : isDowngrade ? (
                    user?.subscriptionStatus === 'cancelling' ? (
                      <button
                        disabled
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                      >
                        ✓ Downgrade Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowDowngradeModal(true)}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                          isPopular
                            ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                            : 'border-orange-200 bg-orange-50 text-orange-600 hover:border-orange-300 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30'
                        }`}
                      >
                        <ArrowDown className="h-4 w-4" />
                        Downgrade
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                    >
                      ✓ Current Plan
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Section 4: Credit Activity Log ───────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Credit Activity"
          subtitle="Detailed log of all credit changes"
          action={
            <Badge variant="default">
              {creditHistoryPagination.total} entries
            </Badge>
          }
        />
        {creditHistoryLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : creditHistory.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No credit activity yet. Generate content or purchase credits to see activity here.
          </p>
        ) : (
          <>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {creditHistory.map((entry) => {
                const Icon = LEDGER_ICONS[entry.type] || Coins
                const colorCls = LEDGER_COLORS[entry.type] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700'
                const isPositive = entry.amount > 0

                return (
                  <div key={entry._id} className="flex items-center justify-between py-3.5 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorCls}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {entry.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`text-sm font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {isPositive ? '+' : ''}{entry.amount}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 w-16 text-right">
                        bal: {entry.balanceAfter}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {creditHistoryPagination.pages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Page {creditHistoryPagination.page} of {creditHistoryPagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadCreditHistory(creditHistoryPagination.page - 1)}
                    disabled={creditHistoryPagination.page <= 1}
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => loadCreditHistory(creditHistoryPagination.page + 1)}
                    disabled={creditHistoryPagination.page >= creditHistoryPagination.pages}
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* ── Section 5: Transaction History ───────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Transaction History"
          subtitle="Your billing and payment records"
          action={
            <Badge variant="default">
              <Receipt className="mr-1 h-3 w-3" />
              {transactions.length} records
            </Badge>
          }
        />
        {txLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No transactions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Type</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Plan</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400 hidden sm:table-cell">Credits</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3.5">
                      <Badge variant={tx.type === 'top_up' ? 'purple' : tx.type === 'subscription' ? 'primary' : 'default'}>
                        {tx.type === 'top_up' ? 'Top-up' : tx.type === 'subscription' ? 'Subscription' : tx.type}
                      </Badge>
                    </td>
                    <td className="py-3.5 capitalize font-medium text-gray-900 dark:text-white">
                      {tx.plan}
                      {tx.previousPlan && tx.previousPlan !== tx.plan && (
                        <span className="ml-1 text-xs text-gray-400">
                          ← {tx.previousPlan}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 hidden sm:table-cell">
                      {tx.creditsAdded > 0 && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +{tx.creditsAdded}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-semibold text-gray-900 dark:text-white">
                      {tx.amount > 0 ? `$${tx.amount}` : 'Free'}
                    </td>
                    <td className="py-3.5">
                      <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Downgrade Confirmation Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        title="Downgrade to Free Plan"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                Are you sure you want to downgrade?
              </p>
              <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                This action will take effect immediately.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-red-500" />
              <span>Your current subscription will be <strong className="text-gray-900 dark:text-white">cancelled immediately</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-red-500" />
              <span>Credits will be <strong className="text-gray-900 dark:text-white">capped at {PLANS[0].credits}</strong> (Free plan limit)</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-red-500" />
              <span>You currently have <strong className="text-gray-900 dark:text-white">{user?.credits ?? 0} credits</strong> — you'll keep <strong className="text-gray-900 dark:text-white">{Math.min(user?.credits ?? 0, PLANS[0].credits)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-red-500" />
              <span>Monthly allocation drops to <strong className="text-gray-900 dark:text-white">{PLANS[0].credits} credits/month</strong></span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowDowngradeModal(false)}
            >
              Keep My Plan
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={downgrading}
              onClick={handleDowngrade}
            >
              Downgrade to Free
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
