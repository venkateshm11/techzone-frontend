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
        <p className="text-5xl">🛒</p>
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">Add some products to get started</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl
            hover:bg-blue-700 transition-colors mt-2"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Shopping Cart
          <span className="text-gray-400 font-normal text-lg ml-2">
            ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm p-4 flex gap-4"
              >
                {/* Product image */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📱
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="font-semibold text-gray-800 text-sm hover:text-blue-600
                      line-clamp-2 leading-snug"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{item.product.brand}</p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50
                          disabled:opacity-40 font-semibold"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || loading}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50
                          disabled:opacity-40 font-semibold"
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="font-bold text-gray-900">
                      ₹{Number(item.item_total).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                    className="text-xs text-red-500 hover:text-red-700 mt-2
                      disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.item_count} items)</span>
                  <span>₹{Number(cart.cart_total).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{Number(cart.cart_total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 text-white font-semibold py-3
                  rounded-xl hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-sm text-blue-600
                  hover:underline mt-4"
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