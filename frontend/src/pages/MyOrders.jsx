import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { showNotification } from '../components/Notification'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const { currentUser, isLoggedIn } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn()) {
      showNotification('Please login to view your orders', 'error')
      navigate('/signin')
      return
    }
    loadOrders()
  }, [currentUser, isLoggedIn, navigate])

  const loadOrders = () => {
    setIsLoading(true)
    const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    const userOrders = allOrders.filter(
      order => order.userId === currentUser?.id || order.userEmail === currentUser?.email
    )
    
    // Sort by creation date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    setOrders(userOrders)
    setFilteredOrders(userOrders)
    setIsLoading(false)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    if (filter === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.status.toLowerCase() === filter))
    }
  }

  const trackOrder = (orderId) => {
    showNotification(`Tracking order ${orderId}. You will receive tracking information via email.`, 'info')
  }

  const viewOrderDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      const itemsList = order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')
      showNotification(`Order Details:\nOrder ID: ${order.id}\nStatus: ${order.status}\nTotal: $${order.total.toFixed(2)}\nItems: ${itemsList}`, 'info')
    }
  }

  const reorder = (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      let itemsAdded = 0
      order.items.forEach(item => {
        const result = addToCart({ ...item })
        if (result.success) itemsAdded++
      })
      
      if (itemsAdded > 0) {
        showNotification(`${itemsAdded} item${itemsAdded !== 1 ? 's' : ''} added to your cart!`, 'success')
      }
    }
  }

  const cancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
      const orderIndex = allOrders.findIndex(o => o.id === orderId)
      if (orderIndex !== -1) {
        allOrders[orderIndex].status = 'cancelled'
        localStorage.setItem('userOrders', JSON.stringify(allOrders))
        showNotification('Order has been cancelled successfully.', 'success')
        loadOrders()
      }
    }
  }

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase()}`
  }

  const canCancel = (order) => {
    return order.status === 'pending' || order.status === 'processing'
  }

  if (isLoading) {
    return (
      <main className="orders-container">
        <div className="loading-container">
          <p>Loading your orders...</p>
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>
        <div className="no-orders">
          <i className="fa-solid fa-shopping-cart"></i>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="shop-now-btn">Start Shopping</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <div className="orders-filter">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(filter => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Orders
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <h3>No {activeFilter} Orders Found</h3>
            <p>You don't have any orders with this status.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card" data-status={order.status.toLowerCase()}>
              <div className="order-header">
                <div>
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map(item => (
                  <div key={`${order.id}-${item.id}`} className="order-item">
                    <img 
                      src={item.image || '/images/placeholder.jpg'} 
                      alt={item.name} 
                      className="item-image"
                    />
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                    </div>
                    <div className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="order-total">Total: ${order.total.toFixed(2)}</div>
                <div className="order-actions">
                  {order.status !== 'cancelled' && (
                    <button 
                      className="action-btn btn-track"
                      onClick={() => trackOrder(order.id)}
                    >
                      <i className="fa-solid fa-truck"></i> Track
                    </button>
                  )}
                  <button 
                    className="action-btn btn-details"
                    onClick={() => viewOrderDetails(order.id)}
                  >
                    <i className="fa-solid fa-eye"></i> Details
                  </button>
                  <button 
                    className="action-btn btn-reorder"
                    onClick={() => reorder(order.id)}
                  >
                    <i className="fa-solid fa-repeat"></i> Reorder
                  </button>
                  {canCancel(order) && (
                    <button 
                      className="action-btn btn-cancel"
                      onClick={() => cancelOrder(order.id)}
                    >
                      <i className="fa-solid fa-times"></i> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

export default MyOrders