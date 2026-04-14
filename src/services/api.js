// frontend/src/services/api.js

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important for CORS with credentials
})

/**
 * Request interceptor — runs before EVERY request is sent.
 * Reads the JWT token from localStorage and attaches it to the
 * Authorization header automatically.
 * This means you never manually write "Authorization: Bearer ..."
 * in any component — it happens here, once, for every request.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api