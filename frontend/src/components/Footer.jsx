import { useState } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleNewsletterSubscription = (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      showMessage('Please enter your email address', 'error')
      return
    }

    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address', 'error')
      return
    }

    // Store newsletter subscription
    let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]')
    
    if (subscribers.includes(email)) {
      showMessage('You are already subscribed!', 'info')
      return
    }

    subscribers.push(email)
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers))
    
    setEmail('')
    showMessage('Thank you for subscribing to our newsletter!', 'success')
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  return (
    <footer className="section-footer">
      <div className="footer-container container">
        <div className="content_1">
          <img src="/images/logo.png" alt="logo" />
          <p>
            Welcome to Sujan EcomStore, your ultimate destination for
            cutting-edge gadgets!
          </p>
          <img src="https://i.postimg.cc/Nj9dgJ98/cards.png" alt="cards" />
        </div>

        <div className="content_2">
          <h4>SHOPPING</h4>
          <Link to="/category/computers">Computer Store</Link>
          <Link to="/category/laptops">Laptop Store</Link>
          <Link to="/category/accessories">Accessories</Link>
          <Link to="/products">Sales & Discount</Link>
        </div>

        <div className="content_3">
          <h4>Experience</h4>
          <Link to="/contact">Contact Us</Link>
          <a href="#" target="_blank" rel="noopener noreferrer">Payment Method</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Delivery</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Return and Exchange</a>
        </div>

        <div className="content_4">
          <h4>NEWSLETTER</h4>
          <p>Be the first to know about new<br />arrivals, sales & promos!</p>
          <form className="f-mail" onSubmit={handleNewsletterSubscription}>
            <input 
              type="email" 
              placeholder="Your Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-btn">
              <i className="fa-solid fa-envelope"></i>
            </button>
          </form>
          {message && (
            <div className={`newsletter-message newsletter-${message.type}`}>
              {message.text}
            </div>
          )}
          <hr />
        </div>
      </div>
      
      <div className="f-design">
        <div className="f-design-txt">
          <p>Design and Code by Sujan Technical</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer