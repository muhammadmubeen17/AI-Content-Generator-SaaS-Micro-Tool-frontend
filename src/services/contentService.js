import api from './api'

// Mock delay helper
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export const generateContent = async (params) => {
  // Replace with: return api.post('/generate-content', params)
  await delay(2000)
  return { data: { content: 'Mock generated content...', wordCount: 120 } }
}

export const getTemplates = async () => {
  // Replace with: return api.get('/templates')
  await delay(500)
  return { data: [] }
}

export const getHistory = async (page = 1, filters = {}) => {
  // Replace with: return api.get('/history', { params: { page, ...filters } })
  await delay(600)
  return { data: { items: [], total: 0, page } }
}

export const deleteHistoryItem = async (id) => {
  // Replace with: return api.delete(`/history/${id}`)
  await delay(300)
  return { data: { success: true } }
}

export const getBillingInfo = async () => {
  // Replace with: return api.get('/billing')
  await delay(500)
  return { data: { plan: 'pro', credits: 142, nextRenewal: '2025-02-01' } }
}

export const upgradePlan = async (planId) => {
  // Replace with: return api.post('/billing/upgrade', { planId })
  await delay(1500)
  return { data: { success: true, sessionUrl: '#' } }
}
