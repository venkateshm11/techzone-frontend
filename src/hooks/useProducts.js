// frontend/src/hooks/useProducts.js

import { useQuery } from '@tanstack/react-query'
import { getProducts, getProduct, getFeaturedProducts, getCategories } from '../services/products'

/**
 * Hook for the products listing page.
 * Creates a stable queryKey by converting filters to a sorted string.
 * Example: { category: 'mobile-phones', search: 'iphone' } 
 * becomes queryKey: ['products', 'category:mobile-phones,search:iphone']
 */
export const useProducts = (filters = {}) => {
  // Create a stable query key by sorting filter entries
  const filterKey = Object.entries(filters)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, val]) => `${key}:${val}`)
    .join(',')

  return useQuery({
    queryKey: ['products', filterKey],
    queryFn : () => getProducts(filters),
  })
}

/**
 * Hook for a single product detail page.
 * enabled: !!slug means the query only runs when slug is not empty.
 */
export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn : () => getProduct(slug),
    enabled : !!slug,
  })
}

/**
 * Hook for featured products on the homepage.
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn : getFeaturedProducts,
  })
}

/**
 * Hook for categories — used in navbar and filter sidebar.
 * staleTime is longer here because categories rarely change.
 */
export const useCategories = () => {
  return useQuery({
    queryKey : ['categories'],
    queryFn  : getCategories,
    staleTime: 1000 * 60 * 30,
  })
}