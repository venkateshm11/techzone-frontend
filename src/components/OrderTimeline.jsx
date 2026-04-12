// frontend/src/components/OrderTimeline.jsx

/**
 * Shows a visual step-by-step progress timeline for an order.
 * 
 * status_index from Django tells us which step is current:
 * 0=PENDING, 1=CONFIRMED, 2=PACKED, 3=SHIPPED, 4=DELIVERED
 * 
 * Steps before and including the current one are highlighted blue.
 * Future steps are shown in grey.
 */

const STEPS = [
  { label: 'Order Placed' },
  { label: 'Confirmed' },
  { label: 'Packed' },
  { label: 'Shipped' },
  { label: 'Delivered' },
]

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

export default function OrderTimeline({ statusIndex, isCancelled }) {
  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700 font-semibold text-sm">
          This order was cancelled
        </p>
      </div>
    )
  }

  return (
    <div className="relative py-2">
      <div className="flex justify-between items-start gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = index <= statusIndex
          const isCurrent = index === statusIndex

          return (
            <div key={step.label} className="flex flex-col items-center gap-2 flex-1">
              {/* Step circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-200 flex-shrink-0 ${
                isCompleted
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isCurrent
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-white text-gray-300'
              }`}>
                {isCompleted ? (
                  <CheckIcon />
                ) : (
                  <span className="text-xs font-semibold text-gray-400">{index + 1}</span>
                )}
              </div>

              {/* Step label */}
              <span className={`text-xs font-medium text-center leading-tight whitespace-nowrap ${
                isCompleted ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step.label}
              </span>

              {/* Connecting line to next step */}
              {index < STEPS.length - 1 && (
                <div className={`absolute left-1/2 top-4 w-[calc(100%-2rem)] h-0.5 transition-colors ${
                  isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                }`} style={{
                  left: `calc(${(index + 1) * (100 / STEPS.length)}% - 1rem)`,
                  width: `calc(${100 / STEPS.length}% - 2rem)`,
                  top: '16px'
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}