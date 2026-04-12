// frontend/src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-blue-100 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="bg-blue-600 text-white font-semibold px-6 py-3
              rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/products"
            className="border-2 border-gray-200 text-gray-600 font-semibold
              px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}