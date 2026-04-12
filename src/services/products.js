// frontend/src/services/products.js

import api from './api'

/**
 * Fetch paginated product list with optional filters.
 * filters is an object like: { category: 'mobile-phones', min_price: 500 }
 * Axios converts that object into query params automatically:
 * /api/products/?category=mobile-phones&min_price=500
 * 
 * Empty string values are filtered out to avoid sending meaningless params.
 */
export const getProducts = (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '')
  )
  return api.get('/api/products/', { params: cleanFilters }).then((res) => res.data)
}

/**
 * Fetch a single product by its slug.
 * slug example: 'samsung-galaxy-a55'
 */
export const getProduct = (slug) =>
  api.get(`/api/products/${slug}/`).then((res) => res.data)

/**
 * Fetch only featured products — used on the homepage.
 */
export const getFeaturedProducts = () =>
  api.get('/api/products/featured/').then((res) => res.data)

/**
 * Fetch all active categories — used in navbar and filter sidebar.
 */
export const getCategories = () =>
  api.get('/api/categories/').then((res) => res.data)