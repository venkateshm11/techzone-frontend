// frontend/src/pages/ProductDetailPage.jsx

import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function ProductDetailPage() {
  const { slug }     = useParams()
  const navigate     = useNavigate()
  const { isLoggedIn }       = useAuth()
  const { addItem, loading } = useCart()

  const [quantity, setQuantity]   = useState(1)
  const [feedback, setFeedback]   = useState('')

  const { data: product, isLoading, isError } = useProduct(slug)

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/products/${slug}` } })
      return
    }

    try {
      await addItem(product.id, quantity)
      setFeedback('success')
      setTimeout(() => setFeedback(''), 2500)
    } catch (err) {
      setFeedback('error')
      setTimeout(() => setFeedback(''), 2500)
    }
  }

  const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5L15.75 12l-7.5 7.5" />
    </svg>
  )

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="Product not found." />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRightIcon />
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <ChevronRightIcon />
          {product?.category && (
            <>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-blue-600 transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRightIcon />
            </>
          )}
          <span className="text-gray-600">{product?.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Product Image */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-center min-h-96">
            {product?.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg" />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
                {product?.brand}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product?.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{Number(product?.price).toLocaleString('en-IN')}
                </span>
                {product?.compare_price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{Number(product?.compare_price).toLocaleString('en-IN')}
                  </span>
                )}
                {product?.discount_percent > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-green-700 bg-green-50 border border-green-100 ml-1">
                    {product.discount_percent}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <p className={`text-xs font-semibold mb-6 ${
                product?.stock > 10  ? 'text-green-600'
                : product?.stock > 0 ? 'text-amber-600'
                : 'text-red-600'
              }`}>
                {product?.stock > 10
                  ? 'In Stock'
                  : product?.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </p>
            </div>

            {/* Description */}
            {product?.description && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 my-6" />

            {/* Quantity Selector */}
            {product?.is_in_stock && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-50 font-semibold text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold text-gray-800 min-w-12 text-center border-l border-r border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-50 font-semibold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Feedback Messages */}
            {feedback === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3.5 py-2.5 rounded-lg text-sm font-medium text-center mb-3">
                Added to cart successfully
              </div>
            )}
            {feedback === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg text-sm font-medium text-center mb-3">
                Failed to add to cart. Please try again.
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product?.is_in_stock || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 disabled:cursor-not-allowed mb-3"
            >
              {!product?.is_in_stock
                ? 'Out of Stock'
                : loading
                ? 'Adding...'
                : 'Add to Cart'}
            </button>

            {/* View Cart Link */}
            {isLoggedIn && (
              <Link
                to="/cart"
                className="inline-flex items-center justify-center border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg bg-white transition-colors duration-150"
              >
                View Cart
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}