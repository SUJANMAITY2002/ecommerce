import { useEffect, useState } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const { currentUser } = useAuth()
  const paymentId = searchParams.get('reference')

  useEffect(() => {
    console.log('PaymentSuccess mounted with paymentId:', paymentId)
    console.log('Location state:', location.state)
    
    // First check if order details were passed through navigation state
    if (location.state?.orderDetails) {
      console.log('Order details found in location state')
      setOrderDetails(location.state.orderDetails)
      setIsLoading(false)
      return
    }

    if (!paymentId) {
      console.log('No payment ID found')
      setIsLoading(false)
      return
    }

    // Function to search for the order
    const findOrder = () => {
      console.log(`Searching for order with paymentId: ${paymentId} (attempt ${retryCount + 1})`)
      
      const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
      console.log('All orders:', orders)
      
      const order = orders.find(o => o.paymentId === paymentId)
      
      if (order) {
        console.log('Order found:', order)
        setOrderDetails(order)
        setIsLoading(false)
      } else {
        console.log('Order not found, retrying...')
        if (retryCount < 5) { // Retry up to 5 times
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 1000) // Wait 1 second before retrying
        } else {
          console.log('Max retries reached, order not found')
          setIsLoading(false)
        }
      }
    }

    findOrder()
  }, [paymentId, location.state, retryCount])

  if (isLoading) {
    return (
      <div className="payment-success-container">
        <div className="container">
          <div className="success-content">
            <div className="loading">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p>Loading order details...</p>
              {retryCount > 0 && <p><small>Searching for your order... ({retryCount}/5)</small></p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!paymentId) {
    return (
      <div className="payment-success-container">
        <div className="container">
          <div className="success-content">
            <div className="error-message">
              <i className="fa-solid fa-exclamation-triangle"></i>
              <h2>Invalid Payment Reference</h2>
              <p>No payment reference found. Please check your order history.</p>
              <Link to="/myorders" className="btn btn-primary">View Orders</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="payment-success-container">
        <div className="container">
          <div className="success-content">
            <div className="success-icon">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            
            <h1>Payment Successful!</h1>
            <p className="success-message">
              Your payment has been processed successfully. Your order is being prepared.
            </p>

            <div className="order-summary-card">
              <h2>Payment Confirmation</h2>
              <div className="order-info">
                <div className="info-row">
                  <span>Payment ID:</span>
                  <strong>{paymentId}</strong>
                </div>
                <div className="info-row">
                  <span>Status:</span>
                  <span className="status-badge processing">Payment Confirmed</span>
                </div>
              </div>
              
              <p>Order details are being processed and will appear in your order history shortly.</p>
            </div>

            <div className="success-actions">
              <Link to="/myorders" className="btn btn-primary">
                View My Orders
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
            </div>

            <div className="notification-info">
              <p>
                <i className="fa-solid fa-mobile-screen"></i>
                Order confirmation will be sent to your registered phone number.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-success-container">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">
            <i className="fa-solid fa-check-circle"></i>
          </div>
          
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="order-info">
              <div className="info-row">
                <span>Order ID:</span>
                <strong>#{orderDetails.id}</strong>
              </div>
              <div className="info-row">
                <span>Payment ID:</span>
                <strong>{orderDetails.paymentId}</strong>
              </div>
              <div className="info-row">
                <span>Total Amount:</span>
                <strong>₹{orderDetails.total.toFixed(2)}</strong>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span className="status-badge processing">Processing</span>
              </div>
            </div>

            <div className="ordered-items">
              <h3>Items Ordered</h3>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="item-summary">
                  <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {orderDetails.shippingAddress && (
              <div className="shipping-info">
                <h3>Shipping Address</h3>
                <div className="address-details">
                  <p><strong>{orderDetails.shippingAddress.name}</strong></p>
                  <p>{orderDetails.shippingAddress.address}</p>
                  <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
                  <p>Phone: {orderDetails.shippingAddress.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="success-actions">
            <Link to="/myorders" className="btn btn-primary">
              View My Orders
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>

          <div className="notification-info">
            <p>
              <i className="fa-solid fa-mobile-screen"></i>
              Order confirmation and tracking details have been sent to your registered phone number.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess