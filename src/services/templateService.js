import api from './api'

export const getTemplates = (category) =>
  api.get('/templates', { params: category ? { category } : {} })

export const getTemplateById = (id) =>
  api.get(`/templates/${id}`)
