// frontend/src/pages/RegisterPage.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirm_password: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate     = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      // Django serializer returns field-level errors as an object
      // Example: { email: ['user with this email already exists'] }
      const errors = err.response?.data
      if (typeof errors === 'object') {
        const first = Object.values(errors)[0]
        setError(Array.isArray(first) ? first[0] : first)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-2">Join TechZone and start shopping</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name',        name: 'name',             type: 'text',     placeholder: 'Ravi Kumar'        },
            { label: 'Email address',    name: 'email',            type: 'email',    placeholder: 'you@example.com'   },
            { label: 'Phone (optional)', name: 'phone',            type: 'tel',      placeholder: '9876543210'        },
            { label: 'Password',         name: 'password',         type: 'password', placeholder: 'Min 8 characters'  },
            { label: 'Confirm Password', name: 'confirm_password', type: 'password', placeholder: 'Repeat password'   },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name !== 'phone'}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white placeholder:text-gray-400"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition-colors duration-150 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}