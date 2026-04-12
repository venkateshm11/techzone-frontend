// frontend/src/services/orders.js

import api from './api'

export const createOrder = (data) =>
  api.post('/api/orders/', data).then((res) => res.data)

export const verifyPayment = (data) =>
  api.post('/api/orders/verify-payment/', data).then((res) => res.data)

export const getOrders = () =>
  api.get('/api/orders/list/').then((res) => res.data)

export const getOrder = (id) =>
  api.get(`/api/orders/${id}/`).then((res) => res.data)