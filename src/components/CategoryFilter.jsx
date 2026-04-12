import { useSearchParams } from 'react-router-dom'
import { useCategories } from '../hooks/useProducts'

export default function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const { data: categories } = useCategories()

  const handleCategoryClick = (categorySlug) => {
    const newParams = new URLSearchParams(searchParams)
    if (categorySlug) {
      newParams.set('category', categorySlug)
    } else {
      newParams.delete('category')
    }
    setSearchParams(newParams)
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Categories</p>
      <div className="space-y-0.5">
        <button
          onClick={() => handleCategoryClick('')}
          className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
            !category 
              ? 'bg-blue-50 text-blue-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Categories
        </button>
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                category === cat.slug
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))
        ) : (
          <div className="text-xs text-gray-500 px-3 py-2">Loading...</div>
        )}
      </div>
    </div>
  )
}
