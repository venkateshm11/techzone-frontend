// frontend/src/components/PrivateRoute.jsx

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps any route that requires login.
 * If user is not logged in → redirects to /login.
 * Saves the current URL in location.state.from so after
 * login the user goes back to where they were trying to go.
 * 
 * adminOnly prop: if true, also checks user.role === 'ADMIN'.
 */
export default function PrivateRoute({ element, adminOnly = false }) {
  const { isLoggedIn, isAdmin } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return element
}