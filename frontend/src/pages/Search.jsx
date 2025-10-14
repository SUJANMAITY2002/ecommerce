import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import productsData from '../data/products.json'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const query = searchParams.get('q') || ''

  useEffect(() => {
    searchProducts()
  }, [query])

  const searchProducts = () => {
    setIsLoading(true)
    
    if (query.trim()) {
      const results = productsData.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredProducts(results)
    } else {
      setFilteredProducts(productsData)
    }
    
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <section className="section-products container">
        <div className="loading-container">
          <h2>Searching...</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="section-products container">
      <div>
        <h2 className="section-common--heading">
          {query ? `Search Results for "${query}"` : 'All Products'}
        </h2>
        {filteredProducts.length > 0 && (
          <p className="search-results-count">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      <section className="container">
        <div id="productContainer">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>
                {query 
                  ? `Sorry, we couldn't find any products matching "${query}"`
                  : 'No products available at the moment'
                }
              </p>
              <div className="search-suggestions">
                <h4>Try searching for:</h4>
                <ul>
                  <li>Laptops</li>
                  <li>Smartphones</li>
                  <li>Headphones</li>
                  <li>Speakers</li>
                  <li>Smart watches</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

export default Search