import { create } from 'zustand'
import * as templateService from '../services/templateService'

const useTemplateStore = create((set) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async (category) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await templateService.getTemplates(category)
      set({ templates: data.templates, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))

export default useTemplateStore
