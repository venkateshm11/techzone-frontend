// frontend/src/components/OrderStatusBadge.jsx

/**
 * Renders a colored pill badge for an order status.
 * Uses semantic colors matching the design system.
 */

const STATUS_STYLES = {
  PENDING  : 'bg-gray-100 text-gray-600 border border-gray-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border border-blue-200',
  PACKED   : 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  SHIPPED  : 'bg-amber-50 text-amber-700 border border-amber-200',
  DELIVERED: 'bg-green-50 text-green-700 border border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border border-red-200',
  PAID     : 'bg-green-50 text-green-700 border border-green-200',
  FAILED   : 'bg-red-50 text-red-600 border border-red-200',
}

const STATUS_LABELS = {
  PENDING  : 'Pending',
  CONFIRMED: 'Confirmed',
  PACKED   : 'Packed',
  SHIPPED  : 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  PAID     : 'Paid',
  FAILED   : 'Failed',
}

export default function OrderStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600 border border-gray-200'
  const label = STATUS_LABELS[status] || status

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  )
}