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
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/orders"
              className="text-sm text-blue-600 hover:underline mb-1 block"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order?.id}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Placed on {new Date(order?.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order?.status} />
        </div>

        <div className="space-y-4">

          {/* Status Timeline */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5">Order Progress</h2>
            <OrderTimeline
              statusIndex={order?.status_index}
              isCancelled={isCancelled}
            />

            {/* Payment status below timeline */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex
              items-center justify-between">
              <span className="text-sm text-gray-500">Payment Status</span>
              <span className={`text-sm font-semibold ${
                order?.payment_status === 'PAID'
                  ? 'text-green-600'
                  : order?.payment_status === 'FAILED'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {order?.payment_status}
              </span>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">
              Items Ordered
              <span className="text-gray-400 font-normal text-sm ml-2">
                ({order?.items?.length} item
                {order?.items?.length !== 1 ? 's' : ''})
              </span>
            </h2>

            <div className="space-y-4">
              {order?.items?.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Product image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-xl
                    overflow-hidden shrink-0">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center
                        justify-center text-2xl">📱</div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-semibold text-gray-800 text-sm
                        hover:text-blue-600 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.product.brand}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        ₹{Number(item.price_at_purchase).toLocaleString('en-IN')}
                        {' '}× {item.quantity}
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{Number(item.item_total).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order total */}
            <div className="mt-4 pt-4 border-t border-gray-100
              flex justify-between">
              <span className="font-bold text-gray-900">Total Paid</span>
              <span className="font-bold text-gray-900 text-lg">
                ₹{Number(order?.total_amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-3">Delivery Address</h2>
            {order?.shipping_address && (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">
                  {order.shipping_address.name}
                </p>
                <p>{order.shipping_address.phone}</p>
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.city},{' '}
                  {order.shipping_address.state} —{' '}
                  {order.shipping_address.pincode}
                </p>
              </div>
            )}
          </div>

          {/* Order Notes */}
          {order?.notes && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-2">Delivery Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}

          {/* Razorpay reference */}
          {order?.razorpay_payment_id && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400">
                Payment Reference: {order.razorpay_payment_id}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}