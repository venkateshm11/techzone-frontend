// frontend/src/pages/admin/AdminOrdersPage.jsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminOrders, updateOrderStatus } from '../../services/admin'
import OrderStatusBadge from '../../components/OrderStatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

const STATUS_OPTIONS = [
  'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'
]

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn : () => getAdminOrders({
      status: statusFilter || undefined
    }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess : () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
  })

  const handleStatusChange = (order, newStatus) => {
    if (newStatus === order.status) return
    statusMutation.mutate({ id: order.id, status: newStatus })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <Link to="/admin"
            className="text-sm text-blue-600 hover:underline mb-1 block">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold
                transition-colors border ${
                statusFilter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s || 'All Orders'}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Items
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders?.map((order) => (
                  <tr key={order.id}
                    className="hover:bg-gray-50 transition-colors">

                    {/* Order ID and date */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">#{order.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">
                        {order.user_name}
                      </p>
                      <p className="text-xs text-gray-500">{order.user_email}</p>
                    </td>

                    {/* Items count */}
                    <td className="px-4 py-4 text-gray-600">
                      {order.items?.length} item
                      {order.items?.length !== 1 ? 's' : ''}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </td>

                    {/* Payment status */}
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border inline-flex ${
                        order.payment_status === 'PAID'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : order.payment_status === 'FAILED'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>

                    {/* Status dropdown */}
                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value)}
                        disabled={statusMutation.isPending}
                        className="border border-gray-200 rounded-lg px-2 py-1.5
                          text-xs font-semibold focus:outline-none
                          focus:ring-2 focus:ring-blue-500 bg-white
                          disabled:opacity-50 cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {orders?.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No orders found.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}