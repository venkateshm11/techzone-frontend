// frontend/src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-black text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/products"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-2.5 rounded-lg bg-white transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}