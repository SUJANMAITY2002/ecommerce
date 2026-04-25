import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { showNotification } from './Notification'
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleQuantityChange = (action) => {
    if (action === 'increment' && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showNotification('Product is out of stock', 'error')
      return
    }

    const result = addToCart({ ...product, quantity })
    if (result.success) {
      showNotification(result.message, 'success')
      setQuantity(1)
    }
  }

  const renderStars = () => {
    return Array(5).fill().map((_, i) => (
      <i key={i} className="fa-solid fa-star"></i>
    ))
  }

  return (
    <div className="cards">
      <article className="information">
        <span className="category">{product.category}</span>
        <div className="imageContainer">
          <img 
            className="productImage" 
            src={product.image || '/images/placeholder.jpg'} 
            alt={product.name}
            loading="lazy"
          />
        </div>
        <h2 className="productName">{product.name}</h2>

        <div className="productRating">
          {renderStars()}
        </div>

        <p className="productDescription">{product.description}</p>

        <div className="productPriceElement">
          <p className="productPrice">${product.price}</p>
          {product.originalPrice && (
            <p className="productActualPrice">${product.originalPrice}</p>
          )}
        </div>

        <div className="productStockElement">
          <p className="productProperty">Total Stocks Available:</p>
          <p className="productStock">{product.stock}</p>
        </div>

        <div className="productQuantityElement">
          <p className="productProperty">Quantity(Pieces)</p>
          <div className="stockElement">
            <button 
              className="cartIncrement"
              onClick={() => handleQuantityChange('increment')}
              disabled={quantity >= product.stock}
            >
              +
            </button>
            <p className="productQuantity">{quantity}</p>
            <button 
              className="cartDecrement"
              onClick={() => handleQuantityChange('decrement')}
              disabled={quantity <= 1}
            >
              -
            </button>
          </div>
        </div>

        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <i className="fa-solid fa-cart-shopping"></i> 
          {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
        </button>
      </article>
    </div>
  )
}

export default ProductCard