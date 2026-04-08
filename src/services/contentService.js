import api from './api'

export const generateContent = (params) =>
  api.post('/content/generate', params)

export const getHistory = (params = {}) =>
  api.get('/content/history', { params })

export const getContentById = (id) =>
  api.get(`/content/${id}`)

export const deleteContent = (id) =>
  api.delete(`/content/${id}`)

export const toggleFavorite = (id) =>
  api.patch(`/content/${id}/favorite`)

export const getContentStats = () =>
  api.get('/content/stats')
