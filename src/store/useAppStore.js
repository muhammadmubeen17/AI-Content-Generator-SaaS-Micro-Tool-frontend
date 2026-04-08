import { create } from 'zustand'

/* Read persisted preference (falls back to false = light) */
const storedDark = (() => {
  try {
    return JSON.parse(localStorage.getItem('darkMode')) === true
  } catch {
    return false
  }
})()

/* Apply the class immediately so there is no flash of wrong theme */
if (storedDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const useAppStore = create((set) => ({
  darkMode: storedDark,
  sidebarCollapsed: false,

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('darkMode', JSON.stringify(next))
      return { darkMode: next }
    }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
}))

export default useAppStore

