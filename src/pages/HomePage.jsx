// frontend/src/pages/HomePage.jsx

import { Link } from 'react-router-dom'
import { useFeaturedProducts, useCategories } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const { data: featured, isLoading: loadingProducts } = useFeaturedProducts()
  const { data: categories } = useCategories()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-gray-600 to-green-800 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to TechZone
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Mobiles, Accessories & Laptop Gear — All in One Place
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      {categories?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-3xl mb-2">📦</div>
                <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline">
            View all →
          </Link>
        </div>

        {loadingProducts ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}