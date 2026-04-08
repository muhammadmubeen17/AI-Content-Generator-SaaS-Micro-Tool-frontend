import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MOCK_USER = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: null,
  plan: 'pro',
  credits: 142,
  totalCredits: 200,
  createdAt: '2024-01-15',
}

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1000))
        if (email && password) {
          set({ user: { ...MOCK_USER, email }, isAuthenticated: true, isLoading: false })
          return { success: true }
        }
        set({ isLoading: false })
        return { success: false, error: 'Invalid credentials' }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 1200))
        set({
          user: { ...MOCK_USER, name, email },
          isAuthenticated: true,
          isLoading: false,
        })
        return { success: true }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }))
      },

      decrementCredits: () => {
        set((state) => ({
          user: state.user
            ? { ...state.user, credits: Math.max(0, state.user.credits - 1) }
            : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore
