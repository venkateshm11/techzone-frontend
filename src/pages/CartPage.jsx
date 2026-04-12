// frontend/src/pages/CartPage.jsx

import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()
  const navigate = useNavigate()

  if (loading && cart.items.length === 0) return <LoadingSpinner />

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <h2 className="text-xl font-semibold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">Add some products to get started</p>
        <Link
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors mt-4"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Shopping Cart
          <span className="text-gray-400 font-normal text-base ml-2">
            ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow duration-200"
              >
                {/* Product image */}
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex-center">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="font-semibold text-gray-800 text-sm hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{item.product.brand}</p>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                      >
                        −
                      </button>
                      <span className="px-2.5 py-1.5 text-sm font-semibold min-w-8 text-center border-l border-r border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || loading}
                        className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="font-bold text-gray-900 text-sm">
                      ₹{Number(item.item_total).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                    className="text-xs text-gray-400 hover:text-red-600 mt-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-20">
              <h2 className="font-semibold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{Number(cart.cart_total).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-gray-900">₹{Number(cart.cart_total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-150 mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}