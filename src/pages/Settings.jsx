import { useState } from 'react'
import { User, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import Avatar from '../components/ui/Avatar'
import { PLANS } from '../constants'

export default function Settings() {
  const { user, updateProfile, changePassword } = useAuthStore()

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowCredits: true,
    newsletter: false,
    productUpdates: true,
  })

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!profileForm.name.trim()) { toast.error('Name is required'); return }
    setSavingProfile(true)
    const result = await updateProfile({ name: profileForm.name, email: profileForm.email })
    setSavingProfile(false)
    if (result.success) {
      toast.success('Profile updated!')
    } else {
      toast.error(result.error || 'Update failed')
    }
  }

  const handleSavePassword = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!passwordForm.current) errs.current = 'Required'
    if (!passwordForm.newPass || passwordForm.newPass.length < 8) errs.newPass = 'Min 8 characters'
    if (passwordForm.newPass !== passwordForm.confirm) errs.confirm = 'Passwords do not match'
    if (Object.keys(errs).length) { setPasswordErrors(errs); return }
    setPasswordErrors({})
    setSavingPassword(true)
    const result = await changePassword(passwordForm.current, passwordForm.newPass)
    setSavingPassword(false)
    if (result.success) {
      setPasswordForm({ current: '', newPass: '', confirm: '' })
      toast.success('Password changed!')
    } else {
      toast.error(result.error || 'Password change failed')
    }
  }

  const currentPlan = PLANS.find((p) => p.id === user?.plan)
  const creditsUsed = (user?.totalCredits ?? 0) - (user?.credits ?? 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and security.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader title="Profile Information" subtitle="Update your personal details" />
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center gap-5">
            <Avatar name={user?.name} size="xl" />
            <div>
              <Button variant="secondary" size="sm" type="button" onClick={() => toast('Feature coming soon!')}>
                Change Avatar
              </Button>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">JPG, PNG up to 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              icon={User}
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={savingProfile}>Save Changes</Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader title="Change Password" subtitle="Use a strong password with at least 8 characters" />
        <form onSubmit={handleSavePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
            error={passwordErrors.current}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              placeholder="Min. 8 characters"
              value={passwordForm.newPass}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
              error={passwordErrors.newPass}
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              placeholder="Repeat new password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              error={passwordErrors.confirm}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={savingPassword}>Update Password</Button>
          </div>
        </form>
      </Card>

      {/* Plan & Usage */}
      <Card>
        <CardHeader title="Plan & Usage" />
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-gray-900 dark:text-white">{currentPlan?.name} Plan</span>
            <Badge variant={user?.plan === 'pro' ? 'primary' : user?.plan === 'premium' ? 'purple' : 'default'}>
              {user?.plan?.toUpperCase()}
            </Badge>
            {user?.subscriptionStatus === 'active' && <Badge variant="success">Active</Badge>}
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">AI Credits Used</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {creditsUsed} / {user?.totalCredits}
              </span>
            </div>
            <ProgressBar
              value={creditsUsed}
              max={user?.totalCredits ?? 1}
              showPercent={false}
              color={user?.credits < 20 ? 'red' : user?.credits < 50 ? 'yellow' : 'indigo'}
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {user?.credits} credits remaining.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Plan features</p>
            <ul className="space-y-1.5">
              {currentPlan?.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Notification Preferences" subtitle="Choose what notifications you receive" />
        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email alerts', desc: 'Get notified when content is ready' },
            { key: 'lowCredits', label: 'Low credits warning', desc: 'Alert when credits drop below 20%' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Tips, templates, and AI writing news' },
            { key: 'productUpdates', label: 'Product updates', desc: 'New features and improvements' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => {
                  setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                  toast.success('Preference saved')
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications[key] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${notifications[key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <Card>
        <CardHeader title="Danger Zone" />
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10">
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Delete Account</p>
            <p className="text-xs text-red-600 dark:text-red-400">
              Permanently delete your account and all data. This cannot be undone.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={() => toast.error('Contact support to delete your account.')}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  )
}
