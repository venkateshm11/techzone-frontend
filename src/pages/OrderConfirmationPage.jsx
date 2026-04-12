// frontend/src/pages/OrderConfirmationPage.jsx

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from '../services/orders'
import LoadingSpinner from '../components/LoadingSpinner'

export default function OrderConfirmationPage() {
  const { id } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn : () => getOrder(id),
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-lg w-full text-center">

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center
          justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase. We'll notify you when it ships.
        </p>

        {/* Order details */}
        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-semibold text-gray-800">#{order?.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-green-600">{order?.status}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-green-600">{order?.payment_status}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-gray-900">
              ₹{Number(order?.total_amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Items summary */}
        {order?.items?.length > 0 && (
          <div className="text-left mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Items Ordered</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name}
                    <span className="text-gray-400"> ×{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    ₹{Number(item.item_total).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery address */}
        {order?.shipping_address && (
          <div className="text-left mb-6 bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Delivering to
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_address.name} • {order.shipping_address.phone}
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_address.street}, {order.shipping_address.city}
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_address.state} — {order.shipping_address.pincode}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="/orders"
            className="flex-1 border-2 border-blue-600 text-blue-600
              font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors
              text-sm"
          >
            View All Orders
          </Link>
          <Link
            to="/products"
            className="flex-1 bg-blue-600 text-white font-semibold py-3
              rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            Shop More
          </Link>
        </div>

      </div>
    </div>
  )
}