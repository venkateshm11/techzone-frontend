// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get current filter values from URL
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''

  // Separate state for search input to implement debouncing
  const [searchInput, setSearchInput] = useState(search)
  const searchTimeoutRef = useRef(null)

  // Create filters object with only meaningful values (not empty strings)
  const filters = {}
  if (category) filters.category = category
  if (search) filters.search = search

  const { data, isLoading, isError } = useProducts(filters)
  const { data: categories } = useCategories()

  // When URL changes (from navigation, back/forward), sync search input
  useEffect(() => {
    setSearchInput(search)
    // Clear any pending search timeout when URL changes
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }, [search])

  // Debounce search input: wait 500ms after user stops typing before updating URL
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchInput === search) {
      // Already in sync, no need to update
      return
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateFilter('search', searchInput)
    }, 500)

    return () => clearTimeout(searchTimeoutRef.current)
  }, [searchInput, search])

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams({})
  }

  // Count results (handle both paginated and non-paginated responses)
  const resultCount = data?.count ?? data?.length ?? 0
  const results = data?.results ?? data ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-6">

          {/* Filter Sidebar - Category Only */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">Categories</h3>
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">
                  Clear
                </button>
              </div>

              <div className="space-y-2">
                {/* All Products button */}
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    !category 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>

                {/* Category buttons */}
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        category === cat.slug
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-gray-400">Loading categories...</div>
                )}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">
                {resultCount} product{resultCount !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Loading state */}
            {isLoading && (
              <LoadingSpinner />
            )}

            {/* Error state */}
            {isError && (
              <ErrorMessage message="Failed to load products. Is the backend server running?" />
            )}

            {/* No results state */}
            {!isLoading && !isError && results.length === 0 && (
              <div className="text-center py-20">
                <p className="text-5xl mb-3">🔍</p>
                <p className="text-gray-600 font-medium text-lg mb-4">No products found</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your search or category filters</p>
                <button 
                  onClick={clearFilters} 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Products grid */}
            {!isLoading && !isError && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  )
}