// frontend/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/useProducts'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { data: categories }              = useCategories()
  const { isLoggedIn, logout, isAdmin }   = useAuth()
  const { itemCount }                     = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold text-blue-600">
          TechZone
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/products"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium">
            All Products
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin"
              className="text-orange-600 text-sm font-semibold hover:underline">
              Admin
            </Link>
          )}

          {/* Cart icon with live item count */}
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white
                text-xs rounded-full w-5 h-5 flex items-center justify-center
                font-semibold">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/orders"
                className="text-sm text-gray-600 hover:text-blue-600 font-medium">
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}