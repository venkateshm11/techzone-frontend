// frontend/src/pages/CheckoutPage.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder, verifyPayment } from '../services/orders'
import { loadRazorpayScript } from '../utils/loadRazorpay'

const INITIAL_ADDRESS = {
  name: '', phone: '', street: '', city: '', state: '', pincode: ''
}

export default function CheckoutPage() {
  const [address, setAddress]   = useState(INITIAL_ADDRESS)
  const [notes, setNotes]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const { cart, emptyCart }  = useCart()
  const { user }             = useAuth()
  const navigate             = useNavigate()

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Step 1: Load the Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setError('Payment gateway failed to load. Check your internet connection.')
        setLoading(false)
        return
      }

      // Step 2: Create order in Django
      // Django creates the Order row and a Razorpay order
      // Returns the razorpay_order_id and amount we need for the widget
      const orderData = await createOrder({
        shipping_address: address,
        notes,
      })

      // Step 3: Configure and open Razorpay payment widget
      // This is the popup where the customer enters card/UPI details
      const options = {
        key         : orderData.razorpay_key_id,
        amount      : orderData.amount,      // in paise
        currency    : orderData.currency,
        name        : 'TechZone',
        description : `Order #${orderData.order_id}`,
        order_id    : orderData.razorpay_order_id,

        // Pre-fill customer details so they don't have to type again
        prefill: {
          name : user?.name,
          email: user?.email,
          contact: address.phone,
        },

        theme: { color: '#2563eb' },  // blue-600 to match our UI

        // Step 4: Called by Razorpay after successful payment
        // response contains the three values we need to verify
        handler: async (response) => {
          try {
            // Step 5: Send to Django for cryptographic verification
            // NEVER skip this step — this is what confirms the payment is real
            const result = await verifyPayment({
              razorpay_order_id  : response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature : response.razorpay_signature,
            })

            // Step 6: Payment verified — clear cart and go to confirmation
            await emptyCart()
            navigate(`/orders/${result.order_id}/confirmation`)

          } catch (verifyError) {
            setError('Payment verification failed. Contact support with your payment ID: '
              + response.razorpay_payment_id)
            setLoading(false)
          }
        },

        // Called when customer closes the Razorpay popup without paying
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled. Your order has not been placed.')
            setLoading(false)
          }
        }
      }

      const razorpayInstance = new window.Razorpay(options)
      razorpayInstance.open()

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(errorMsg)
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Shipping Address Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-6">Delivery Address</h2>

                <div className="space-y-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleChange}
                      required
                      placeholder="Ravi Kumar"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      required
                      placeholder="9876543210"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400"
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      required
                      placeholder="12 MG Road, Apartment 4B"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400"
                    />
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required
                        placeholder="Vijayawada"
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                        placeholder="Andhra Pradesh"
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleChange}
                      required
                      placeholder="520001"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400"
                    />
                  </div>

                  {/* Delivery notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Call before delivery, leave at door, etc."
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-20">
                <h2 className="font-semibold text-gray-800 mb-6">Order Summary</h2>

                {/* Items list */}
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-gray-600">
                      <span className="line-clamp-2 flex-1 mr-2">
                        {item.product.name}
                      </span>
                      <span className="text-gray-400">×{item.quantity}</span>
                      <span className="font-semibold text-gray-800 ml-3 w-24 text-right">
                        ₹{Number(item.item_total).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{Number(cart.cart_total).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 pb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{Number(cart.cart_total).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg text-xs mb-4">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors duration-150 disabled:cursor-not-allowed mb-3"
                >
                  {loading ? 'Processing...' : `Pay ₹${Number(cart.cart_total).toLocaleString('en-IN')}`}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Secured by Razorpay • UPI, Card, Wallet
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}