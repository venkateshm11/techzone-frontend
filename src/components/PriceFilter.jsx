import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function PriceFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''
  
  const [localMinPrice, setLocalMinPrice] = useState(minPrice)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice)

  useEffect(() => {
    setLocalMinPrice(minPrice)
    setLocalMaxPrice(maxPrice)
  }, [minPrice, maxPrice])

  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setLocalMinPrice(value)
    } else {
      setLocalMaxPrice(value)
    }

    const newParams = new URLSearchParams(searchParams)
    if (type === 'min') {
      if (value) newParams.set('min_price', value)
      else newParams.delete('min_price')
    } else {
      if (value) newParams.set('max_price', value)
      else newParams.delete('max_price')
    }
    setSearchParams(newParams)
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Price Range</p>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-gray-600 font-medium">Min Price</label>
          <input
            type="number"
            placeholder="₹ Min"
            value={localMinPrice}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 font-medium">Max Price</label>
          <input
            type="number"
            placeholder="₹ Max"
            value={localMaxPrice}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
      </div>
    </div>
  )
}
