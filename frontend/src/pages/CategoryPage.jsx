import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import productsData from '../data/products.json'

const CategoryPage = () => {
  const { categoryName } = useParams()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    filterProductsByCategory()
  }, [categoryName])

  const filterProductsByCategory = () => {
    setIsLoading(true)
    
    // Filter products based on category
    const filtered = productsData.filter(product => 
      product.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      product.name.toLowerCase().includes(categoryName.toLowerCase())
    )
    
    setFilteredProducts(filtered)
    setIsLoading(false)
  }

  const getCategoryTitle = () => {
    switch (categoryName.toLowerCase()) {
      case 'laptop':
      case 'laptops':
        return 'Laptops '
      case 'mobiles':
      case 'smartphones':
        return 'Smartphones'
      case 'audio':
      case 'headphones':
        return 'Audio Devices'
      case 'wearables':
      case 'watches':
        return 'Smart Watches'
      case 'video':
      case 'tv':
        return 'Televisions'
      case 'speaker':
      case 'speakers':
        return 'Speakers'
      default:
        return categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    }
  }

  if (isLoading) {
    return (
      <section className="section-products container">
        <div className="loading-container">
          <h2>Loading products...</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="section-products container">
      <div>
        <h2 className="section-common--heading">{getCategoryTitle()} Collection</h2>
        {filteredProducts.length > 0 && (
          <p className="category-results-count">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
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
              <h3>No products found in this category</h3>
              <p>Sorry, we couldn't find any products in the {getCategoryTitle()} category.</p>
              <div className="category-suggestions">
                <h4>Try browsing other categories:</h4>
                <ul>
                  <li>Laptops </li>
                  <li>Smartphones</li>
                  <li>Audio Devices</li>
                  <li>Smart Watches</li>
                  <li>Televisions</li>
                  <li>Speakers</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

export default CategoryPage