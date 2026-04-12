// frontend/src/components/ProductCard.jsx

import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden group cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100" />
        )}

        {/* Discount badge */}
        {product.discount_percent > 0 && (
          <span className="absolute top-2 left-2 bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-100">
            {product.discount_percent}% OFF
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">
          {product.brand}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-3 leading-snug">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.compare_price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{Number(product.compare_price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock status */}
        <p className={`text-xs font-medium ${
          product.stock > 10
            ? 'text-green-600'
            : product.stock > 0
            ? 'text-amber-600'
            : 'text-red-600'
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