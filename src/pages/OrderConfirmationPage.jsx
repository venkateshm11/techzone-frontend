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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 max-w-lg w-full text-center">

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Thank you for your purchase. We'll notify you when your order ships.
        </p>

        {/* Order details */}
        <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-semibold text-gray-800 font-mono">#{order?.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-green-700">Confirmed</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-semibold text-green-700">Paid</span>
          </div>
          <div className="border-t border-gray-200 pt-2.5 flex justify-between">
            <span className="text-gray-700 font-semibold">Total Paid</span>
            <span className="font-bold text-gray-900 text-base">
              ₹{Number(order?.total_amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Items summary */}
        {order?.items?.length > 0 && (
          <div className="text-left mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1 flex-1">
                    {item.product.name}
                  </span>
                  <span className="text-gray-500 ml-2">×{item.quantity}</span>
                  <span className="font-medium text-gray-900 ml-2 w-20 text-right">
                    ₹{Number(item.item_total).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery address */}
        {order?.shipping_address && (
          <div className="text-left mb-8 bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Delivering to
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {order.shipping_address.name}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {order.shipping_address.phone}
            </p>
            <p className="text-xs text-gray-600">
              {order.shipping_address.street}
            </p>
            <p className="text-xs text-gray-600">
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="/orders"
            className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2.5 rounded-lg bg-white transition-colors text-sm"
          >
            View Orders
          </Link>
          <Link
            to="/products"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Shop More
          </Link>
        </div>

      </div>
    </div>
  )
}