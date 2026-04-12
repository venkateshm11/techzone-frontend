// frontend/src/services/auth.js

import api from './api'

export const loginUser = (email, password) =>
  api.post('/api/auth/token/', { email, password }).then((res) => res.data)

export const registerUser = (data) =>
  api.post('/api/auth/register/', data).then((res) => res.data)

export const refreshToken = (refresh) =>
  api.post('/api/auth/token/refresh/', { refresh }).then((res) => res.data)

export const getProfile = () =>
  api.get('/api/auth/profile/').then((res) => res.data)