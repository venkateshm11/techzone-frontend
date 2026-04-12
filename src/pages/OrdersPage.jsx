// frontend/src/pages/OrdersPage.jsx

import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import OrderStatusBadge from '../components/OrderStatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders()

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="Failed to load orders." />

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col
        items-center justify-center gap-4">
        <p className="text-5xl">📋</p>
        <h2 className="text-xl font-semibold text-gray-700">No orders yet</h2>
        <p className="text-gray-400 text-sm">
          Your order history will appear here
        </p>
        <Link
          to="/products"
          className="bg-blue-600 text-white font-semibold px-6
            py-3 rounded-xl hover:bg-blue-700 transition-colors mt-2"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-2xl shadow-sm p-5
                hover:shadow-md transition-shadow"
            >
              {/* Order header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day  : 'numeric',
                      month: 'long',
                      year : 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-bold text-gray-900">
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Items preview — show first 2 items */}
              <div className="space-y-1">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id}
                    className="flex items-center gap-3">
                    {/* Product thumbnail */}
                    <div className="w-10 h-10 bg-gray-100 rounded-lg
                      overflow-hidden shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center
                          justify-center text-lg">📱</div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {item.product.name}
                      <span className="text-gray-400"> ×{item.quantity}</span>
                    </p>
                  </div>
                ))}

                {/* Show count if more than 2 items */}
                {order.items.length > 2 && (
                  <p className="text-xs text-gray-400 pl-13">
                    +{order.items.length - 2} more item
                    {order.items.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* View details hint */}
              <div className="flex items-center justify-between mt-3
                pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {order.items.length} item
                  {order.items.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  View details →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}