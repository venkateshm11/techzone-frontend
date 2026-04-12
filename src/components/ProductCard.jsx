// frontend/src/components/ProductCard.jsx

import { Link } from 'react-router-dom'

/**
 * Displays one product in the grid.
 * Props: product object from the API.
 */
export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            📱
          </div>
        )}

        {/* Discount badge */}
        {product.discount_percent > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discount_percent}% OFF
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {product.brand}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.compare_price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{Number(product.compare_price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock status */}
        <p className={`text-xs mt-2 font-medium ${
          product.stock > 10
            ? 'text-green-600'
            : product.stock > 0
            ? 'text-orange-500'
            : 'text-red-500'
        }`}>
          {product.stock > 10
            ? 'In Stock'
            : product.stock > 0
            ? `Only ${product.stock} left`
            : 'Out of Stock'}
        </p>
      </div>
    </Link>
  )
}