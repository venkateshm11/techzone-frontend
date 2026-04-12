// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const [searchInput, setSearchInput] = useState(search)
  const searchTimeoutRef = useRef(null)

  const filters = {}
  if (category) filters.category = category
  if (search) filters.search = search

  const { data, isLoading, isError } = useProducts(filters)
  const { data: categories } = useCategories()

  useEffect(() => {
    setSearchInput(search)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }, [search])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchInput === search) {
      return
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateFilter('search', searchInput)
    }, 300)

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

  const resultCount = data?.count ?? data?.length ?? 0
  const results = data?.results ?? data ?? []

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search bar with icon */}
        <div className="mb-8 relative">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
          />
        </div>

        <div className="flex gap-6">

          {/* Filter Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors">
                  Clear all
                </button>
              </div>

              <div className="space-y-0.5">
                {/* All Products button */}
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                    !category 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Products
                </button>

                {/* Divider */}
                {categories && categories.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 my-3" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 px-3 py-2">Categories</p>
                  </>
                )}

                {/* Category buttons */}
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                        category === cat.slug
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 px-3 py-2">Loading categories...</div>
                )}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results count and sort */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">
                {resultCount} result{resultCount !== 1 ? 's' : ''} found
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
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                <div className="text-gray-200 text-5xl mb-4">○</div>
                <p className="text-gray-800 font-semibold text-base mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your search or category filters</p>
                <button 
                  onClick={clearFilters} 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Products grid */}
            {!isLoading && !isError && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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