import api from './api'

export const register = (data) =>
  api.post('/auth/register', data)

export const login = (data) =>
  api.post('/auth/login', data)

export const logout = () =>
  api.post('/auth/logout')

export const getMe = () =>
  api.get('/auth/me')

export const changePassword = (data) =>
  api.patch('/auth/change-password', data)

export const verifyEmail = (token) =>
  api.get(`/auth/verify-email/${token}`)

export const resendVerification = () =>
  api.post('/auth/resend-verification')
