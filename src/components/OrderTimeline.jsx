// frontend/src/components/OrderTimeline.jsx

/**
 * Shows a visual step-by-step progress timeline for an order.
 * 
 * status_index from Django tells us which step is current:
 * 0=PENDING, 1=CONFIRMED, 2=PACKED, 3=SHIPPED, 4=DELIVERED
 * 
 * Steps before and including the current one are highlighted blue.
 * Future steps are shown in grey.
 * Cancelled orders show a special red state instead of the timeline.
 */

const STEPS = [
  { label: 'Order Placed',  icon: '🧾' },
  { label: 'Confirmed',     icon: '✅' },
  { label: 'Packed',        icon: '📦' },
  { label: 'Shipped',       icon: '🚚' },
  { label: 'Delivered',     icon: '🏠' },
]

export default function OrderTimeline({ statusIndex, isCancelled }) {
  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-semibold text-sm">
          ✗ This order was cancelled
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Connecting line behind the steps */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-8" />

      <div className="relative flex justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index <= statusIndex
          const isCurrent   = index === statusIndex

          return (
            <div key={step.label} className="flex flex-col items-center gap-2 flex-1">
              {/* Step circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                text-sm font-bold border-2 z-10 transition-colors
                ${isCompleted
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-300'}
                ${isCurrent ? 'ring-4 ring-blue-100' : ''}
              `}>
                {isCompleted ? step.icon : index + 1}
              </div>

              {/* Step label */}
              <span className={`text-xs font-medium text-center leading-tight
                ${isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}