// frontend/src/pages/admin/AdminCategoriesPage.jsx

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminCategories, createCategory, deleteCategory } from '../../services/admin'
import ErrorMessage from '../../components/ErrorMessage'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getAdminCategories,
  })

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data) => createCategory(data.name, data.slug, data.description),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
      setSuccess('Category created successfully!')
      setFormData({ name: '', slug: '', description: '' })
      setError('')
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (err) => {
      setError(err.response?.data?.name?.[0] || 'Failed to create category')
    },
  })

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (slug) => deleteCategory(slug),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
      setSuccess('Category deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (err) => {
      setError('Failed to delete category')
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Category name is required')
      return
    }
    
    if (!formData.slug.trim()) {
      setError('Slug is required')
      return
    }

    createMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Create and manage product categories</p>
          </div>
          <Link 
            to="/admin/products" 
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Category</h2>

              {error && <ErrorMessage message={error} />}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Smartphones"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g., smartphones"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (lowercase, hyphens)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Optional description"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:bg-gray-400"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Category'}
                </button>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Existing Categories</h2>
              </div>

              {isLoading ? (
                <div className="p-8"><LoadingSpinner /></div>
              ) : categories && categories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{cat.name}</p>
                              {cat.description && (
                                <p className="text-sm text-gray-500">{cat.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <code className="bg-gray-100 px-2 py-1 text-sm rounded">{cat.slug}</code>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              cat.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {cat.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat.name}"?`)) {
                                  deleteMutation.mutate(cat.slug)
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded disabled:bg-gray-400"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No categories yet. Create one using the form on the left.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
