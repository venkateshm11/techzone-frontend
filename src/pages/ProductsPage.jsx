// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import CategoryFilter from '../components/CategoryFilter'
import PriceFilter from '../components/PriceFilter'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''
  
  const [searchInput, setSearchInput] = useState(search)
  const searchTimeoutRef = useRef(null)

  const filters = {}
  if (category) filters.category = category
  if (search) filters.search = search
  if (minPrice) filters.min_price = minPrice
  if (maxPrice) filters.max_price = maxPrice

  const { data, isLoading, isError } = useProducts(filters)

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

  const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-2.15 0-4.229.822-5.95 2.288m11.9 0A9.97 9.97 0 0123 12c0 5.52-4.48 10-10 10S3 17.52 3 12s4.48-10 10-10m0 0c2.15 0 4.229.822 5.95 2.288M9 11.25a3 3 0 106 0 3 3 0 00-6 0zm8.593-3.07a.75.75 0 10-1.186-.918 5.001 5.001 0 11-7.814 0 .75.75 0 10-1.186.918A6.502 6.502 0 1021 12a6.464 6.464 0 01-.407 2.18z" />
    </svg>
  )

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4 flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FilterIcon />
            Filters
          </button>
          {(category || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-2.5 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-6">

          {/* Filter Sidebar - Desktop & Mobile Drawer */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowFilters(false)} />
          )}
          
          <aside className={`${
            showFilters ? 'block' : 'hidden'
          } md:block fixed md:relative left-0 top-0 w-72 md:w-56 h-screen md:h-auto bg-white md:rounded-xl border border-gray-100 shadow-lg md:shadow-sm md:sticky md:top-24 z-50 md:shrink-0 md:self-start`}>
            
            <div className="p-5 space-y-6 h-screen md:h-auto md:overflow-visible overflow-y-auto">
              {/* Close button for mobile */}
              <div className="md:hidden flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Desktop heading */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors">
                  Clear all
                </button>
              </div>

              {/* Category Filter Component */}
              <CategoryFilter />

              {/* Price Filter Component */}
              <PriceFilter />
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