import api from './api'

export const createCheckoutSession = (planId) =>
  api.post('/billing/create-checkout-session', { planId })

export const getTransactions = () =>
  api.get('/billing/transactions')
