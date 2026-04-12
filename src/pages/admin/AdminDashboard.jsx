// frontend/src/pages/admin/AdminDashboard.jsx

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../../services/admin'
import LoadingSpinner from '../../components/LoadingSpinner'

/**
 * One stat card in the dashboard grid.
 * Kept as a local component since it's only used here.
 */
function StatCard({ label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 ${color}`}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn : getAdminStats,
    refetchInterval: 60000,  // refresh stats every 60 seconds automatically
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">TechZone Management Panel</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products/new"
              className="bg-blue-600 text-white text-sm font-semibold
                px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Today's Orders"
            value={stats?.today_orders ?? 0}
            color="border-blue-500"
          />
          <StatCard
            label="Today's Revenue"
            value={`₹${Number(stats?.today_revenue ?? 0).toLocaleString('en-IN')}`}
            color="border-green-500"
          />
          <StatCard
            label="Total Orders"
            value={stats?.total_orders ?? 0}
            sub={`${stats?.pending_orders ?? 0} pending`}
            color="border-indigo-500"
          />
          <StatCard
            label="Total Revenue"
            value={`₹${Number(stats?.total_revenue ?? 0).toLocaleString('en-IN')}`}
            color="border-emerald-500"
          />
          <StatCard
            label="Total Products"
            value={stats?.total_products ?? 0}
            color="border-purple-500"
          />
          <StatCard
            label="Low Stock"
            value={stats?.low_stock_count ?? 0}
            sub="5 or fewer units"
            color="border-amber-500"
          />
          <StatCard
            label="Out of Stock"
            value={stats?.out_of_stock_count ?? 0}
            color="border-red-500"
          />
          <StatCard
            label="To Confirm"
            value={stats?.confirmed_orders ?? 0}
            sub="awaiting packing"
            color="border-cyan-500"
          />
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md
              transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex
              items-center justify-center text-2xl">📦</div>
            <div>
              <p className="font-bold text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-400">
                Add, edit, hide products and update stock
              </p>
            </div>
            <span className="ml-auto text-gray-300 text-xl">→</span>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md
              transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex
              items-center justify-center text-2xl">🧾</div>
            <div>
              <p className="font-bold text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-400">
                View all orders and update delivery status
              </p>
            </div>
            <span className="ml-auto text-gray-300 text-xl">→</span>
          </Link>
        </div>

      </div>
    </div>
  )
}