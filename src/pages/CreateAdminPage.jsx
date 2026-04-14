// frontend/src/pages/CreateAdminPage.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bootstrapSuperuser, checkAdminCount } from '../services/admin'
import ErrorMessage from '../components/ErrorMessage'

export default function CreateAdminPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [adminCount, setAdminCount] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Check admin count on page load
  useEffect(() => {
    checkAdminCount()
      .then(data => {
        setAdminCount(data)
        // Redirect if max admins reached
        if (!data.can_create_admin) {
          setError('Maximum number of admin accounts already created.')
        }
      })
      .catch(err => console.error('Error checking admin count:', err))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!formData.name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }

    try {
      const response = await bootstrapSuperuser(
        formData.email,
        formData.password,
        formData.name
      )

      setSuccess(true)
      setTimeout(() => {
        // Redirect to admin dashboard or login
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create admin account')
      console.error('Bootstrap error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <div className="mb-4 text-green-500 text-5xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Created!</h2>
          <p className="text-gray-600 mb-4">Your admin account has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (adminCount === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!adminCount.can_create_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <div className="mb-4 text-red-500 text-5xl">✕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Limit Reached</h2>
          <p className="text-gray-600">
            Maximum {adminCount.max_admins} admin accounts have been created.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
        <p className="text-gray-600 mb-2">Set up an admin account for the TechZone Shop</p>
        
        {/* Admin count display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Admins created:</strong> {adminCount.admin_count} / {adminCount.max_admins}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            {adminCount.admins_remaining} slot{adminCount.admins_remaining !== 1 ? 's' : ''} remaining
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Admin User"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Maximum {adminCount.max_admins} admin accounts can be created.
        </p>
      </div>
    </div>
  )
}
