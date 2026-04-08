import { create } from 'zustand'

const useAppStore = create((set) => ({
  darkMode: false,
  sidebarCollapsed: false,

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { darkMode: next }
    }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
}))

export default useAppStore
