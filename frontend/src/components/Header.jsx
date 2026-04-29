import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Header.css'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { currentUser, signOut } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // Save to search history
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const q = searchQuery.toLowerCase()
    if (!history.includes(q)) {
      history.unshift(q)
      if (history.length > 5) history.pop()
      localStorage.setItem('searchHistory', JSON.stringify(history))
    }
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
  }

  const isActive = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <header className="section-navbar">

      {/* Top bar */}
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
                    <p className="user-name">{currentUser.name}</p>
                    {/* signOut() already clears localStorage — no need to do it again */}
                    <button className="logout-btn" onClick={signOut}>
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

      {/* Main nav */}
      <div className="container navbar-flex">
        <div className="navbar-brand">
          <Link to="/">
            <img
              src="/images/log.svg"
              alt="Sujan eCommerce"
              style={{ width: '80%', height: 'auto' }}
            />
          </Link>
        </div>

        <nav className="navbar">
          <ul>
            <li><Link to="/"          className={isActive('/')}>Home</Link></li>
            <li><Link to="/myOrders"  className={isActive('/myOrders')}>My Orders</Link></li>
            <li><Link to="/products"  className={isActive('/products')}>Products</Link></li>
            <li><Link to="/contact"   className={isActive('/contact')}>Contact</Link></li>

            {/* Admin link — only visible to admins */}
            {currentUser?.isAdmin && (
              <li>
                <Link to="/admin" className={isActive('/admin')}>
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