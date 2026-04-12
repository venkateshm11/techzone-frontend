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
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 ${color}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
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
            <p className="text-sm text-gray-500 mt-0.5">TechZone Management Panel</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products/new"
              className="bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
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
            color="border-l-blue-600"
          />
          <StatCard
            label="Today's Revenue"
            value={`₹${Number(stats?.today_revenue ?? 0).toLocaleString('en-IN')}`}
            color="border-l-green-600"
          />
          <StatCard
            label="Total Orders"
            value={stats?.total_orders ?? 0}
            sub={`${stats?.pending_orders ?? 0} pending`}
            color="border-l-indigo-600"
          />
          <StatCard
            label="Total Revenue"
            value={`₹${Number(stats?.total_revenue ?? 0).toLocaleString('en-IN')}`}
            color="border-l-emerald-600"
          />
          <StatCard
            label="Total Products"
            value={stats?.total_products ?? 0}
            color="border-l-purple-600"
          />
          <StatCard
            label="Low Stock"
            value={stats?.low_stock_count ?? 0}
            sub="5 or fewer units"
            color="border-l-amber-600"
          />
          <StatCard
            label="Out of Stock"
            value={stats?.out_of_stock_count ?? 0}
            color="border-l-red-600"
          />
          <StatCard
            label="To Confirm"
            value={stats?.confirmed_orders ?? 0}
            sub="awaiting packing"
            color="border-l-cyan-600"
          />
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-500">
                Add, edit, hide products and update stock
              </p>
            </div>
            <span className="ml-auto text-gray-300 text-xl">›</span>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .984.578 1.83 1.414 2.25m0 0h7.5c1.124 0 2.25-.045 3.362-.117m-7.5 0V5.25m3.318 5.25a9.723 9.723 0 002.205.1c.663-.079 1.318-.187 1.974-.326m-9.869 0c-1.105.122-2.202.28-3.289.477m0 0a48.12 48.12 0 01-2.539-11.26m2.539 11.26c1.332 1.39 3.26 3.175 5.814 4.561" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-500">
                View all orders and update delivery status
              </p>
            </div>
            <span className="ml-auto text-gray-300 text-xl">›</span>
          </Link>
        </div>

      </div>
    </div>
  )
}