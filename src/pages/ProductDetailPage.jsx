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
  const [feedback, setFeedback]   = useState('')  // success or error message

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

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="Product not found." />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          {product?.category && (
            <>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hover:text-blue-600"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-800 font-medium">{product?.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">

            {/* Product Image */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {product?.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">📱</span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-1">
                  {product?.brand}
                </p>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {product?.name}
                </h1>

                {/* Price */}
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{Number(product?.price).toLocaleString('en-IN')}
                  </span>
                  {product?.compare_price && (
                    <span className="text-lg text-gray-400 line-through mb-0.5">
                      ₹{Number(product?.compare_price).toLocaleString('en-IN')}
                    </span>
                  )}
                  {product?.discount_percent > 0 && (
                    <span className="text-green-600 font-bold text-lg mb-0.5">
                      {product.discount_percent}% off
                    </span>
                  )}
                </div>

                {/* Stock badge */}
                <p className={`text-sm font-semibold mb-6 ${
                  product?.stock > 10  ? 'text-green-600'
                  : product?.stock > 0 ? 'text-orange-500'
                  : 'text-red-500'
                }`}>
                  {product?.stock > 10
                    ? '✓ In Stock'
                    : product?.stock > 0
                    ? `⚠ Only ${product.stock} left`
                    : '✗ Out of Stock'}
                </p>

                {product?.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}

                {/* Quantity selector */}
                {product?.is_in_stock && (
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-50
                          font-semibold text-lg"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-50
                          font-semibold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add to cart button + feedback */}
              <div className="space-y-3">
                {feedback === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-700
                    px-4 py-3 rounded-xl text-sm font-medium text-center">
                    ✓ Added to cart!
                  </div>
                )}
                {feedback === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700
                    px-4 py-3 rounded-xl text-sm font-medium text-center">
                    ✗ Failed to add. Try again.
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!product?.is_in_stock || loading}
                  className="w-full bg-blue-600 text-white font-semibold py-3
                    rounded-xl hover:bg-blue-700 disabled:bg-gray-300
                    disabled:cursor-not-allowed transition-colors"
                >
                  {!product?.is_in_stock
                    ? 'Out of Stock'
                    : loading
                    ? 'Adding...'
                    : isLoggedIn
                    ? 'Add to Cart'
                    : 'Login to Add to Cart'}
                </button>

                {isLoggedIn && (
                  <Link
                    to="/cart"
                    className="block w-full text-center border-2 border-blue-600
                      text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50
                      transition-colors"
                  >
                    View Cart
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}