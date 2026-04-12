// frontend/src/pages/admin/AdminProductsPage.jsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminProducts, deleteProduct } from '../../services/admin'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminProductsPage() {
  const [search, setSearch]           = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const queryClient                   = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products', search, stockFilter],
    queryFn : () => getAdminProducts({
      search: search || undefined,
      stock : stockFilter || undefined,
    }),
  })

  /**
   * useMutation is React Query's tool for POST/PUT/DELETE operations.
   * Unlike useQuery (which runs automatically), mutations run when you
   * call mutate(). After success, we invalidate the products query so
   * the list refreshes automatically.
   */
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess : () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  const handleDelete = (product) => {
    if (window.confirm(
      `Hide "${product.name}"? It will no longer appear in the store.`
    )) {
      deleteMutation.mutate(product.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin"
              className="text-sm text-blue-600 hover:underline mb-1 block">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>
          <Link
            to="/admin/products/new"
            className="bg-blue-600 text-white text-sm font-semibold
              px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            + Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              bg-white"
          >
            <option value="">All Stock</option>
            <option value="low">Low Stock (≤5)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products?.map((product) => (
                  <tr key={product.id}
                    className="hover:bg-gray-50 transition-colors">

                    {/* Product name + image */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg
                          overflow-hidden shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center
                              justify-center text-lg">📱</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800
                            line-clamp-1 max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.sku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-gray-600">
                      {product.category?.name}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </p>
                      {product.compare_price && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{Number(product.compare_price).toLocaleString('en-IN')}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4">
                      <span className={`font-semibold ${
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock <= 5
                          ? 'text-amber-600'
                          : 'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>

                    {/* Active status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full
                        text-xs font-semibold ${
                        product.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-xs bg-blue-50 text-blue-700 font-semibold
                            px-3 py-1.5 rounded-lg hover:bg-blue-100
                            transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleteMutation.isPending}
                          className="text-xs bg-red-50 text-red-600 font-semibold
                            px-3 py-1.5 rounded-lg hover:bg-red-100
                            transition-colors disabled:opacity-50"
                        >
                          Hide
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {products?.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No products found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}