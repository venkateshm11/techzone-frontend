// frontend/src/pages/admin/AdminProductFormPage.jsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAdminProduct,
  createProduct,
  updateProduct
} from '../../services/admin'
import { getCategories } from '../../services/products'
import LoadingSpinner from '../../components/LoadingSpinner'

const EMPTY_FORM = {
  name        : '',
  slug        : '',
  category_id : '',
  price       : '',
  compare_price: '',
  stock       : '',
  sku         : '',
  brand       : '',
  description : '',
  image       : '',
  is_active   : true,
  is_featured : false,
}

/**
 * Auto-generates a slug from the product name.
 * "Samsung Galaxy A55" → "samsung-galaxy-a55"
 * This runs as the admin types so they don't have to write the slug manually.
 */
const generateSlug = (name) =>
  name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

export default function AdminProductFormPage() {
  const { id }       = useParams()   // present if editing, absent if creating
  const isEditing    = !!id
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()

  const [form, setForm]   = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  // Fetch categories for the dropdown
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn : getCategories,
  })

  // If editing, fetch existing product data and populate the form
  const { data: existingProduct, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn : () => getAdminProduct(id),
    enabled : isEditing,
  })

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name         : existingProduct.name || '',
        slug         : existingProduct.slug || '',
        category_id  : existingProduct.category?.id || '',
        price        : existingProduct.price || '',
        compare_price: existingProduct.compare_price || '',
        stock        : existingProduct.stock || '',
        sku          : existingProduct.sku || '',
        brand        : existingProduct.brand || '',
        description  : existingProduct.description || '',
        image        : existingProduct.image || '',
        is_active    : existingProduct.is_active ?? true,
        is_featured  : existingProduct.is_featured ?? false,
      })
    }
  }, [existingProduct])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setForm((prev) => {
      const updated = { ...prev, [name]: newValue }
      // Auto-generate slug when name changes (only when creating)
      if (name === 'name' && !isEditing) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
    setError('')
  }

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEditing ? updateProduct(id, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      navigate('/admin/products')
    },
    onError: (err) => {
      const errors = err.response?.data
      if (typeof errors === 'object') {
        const messages = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`)
          .join('\n')
        setError(messages)
      } else {
        setError('Failed to save product. Please try again.')
      }
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    // Build clean data object — remove empty optional fields
    const data = {
      ...form,
      compare_price: form.compare_price || null,
      image        : form.image || '',
    }

    saveMutation.mutate(data)
  }

  if (isEditing && loadingProduct) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <Link to="/admin/products"
            className="text-sm text-blue-600 hover:underline mb-1 block">
            ← Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700
            px-4 py-3 rounded-xl text-sm mb-6 whitespace-pre-line">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 mb-2">Basic Information</h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} required
                placeholder="Samsung Galaxy A55"
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
                <span className="text-gray-400 font-normal ml-1">
                  (auto-generated from name)
                </span>
              </label>
              <input
                type="text" name="slug" value={form.slug}
                onChange={handleChange} required
                placeholder="samsung-galaxy-a55"
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  font-mono"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category_id" value={form.category_id}
                onChange={handleChange} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  bg-white"
              >
                <option value="">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text" name="brand" value={form.brand}
                onChange={handleChange}
                placeholder="Samsung"
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description" value={form.description}
                onChange={handleChange} rows={4}
                placeholder="Full product description..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  resize-none"
              />
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 mb-2">Pricing & Inventory</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number" name="price" value={form.price}
                  onChange={handleChange} required min="0" step="0.01"
                  placeholder="24999"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Compare Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MRP / Compare Price (₹)
                </label>
                <input
                  type="number" name="compare_price" value={form.compare_price}
                  onChange={handleChange} min="0" step="0.01"
                  placeholder="27999 (optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number" name="stock" value={form.stock}
                  onChange={handleChange} required min="0"
                  placeholder="20"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text" name="sku" value={form.sku}
                  onChange={handleChange} required
                  placeholder="SAM-A55-BLK-128"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                    text-sm font-mono focus:outline-none focus:ring-2
                    focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Image and Visibility */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 mb-2">Image & Visibility</h2>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
                <span className="text-gray-400 font-normal ml-1">
                  (paste a Cloudinary or direct image URL)
                </span>
              </label>
              <input
                type="url" name="image" value={form.image}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Image preview */}
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-3 w-24 h-24 object-cover rounded-xl
                    border border-gray-200"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" name="is_active"
                  checked={form.is_active} onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active (visible in store)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" name="is_featured"
                  checked={form.is_featured} onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured (shown on homepage)
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 bg-blue-600 text-white font-semibold py-3
                rounded-xl hover:bg-blue-700 disabled:opacity-60
                disabled:cursor-not-allowed transition-colors"
            >
              {saveMutation.isPending
                ? 'Saving...'
                : isEditing ? 'Save Changes' : 'Create Product'}
            </button>
            <Link
              to="/admin/products"
              className="px-6 py-3 border-2 border-gray-200 text-gray-600
                font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}