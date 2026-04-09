import { create } from 'zustand'
import * as contentService from '../services/contentService'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const useContentStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────────────────────
  history: [],
  historyTotal: 0,
  historyPage: 1,
  historyLoading: false,

  generatedContent: null,
  isGenerating: false,
  streamedText: '',

  selectedHistoryItem: null,
  stats: null,

  // ─── Stream content (SSE) ─────────────────────────────────────────────────
  streamContent: async (params) => {
    set({ isGenerating: true, generatedContent: null, streamedText: '' })
    const token = localStorage.getItem('token')

    let response
    try {
      response = await fetch(`${API_BASE}/content/generate-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          contentType: params.contentType,
          tone: params.tone,
          length: params.length,
          prompt: params.prompt,
          templateId: params.templateId || undefined,
        }),
      })
    } catch (err) {
      set({ isGenerating: false })
      return { success: false, error: err.message }
    }

    // Pre-stream HTTP errors (validation, auth, credits)
    if (!response.ok) {
      let message = 'Generation failed.'
      try {
        const json = await response.json()
        message = json.message || message
      } catch {}
      set({ isGenerating: false })
      return { success: false, error: message }
    }

    // Read SSE stream
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let result = null

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          let parsed
          try { parsed = JSON.parse(line.slice(6)) } catch { continue }

          if (parsed.chunk !== undefined) {
            set((state) => ({ streamedText: state.streamedText + parsed.chunk }))
          } else if (parsed.error) {
            set({ isGenerating: false })
            return { success: false, error: parsed.error }
          } else if (parsed.done) {
            result = parsed
          }
        }
      }
    } catch (err) {
      set({ isGenerating: false })
      return { success: false, error: err.message }
    }

    if (!result) {
      set({ isGenerating: false })
      return { success: false, error: 'Stream ended unexpectedly.' }
    }

    const finalText = get().streamedText
    const item = {
      id: result.contentId,
      content: finalText,
      wordCount: result.wordCount,
    }

    set((state) => ({
      generatedContent: item,
      history: [item, ...state.history],
      isGenerating: false,
    }))

    return { success: true, content: item, creditsRemaining: result.creditsRemaining }
  },

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
  clearGenerated: () => set({ generatedContent: null, streamedText: '' }),
}))

export default useContentStore
