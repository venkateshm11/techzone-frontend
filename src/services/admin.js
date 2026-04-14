// frontend/src/services/admin.js

import api from './api'

/**
 * Check how many admin accounts exist and if more can be created.
 */
export const checkAdminCount = () => {
  return api.get('/api/auth/admin-count/').then((res) => res.data)
}

/**
 * Create admin account via frontend.
 * This endpoint allows up to 5 admin accounts.
 * Subsequent calls after 5 admins exist will get a 403 Forbidden.
 */
export const bootstrapSuperuser = (email, password, name) => {
  return api.post('/api/auth/bootstrap-superuser/', {
    email,
    password,
    name,  // Full name field
  }).then((res) => res.data)
}

export const getAdminStats = () =>
  api.get('/api/admin/stats/').then((res) => res.data)

export const getAdminProducts = (params = {}) =>
  api.get('/api/admin/products/', { params }).then((res) => res.data)

export const getAdminProduct = (id) =>
  api.get(`/api/admin/products/${id}/`).then((res) => res.data)

export const createProduct = (data) =>
  api.post('/api/admin/products/', data).then((res) => res.data)

export const updateProduct = (id, data) =>
  api.put(`/api/admin/products/${id}/`, data).then((res) => res.data)

export const deleteProduct = (id) =>
  api.delete(`/api/admin/products/${id}/`)

export const getAdminOrders = (params = {}) =>
  api.get('/api/admin/orders/', { params }).then((res) => res.data)

export const updateOrderStatus = (id, status) =>
  api.put(`/api/admin/orders/${id}/status/`, { status }).then((res) => res.data)