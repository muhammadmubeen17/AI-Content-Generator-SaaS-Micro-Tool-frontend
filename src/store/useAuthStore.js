import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authService from '../services/authService'
import * as userService from '../services/userService'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // ─── Register ────────────────────────────────────────────────────────────
      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authService.register({ name, email, password })
          localStorage.setItem('token', data.token)
          set({ user: data.user, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, error: err.message }
        }
      },

      // ─── Login ───────────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authService.login({ email, password })
          localStorage.setItem('token', data.token)
          set({ user: data.user, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (err) {
          set({ isLoading: false })
          return { success: false, error: err.message }
        }
      },

      // ─── Logout ──────────────────────────────────────────────────────────────
      logout: async () => {
        try {
          await authService.logout()
        } catch {
          // Ignore — still clear local state
        }
        localStorage.removeItem('token')
        set({ user: null, isAuthenticated: false })
      },

      // ─── Refresh user from API ────────────────────────────────────────────────
      refreshUser: async () => {
        try {
          const { data } = await authService.getMe()
          set({ user: data.user, isAuthenticated: true })
        } catch {
          localStorage.removeItem('token')
          set({ user: null, isAuthenticated: false })
        }
      },

      // ─── Update profile (from Settings page) ─────────────────────────────────
      updateProfile: async (updates) => {
        try {
          const { data } = await userService.updateProfile(updates)
          set({ user: data.user })
          return { success: true }
        } catch (err) {
          return { success: false, error: err.message }
        }
      },

      // ─── Change password ──────────────────────────────────────────────────────
      changePassword: async (currentPassword, newPassword) => {
        try {
          const { data } = await authService.changePassword({ currentPassword, newPassword })
          // Backend issues a new token after password change
          if (data.token) localStorage.setItem('token', data.token)
          return { success: true }
        } catch (err) {
          return { success: false, error: err.message }
        }
      },

      // ─── Verify email via token from link ────────────────────────────────────
      verifyEmail: async (token) => {
        try {
          const { data } = await authService.verifyEmail(token)
          localStorage.setItem('token', data.token)
          set({ user: data.user, isAuthenticated: true })
          return { success: true }
        } catch (err) {
          return { success: false, error: err.message }
        }
      },

      // ─── Resend verification email ────────────────────────────────────────────
      resendVerification: async () => {
        try {
          await authService.resendVerification()
          return { success: true }
        } catch (err) {
          return { success: false, error: err.message }
        }
      },

      // ─── Sync credits after generation ───────────────────────────────────────
      updateUser: (updates) => {
        set((state) => ({ user: state.user ? { ...state.user, ...updates } : null }))
      },

      decrementCredits: (cost = 1) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, credits: Math.max(0, state.user.credits - cost) }
            : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
