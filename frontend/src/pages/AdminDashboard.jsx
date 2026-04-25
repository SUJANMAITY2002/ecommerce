import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { stats, orders, products } = useAdmin()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const recentOrders = orders.slice(0, 5)
  const lowStockProducts = products.filter(product => product.stock < 10)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'orders') {
      navigate('/admin/orders')
    } else if (tab === 'products') {
      navigate('/admin/products')
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your ecommerce store</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn`}
          onClick={() => handleTabChange('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab-btn`}
          onClick={() => handleTabChange('products')}
        >
          Products
        </button>
      </div>

      <div className="overview-tab">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-shopping-cart"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-box"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="recent-orders">
            <h3>Recent Orders</h3>
            {recentOrders.length > 0 ? (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.userEmail}</td>
                        <td>₹{order.total}</td>
                        <td>
                          <span className={`status-badge status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>

          <div className="low-stock-alert">
            <h3>Low Stock Alert</h3>
            {lowStockProducts.length > 0 ? (
              <div className="low-stock-products">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="low-stock-item">
                    <img src={product.image} alt={product.name} />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard