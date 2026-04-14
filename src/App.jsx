// frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }         from './context/AuthContext'
import { CartProvider }         from './context/CartContext'
import ErrorBoundary            from './components/ErrorBoundary'
import Navbar                   from './components/Navbar'
import PrivateRoute             from './components/PrivateRoute'
import HomePage                 from './pages/HomePage'
import ProductsPage             from './pages/ProductsPage'
import ProductDetailPage        from './pages/ProductDetailPage'
import LoginPage                from './pages/LoginPage'
import RegisterPage             from './pages/RegisterPage'
import CartPage                 from './pages/CartPage'
import CheckoutPage             from './pages/CheckoutPage'
import OrderConfirmationPage    from './pages/OrderConfirmationPage'
import OrdersPage               from './pages/OrdersPage'
import OrderDetailPage          from './pages/OrderDetailPage'
import CreateAdminPage          from './pages/CreateAdminPage'
import AdminDashboard           from './pages/admin/AdminDashboard'
import AdminProductsPage        from './pages/admin/AdminProductsPage'
import AdminProductFormPage     from './pages/admin/AdminProductFormPage'
import AdminOrdersPage          from './pages/admin/AdminOrdersPage'
import NotFoundPage             from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              {/* Public */}
              <Route path="/"               element={<HomePage />} />
              <Route path="/products"       element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/login"          element={<LoginPage />} />
              <Route path="/register"       element={<RegisterPage />} />
              <Route path="/create-admin"   element={<CreateAdminPage />} />

              {/* Customer protected */}
              <Route path="/cart"     element={<PrivateRoute element={<CartPage />} />} />
              <Route path="/checkout" element={<PrivateRoute element={<CheckoutPage />} />} />
              <Route path="/orders"   element={<PrivateRoute element={<OrdersPage />} />} />
              <Route path="/orders/:id" element={
                <PrivateRoute element={<OrderDetailPage />} />
              } />
              <Route path="/orders/:id/confirmation" element={
                <PrivateRoute element={<OrderConfirmationPage />} />
              } />

              {/* Admin only */}
              <Route path="/admin" element={
                <PrivateRoute adminOnly element={<AdminDashboard />} />
              } />
              <Route path="/admin/products" element={
                <PrivateRoute adminOnly element={<AdminProductsPage />} />
              } />
              <Route path="/admin/products/new" element={
                <PrivateRoute adminOnly element={<AdminProductFormPage />} />
              } />
              <Route path="/admin/products/:id/edit" element={
                <PrivateRoute adminOnly element={<AdminProductFormPage />} />
              } />
              <Route path="/admin/orders" element={
                <PrivateRoute adminOnly element={<AdminOrdersPage />} />
              } />

              {/* 404 — must be last */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}