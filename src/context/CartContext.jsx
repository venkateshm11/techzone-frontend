// frontend/src/context/CartContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cart'
import { useAuth } from './AuthContext'

/**
 * CartContext stores the cart state globally.
 * Any component can call useCart() to:
 * - Read cart items and totals
 * - Add, update, or remove items
 * 
 * Why separate from AuthContext?
 * Auth state (who is logged in) and cart state (what's in the cart)
 * are different concerns. Keeping them separate makes each context
 * smaller and easier to debug.
 */
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart]       = useState({ items: [], cart_total: 0, item_count: 0 })
  const [loading, setLoading] = useState(false)
  const { isLoggedIn }        = useAuth()

  /**
   * Fetch cart from Django whenever the user logs in.
   * Clear cart state when user logs out.
   * The dependency [isLoggedIn] means this runs every time
   * the login state changes.
   */
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart()
    } else {
      setCart({ items: [], cart_total: 0, item_count: 0 })
    }
  }, [isLoggedIn])

  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCart(data)
    } catch (err) {
      console.error('Failed to fetch cart:', err)
    }
  }

  const addItem = async (productId, quantity = 1) => {
    setLoading(true)
    try {
      await addToCart(productId, quantity)
      await fetchCart()
      // We refetch the entire cart after adding instead of
      // manually updating state. This keeps the cart in sync
      // with the server — cart_total and item_count stay accurate.
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (itemId, quantity) => {
    setLoading(true)
    try {
      await updateCartItem(itemId, quantity)
      await fetchCart()
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (itemId) => {
    setLoading(true)
    try {
      await removeCartItem(itemId)
      await fetchCart()
    } finally {
      setLoading(false)
    }
  }

  const emptyCart = async () => {
    await clearCart()
    setCart({ items: [], cart_total: 0, item_count: 0 })
  }

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addItem,
      updateItem,
      removeItem,
      emptyCart,
      fetchCart,
      itemCount: cart.item_count,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}