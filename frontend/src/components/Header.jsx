import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { currentUser, signOut } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      if (!history.includes(searchQuery.toLowerCase())) {
        history.unshift(searchQuery.toLowerCase())
        if (history.length > 5) history.pop()
        localStorage.setItem('searchHistory', JSON.stringify(history))
      }
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = () => {
    signOut()
    setIsMobileMenuOpen(false)
    localStorage.removeItem('loggedInUser')
  }

  const isActiveLink = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link'
  }

  return (
    <header className="section-navbar">
      <section className="top_txt">
        <div className="head container">
          <div className="head_txt">
            <p>Free shipping, 30-day return or refund guarantee.</p>
          </div>
          <div className="sing_in_up">
            {currentUser ? (
              <div className="user-profile">
                <div className="user-info">
                  <div className="user-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="user-details">
                    <h3 className="user-name">{currentUser.name}</h3>
                    <button className="logout-btn" onClick={handleSignOut}>
                      <i className="fa-solid fa-sign-out-alt"></i> Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/signin" className="nav-link">SIGN IN</Link>
                <Link to="/signup" className="nav-link">SIGN UP</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container navbar-flex">
        <div className="navbar-brand">
          <Link to="/">
            <img 
              src="/images/log.svg" 
              alt="sujan eCommerce logo" 
              className="logo" 
              style={{ width: '80%', height: 'auto' }}
            />
          </Link>
        </div>

        <nav className={`navbar ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <ul>
            <li><Link to="/" className={isActiveLink('/')}>Home</Link></li>
            <li><Link to="/myOrders" className={isActiveLink('/myOrders')}>My Order</Link></li>
            <li><Link to="/products" className={isActiveLink('/products')}>Products</Link></li>
            <li><Link to="/contact" className={isActiveLink('/contact')}>Contact</Link></li>
            
            {/* ✅ Only show if admin */}
            {currentUser && currentUser.isAdmin && (
              <li>
                <Link to="/admin" className={isActiveLink('/admin')}>
                  <i className="fa-solid fa-cog"></i> Admin
                </Link>
              </li>
            )}

            <li>
              <Link to="/cart" className="nav-link add-to-cart-button">
                <i className="fa-solid fa-cart-shopping"></i> {cartCount}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="search-box">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
            />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Header
