import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import productsData from '../data/products.json'
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setProducts(productsData)
  }, [])

  const navigateToCategory = (category) => {
    navigate(`/category/${category}`)
  }

  return (
    <>
      {/* Category Showcase */}
      <section className="category-showcase">
        <div className="container">
          <h2 className="section-common--heading">Shop by Category</h2>
          <div className="category-showcase-grid">
            <div className="category-showcase-item" onClick={() => navigateToCategory('laptop')}>
              <img 
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop" 
                alt="Laptops" 
                className="category-image"
              />
              <h3>Laptops</h3>
              <p>High Performance Computing Devices</p>
              <button className="category-btn">Shop Laptops</button>
            </div>
            
            <div className="category-showcase-item" onClick={() => navigateToCategory('mobiles')}>
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop" 
                alt="Smartphones" 
                className="category-image"
              />
              <h3>Smartphones</h3>
              <p>Latest Mobile Technology</p>
              <button className="category-btn">Shop Mobiles</button>
            </div>
            
            <div className="category-showcase-item" onClick={() => navigateToCategory('audio')}>
              <img 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop" 
                alt="Headphones" 
                className="category-image"
              />
              <h3>Audio Devices</h3>
              <p>Premium Sound Experience</p>
              <button className="category-btn">Shop Audio</button>
            </div>
            
            <div className="category-showcase-item" onClick={() => navigateToCategory('wearables')}>
              <img 
                src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop" 
                alt="Watches" 
                className="category-image"
              />
              <h3>Smart Watches</h3>
              <p>Wearable Technology</p>
              <button className="category-btn">Shop Watches</button>
            </div>
            
            <div className="category-showcase-item" onClick={() => navigateToCategory('video')}>
              <img 
                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop" 
                alt="Television" 
                className="category-image"
              />
              <h3>Televisions</h3>
              <p>Entertainment Systems</p>
              <button className="category-btn">Shop TVs</button>
            </div>
            
            <div className="category-showcase-item" onClick={() => navigateToCategory('speaker')}>
              <img 
                src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop" 
                alt="Speakers" 
                className="category-image"
              />
              <h3>Speakers</h3>
              <p>Powerful Sound Systems</p>
              <button className="category-btn">Shop Speakers</button>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Product Section */}
      <section className="section-extra-product">
        <div className="container grid grid-three--cols">
          <div className="div-extra grid grid-two--cols">
            <div className="extra-text">
              <p>new year sale</p>
              <h3>get and extra 50% off</h3>
              <a href="#">Shop now</a>
            </div>
            <div className="extra-img extra-laptop">
              <img src="/images/laptop.png" alt="Laptop deals" />
            </div>
          </div>

          <div className="div-extra grid grid-two--cols">
            <div className="extra-text">
              <p>new year sale</p>
              <h3>40% discount on speakers</h3>
              <a href="#">Shop now</a>
            </div>
            <div className="extra-img">
              <img src="/images/headphoneEcom.png" alt="Headphone deals" />
            </div>
          </div>

          <div className="div-extra grid grid-two--cols">
            <div className="extra-text">
              <p>new year sale</p>
              <h3>get and extra 50% off</h3>
              <a href="#">Shop now</a>
            </div>
            <div className="extra-img">
              <img src="/images/mobiles.png" alt="Mobile deals" />
            </div>
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section className="section-policy">
        <div className="container grid grid-four--cols">
          <div className="div-policy">
            <div className="icons">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div className="div-policy-text">
              <p>worldwide shipping</p>
              <p>order above $100</p>
            </div>
          </div>

          <div className="div-policy">
            <div className="icons">
              <i className="fa-solid fa-rotate"></i>
            </div>
            <div className="div-policy-text">
              <p>Easy 30 Day Returns</p>
              <p>Back Returns in 7 Days</p>
            </div>
          </div>

          <div className="div-policy">
            <div className="icons">
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </div>
            <div className="div-policy-text">
              <p>money back guarantee</p>
              <p>guarantee with in 30-Days</p>
            </div>
          </div>

          <div className="div-policy">
            <div className="icons">
              <i className="fa-solid fa-headset"></i>
            </div>
            <div className="div-policy-text">
              <p>Easy Online Support</p>
              <p>24/7 Any time support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-products container">
        <div>
          <h2 className="section-common--heading">Checkout Sujan Store</h2>
        </div>
        <section className="container">
          <div id="productContainer">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </section>
    </>
  )
}

export default Products