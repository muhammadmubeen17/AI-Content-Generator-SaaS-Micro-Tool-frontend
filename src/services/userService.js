import api from './api'

export const getProfile = () =>
  api.get('/user/profile')

export const updateProfile = (data) =>
  api.patch('/user/profile', data)

export const getCredits = () =>
  api.get('/user/credits')

export const getDashboardStats = () =>
  api.get('/user/dashboard-stats')
