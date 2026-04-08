import { create } from 'zustand'
import * as contentService from '../services/contentService'

const useContentStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────────────────────
  history: [],
  historyTotal: 0,
  historyPage: 1,
  historyLoading: false,

  generatedContent: null,
  isGenerating: false,

  selectedHistoryItem: null,
  stats: null,

  // ─── Generate content ────────────────────────────────────────────────────────
  generateContent: async (params) => {
    set({ isGenerating: true, generatedContent: null })
    try {
      const { data } = await contentService.generateContent({
        contentType: params.contentType,
        tone: params.tone,
        length: params.length,
        prompt: params.prompt,
        templateId: params.templateId || undefined,
      })

      const item = {
        id: data.content.id,
        type: data.content.type,
        title: data.content.prompt?.slice(0, 80) || 'Generated Content',
        preview: data.content.output?.slice(0, 150) + '...',
        content: data.content.output,
        tone: data.content.tone,
        length: data.content.length,
        wordCount: data.content.wordCount,
        tokensUsed: data.content.tokensUsed,
        creditsDeducted: data.content.creditsDeducted,
        createdAt: data.content.createdAt,
      }

      // Prepend to local history list so UI reflects immediately
      set((state) => ({
        generatedContent: item,
        history: [item, ...state.history],
        isGenerating: false,
      }))

      return { success: true, content: item, creditsRemaining: data.creditsRemaining }
    } catch (err) {
      set({ isGenerating: false })
      return { success: false, error: err.message }
    }
  },

  // ─── Fetch history from API ──────────────────────────────────────────────────
  fetchHistory: async (params = {}) => {
    set({ historyLoading: true })
    try {
      const { data } = await contentService.getHistory({
        page: params.page || 1,
        limit: params.limit || 10,
        type: params.type || undefined,
        search: params.search || undefined,
      })

      set({
        history: data.data,
        historyTotal: data.pagination.total,
        historyPage: data.pagination.page,
        historyLoading: false,
      })
    } catch {
      set({ historyLoading: false })
    }
  },

  // ─── Get single content item (full output) ────────────────────────────────
  fetchContentById: async (id) => {
    try {
      const { data } = await contentService.getContentById(id)
      return data.content
    } catch {
      return null
    }
  },

  // ─── Delete item ─────────────────────────────────────────────────────────────
  deleteHistoryItem: async (id) => {
    try {
      await contentService.deleteContent(id)
      set((state) => ({
        history: state.history.filter((h) => h.id !== id || h._id !== id),
      }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  // ─── Fetch stats ──────────────────────────────────────────────────────────────
  fetchStats: async () => {
    try {
      const { data } = await contentService.getContentStats()
      set({ stats: data })
    } catch {
      // silently fail
    }
  },

  // ─── Local helpers ────────────────────────────────────────────────────────────
  setSelectedHistoryItem: (item) => set({ selectedHistoryItem: item }),
  clearGenerated: () => set({ generatedContent: null }),
}))

export default useContentStore
