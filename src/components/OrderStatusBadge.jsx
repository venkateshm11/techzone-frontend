// frontend/src/components/OrderStatusBadge.jsx

/**
 * Renders a colored pill badge for an order status.
 * Colors are chosen to match real-world meaning:
 * - Grey for pending (nothing happened yet)
 * - Blue for confirmed/packed (being processed)
 * - Amber for shipped (on the way)
 * - Green for delivered (done)
 * - Red for cancelled
 */

const STATUS_STYLES = {
  PENDING  : 'bg-gray-100 text-gray-600',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PACKED   : 'bg-indigo-100 text-indigo-700',
  SHIPPED  : 'bg-amber-100 text-amber-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

const STATUS_LABELS = {
  PENDING  : 'Pending',
  CONFIRMED: 'Confirmed',
  PACKED   : 'Packed',
  SHIPPED  : 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export default function OrderStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'
  const label = STATUS_LABELS[status] || status

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full
      text-xs font-semibold ${style}`}>
      {label}
    </span>
  )
}