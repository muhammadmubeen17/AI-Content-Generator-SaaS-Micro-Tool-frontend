import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/useAuthStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    const result = await register(form.name, form.email, form.password)
    if (result.success) {
      toast.success('Account created! Check your email to verify your account.')
      navigate('/verify-email')
    }
  }

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Start generating content for free — no credit card required
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Alex Johnson"
          icon={User}
          value={form.name}
          onChange={set('name')}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          icon={Lock}
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="pt-2">
          <Button type="submit" loading={isLoading} className="w-full" size="lg">
            Create Free Account
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By signing up, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:underline">Terms</a> and{' '}
          <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Sign in
        </Link>
      </p>
    </div>
  )
}
