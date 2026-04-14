// frontend/src/components/Navbar.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/useProducts'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { data: categories }              = useCategories()
  const { isLoggedIn, logout, isAdmin }   = useAuth()
  const { itemCount }                     = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserDropdownOpen(false)
  }

  const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  )

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )

  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )

  const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 shrink-0">
          TechZone
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 flex-1 ml-12">
          <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors pb-1 border-b-2 border-b-transparent hover:border-b-blue-600">
            All Products
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors pb-1 border-b-2 border-b-transparent hover:border-b-blue-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-6">
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Admin
            </Link>
          )}

          {!isLoggedIn && (
            <Link to="/create-admin" className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
              Register as Admin
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <UserIcon />
                <ChevronDownIcon />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-10">
                  <div className="px-3.5 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              All Products
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {cat.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Admin
              </Link>
            )}

            {!isLoggedIn && (
              <Link
                to="/create-admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-center transition-colors"
              >
                Register as Admin
              </Link>
            )}

            <div className="border-t border-gray-100 pt-3 space-y-3">
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <CartIcon />
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left text-sm font-medium text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}