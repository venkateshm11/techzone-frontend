// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, getProfile } from '../services/auth'

/**
 * AuthContext is a global store for authentication state.
 * 
 * Why Context instead of regular useState?
 * If you used useState in App.jsx, you'd have to pass user as a prop
 * through every component: App → Navbar → UserAvatar. 
 * This is called "prop drilling" and becomes unmanageable.
 * Context makes the user available to ANY component without prop drilling.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)
  // loading=true means "we're checking localStorage, don't render yet"
  // Without this, there's a flash where the user appears logged out
  // even if they have a valid token in localStorage

  /**
   * On app start, check if there's a saved token in localStorage.
   * If yes, fetch the user's profile to restore the session.
   * If the token is expired or invalid, clear it and show login.
   */
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      getProfile()
        .then((userData) => setUser(userData))
        .catch(() => {
          // Token is invalid or expired — clear everything
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    // Store tokens in localStorage so they persist across browser refreshes
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    setUser(data.user)
    return data
  }

  const register = async (formData) => {
    const data = await registerUser(formData)
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isLoggedIn : !!user,           // true if user object exists
    isAdmin    : user?.role === 'ADMIN',
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we've checked localStorage.
          This prevents the login flash on page refresh. */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook — import this in any component that needs auth state.
 * Usage: const { user, login, logout, isLoggedIn } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}