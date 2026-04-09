import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import ToolPage from './pages/tools/ToolPage'
import VerifyEmail from './pages/auth/VerifyEmail'
import Templates from './pages/Templates'
import History from './pages/History'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import ToastProvider from './components/ui/Toast'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        {/* Public */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Legacy route — redirect to blog tool */}
          <Route path="/generate" element={<Navigate to="/tools/blog" replace />} />
          {/* AI tool platform */}
          <Route path="/tools/:toolId" element={<ToolPage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/history" element={<History />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Email verification — standalone, accessible to both auth states */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
