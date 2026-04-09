import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  Sparkles, Mail, CheckCircle, XCircle, Loader2, RefreshCw, ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/useAuthStore'
import Button from '../../components/ui/Button'

// ─── State types ─────────────────────────────────────────────────────────────
// 'pending'   → no token in URL: "check your inbox" screen
// 'verifying' → token found, auto-verifying
// 'success'   → email verified successfully
// 'error'     → token expired or invalid

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { user, verifyEmail, resendVerification } = useAuthStore()

  const [status, setStatus] = useState(token ? 'verifying' : 'pending')
  const [cooldown, setCooldown] = useState(0)
  const [isSending, setIsSending] = useState(false)

  // ── Auto-verify when token is present in URL ──────────────────────────────
  useEffect(() => {
    if (!token) return
    let cancelled = false

    const doVerify = async () => {
      setStatus('verifying')
      const result = await verifyEmail(token)
      if (!cancelled) {
        setStatus(result.success ? 'success' : 'error')
        if (!result.success) {
          console.error('Verification failed:', result.error)
        }
      }
    }

    doVerify()
    return () => { cancelled = true }
  }, [token])

  // ── Resend cooldown countdown ─────────────────────────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // ── Resend handler ────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0 || isSending) return
    setIsSending(true)
    const result = await resendVerification()
    setIsSending(false)

    if (result.success) {
      setCooldown(60)
      toast.success('Verification email sent! Check your inbox.')
    } else {
      toast.error(result.error || 'Failed to resend. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">ContentAI</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center dark:border-gray-700 dark:bg-gray-800">

          {/* ── PENDING: Check inbox ─────────────────────────────────────── */}
          {status === 'pending' && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <Mail className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>

              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Check your inbox</h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                We sent a verification link to
              </p>
              {user?.email && (
                <p className="mt-1 mb-6 font-semibold text-gray-900 dark:text-white">{user.email}</p>
              )}

              <p className="mb-8 text-sm text-gray-400 dark:text-gray-500">
                Click the link in the email to verify your account.
                <br />
                Don't see it? Check your spam or junk folder.
              </p>

              <Button
                onClick={handleResend}
                loading={isSending}
                icon={RefreshCw}
                variant="outline"
                className="w-full mb-4"
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
              </Button>

              <Link
                to="/dashboard"
                className="text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              >
                Back to dashboard
              </Link>
            </>
          )}

          {/* ── VERIFYING: Loading ───────────────────────────────────────── */}
          {status === 'verifying' && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Verifying your email...</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Just a moment, please.</p>
            </>
          )}

          {/* ── SUCCESS: Verified ────────────────────────────────────────── */}
          {status === 'success' && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Email verified!</h1>
              <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                Your account is all set. You can now generate content with AI.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full"
                size="lg"
                icon={ArrowRight}
              >
                Start Creating Content
              </Button>
            </>
          )}

          {/* ── ERROR: Expired / Invalid ─────────────────────────────────── */}
          {status === 'error' && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Link expired</h1>
              <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                This verification link has expired or has already been used.
                <br />
                Request a new one below.
              </p>

              {user ? (
                <>
                  <Button
                    onClick={handleResend}
                    loading={isSending}
                    icon={RefreshCw}
                    className="w-full mb-4"
                    disabled={cooldown > 0}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send new verification email'}
                  </Button>
                  <Link
                    to="/dashboard"
                    className="text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Back to dashboard
                  </Link>
                </>
              ) : (
                <Button onClick={() => navigate('/login')} className="w-full">
                  Sign in to resend
                </Button>
              )}
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          Having trouble?{' '}
          <a href="mailto:support@contentai.com" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
