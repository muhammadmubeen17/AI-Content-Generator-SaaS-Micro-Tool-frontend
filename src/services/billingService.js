import api from './api'

export const createCheckoutSession = (planId) =>
  api.post('/billing/create-checkout-session', { planId })

export const downgrade = () =>
  api.post('/billing/downgrade')

export const purchaseCredits = (packId) =>
  api.post('/billing/purchase-credits', { packId })

export const getCreditHistory = (params = {}) =>
  api.get('/billing/credit-history', { params })

export const getTransactions = () =>
  api.get('/billing/transactions')
