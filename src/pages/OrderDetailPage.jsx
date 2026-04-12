// frontend/src/pages/OrderDetailPage.jsx

import { useParams, Link } from 'react-router-dom'
import { useOrder } from '../hooks/useOrders'
import OrderStatusBadge from '../components/OrderStatusBadge'
import OrderTimeline from '../components/OrderTimeline'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function OrderDetailPage() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useOrder(id)

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="Order not found." />

  const isCancelled = order?.status === 'CANCELLED'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-2 block"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order?.id}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {new Date(order?.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: '2-digit',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order?.status} />
        </div>

        <div className="space-y-4">

          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-6">Order Progress</h2>
            <OrderTimeline
              statusIndex={order?.status_index}
              isCancelled={isCancelled}
            />

            {/* Payment status below timeline */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Status</span>
              <span className={`text-sm font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full border ${
                order?.payment_status === 'PAID'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : order?.payment_status === 'FAILED'
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {order?.payment_status}
              </span>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-6">
              Items Ordered
              <span className="text-gray-500 font-normal text-sm ml-2">
                ({order?.items?.length})
              </span>
            </h2>

            <div className="space-y-4">
              {order?.items?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  {/* Product image */}
                  <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-semibold text-gray-800 text-sm hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.product.brand}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">
                        ₹{Number(item.price_at_purchase).toLocaleString('en-IN')} × {item.quantity}
                      </span>
                      <span className="font-bold text-gray-900">
                        ₹{Number(item.item_total).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order total */}
            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <span className="font-semibold text-gray-800">Order Total</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{Number(order?.total_amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Delivery Address</h2>
            {order?.shipping_address && (
              <div className="text-sm text-gray-600 space-y-1.5">
                <p className="font-semibold text-gray-800">
                  {order.shipping_address.name}
                </p>
                <p className="text-gray-500">{order.shipping_address.phone}</p>
                <p className="text-gray-500">{order.shipping_address.street}</p>
                <p className="text-gray-500">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                </p>
              </div>
            )}
          </div>

          {/* Order Notes */}
          {order?.notes && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-3">Delivery Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}

          {/* Razorpay reference */}
          {order?.razorpay_payment_id && (
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-mono">
                Payment ID: {order.razorpay_payment_id}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}