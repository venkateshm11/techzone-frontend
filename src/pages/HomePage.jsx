// frontend/src/pages/HomePage.jsx

import { Link } from 'react-router-dom'
import { useFeaturedProducts, useCategories } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const { data: featured, isLoading: loadingProducts } = useFeaturedProducts()
  const { data: categories } = useCategories()

  const SmartphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5h3m-3 18.75h3m2.25-4.5V5.25M7.5 19.5h9A2.25 2.25 0 0020.25 17.25V6.75A2.25 2.25 0 0018 4.5h-9a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 007.5 19.5z" />
    </svg>
  )

  const LaptopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" d="M8.25 3v1.5M12 3v1.5m4.25-1.5v1.5M21 6.75v10.632a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0021 4.5H3a2.25 2.25 0 00-2.25 2.25m19.5 0v-1.5A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v1.5" />
    </svg>
  )

  const TabletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5a2.25 2.25 0 00-2.25 2.25v15a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0015 4.5m0 0H9m6 0H9m3 18v-1.125m0-4.5v-1.5" />
    </svg>
  )

  const HeadphonesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m0 0h-3.75m3.75 0h3.75M9 15.75a3 3 0 11-6 0 3 3 0 016 0zm12 0a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const AccessoriesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3 3 0 002.353 2.353m0 0a3 3 0 003.497-3.498m0 0a3.25 3.25 0 00-2.855-2.855m0 0a3.25 3.25 0 10-4.596 4.596zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5L15.75 12l-7.5 7.5" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                Premium Tech at Best Prices
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Discover the latest mobile phones, accessories, and laptops from top brands. All verified and ready to ship.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-150"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products"
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg bg-white transition-colors duration-150"
                >
                  Browse All
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="hidden md:flex items-center justify-center h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" 
                alt="Premium Tech Products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {categories?.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, idx) => {
                const iconMap = {
                  'smartphones': SmartphoneIcon,
                  'laptops': LaptopIcon,
                  'tablets': TabletIcon,
                  'headphones': HeadphonesIcon,
                  'accessories': AccessoriesIcon,
                }
                const Icon = iconMap[cat.slug] || SmartphoneIcon

                return (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${cat.slug}`}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-6 text-center group cursor-pointer"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors" >
                        <Icon />
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Featured Products</h2>
            <Link to="/products" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
              View all
              <ChevronRightIcon />
            </Link>
          </div>

          {loadingProducts ? (
            <LoadingSpinner />
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No featured products available</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}