// frontend/src/services/cart.js

import api from './api'

export const getCart = () =>
  api.get('/api/cart/').then((res) => res.data)

export const addToCart = (productId, quantity = 1) =>
  api.post('/api/cart/', { product_id: productId, quantity }).then((res) => res.data)

export const updateCartItem = (itemId, quantity) =>
  api.put(`/api/cart/${itemId}/`, { quantity }).then((res) => res.data)

export const removeCartItem = (itemId) =>
  api.delete(`/api/cart/${itemId}/`)

export const clearCart = () =>
  api.delete('/api/cart/clear/')