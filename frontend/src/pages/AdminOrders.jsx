import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import './AdminOrders.css'

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useAdmin()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.status === filterStatus
  )

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    showNotification(`Order status updated to ${newStatus}`, 'success')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending:    '#f39c12',
      processing: '#3498db',
      shipped:    '#9b59b6',
      delivered:  '#27ae60',
      cancelled:  '#e74c3c',
    }
    return colors[status] || '#95a5a6'
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="order-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.shippingAddress?.name || 'N/A'}</strong>
                      <small>{order.userEmail}</small>
                    </div>
                  </td>
                  <td>{order.items?.length ?? 0} items</td>
                  <td>₹{order.total?.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="status-select"
                      style={{ backgroundColor: getStatusColor(order.status), color: 'white' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-view" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details — #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="order-info-grid">
                <div className="order-section">
                  <h4>Customer</h4>
                  <p><strong>Name:</strong> {selectedOrder.shippingAddress?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                </div>
                <div className="order-section">
                  <h4>Shipping Address</h4>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                  <p>{selectedOrder.shippingAddress?.zipCode}</p>
                </div>
                <div className="order-section">
                  <h4>Order Info</h4>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Payment ID:</strong> {selectedOrder.paymentId || 'N/A'}</p>
                </div>
              </div>

              <div className="order-items-section">
                <h4>Order Items</h4>
                <div className="order-items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item-detail">
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                      <div className="item-info">
                        <h5>{item.name}</h5>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                        <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-total-section">
                <div className="total-breakdown">
                  <p>Subtotal: ₹{selectedOrder.subtotal?.toFixed(2) || (selectedOrder.total - 50).toFixed(2)}</p>
                  <p>Tax: ₹{selectedOrder.tax || 50}</p>
                  <p><strong>Total: ₹{selectedOrder.total?.toFixed(2)}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
