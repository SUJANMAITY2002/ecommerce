import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useNavigate, useLocation } from 'react-router-dom'
import './AddressForm.css';


const AddressForm = () => {
  const { currentUser } = useAuth()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const totalAmount = location.state?.totalAmount || (getCartTotal() + 50)

  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isNewAddress, setIsNewAddress] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Load saved addresses for this user
    const addresses = JSON.parse(localStorage.getItem(`addresses_${currentUser?.email}`) || '[]')
    setSavedAddresses(addresses)
    
    if (addresses.length > 0) {
      setIsNewAddress(false)
      setSelectedAddress(addresses[0])
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    else if (!/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let addressToUse
    
    if (isNewAddress) {
      if (!validateForm()) return
      addressToUse = formData
      
      // Save new address for future use
      const addresses = JSON.parse(localStorage.getItem(`addresses_${currentUser?.email}`) || '[]')
      const addressExists = addresses.some(addr => 
        addr.address === formData.address && addr.zipCode === formData.zipCode
      )
      
      if (!addressExists) {
        addresses.unshift(formData) // Add to beginning
        if (addresses.length > 5) addresses.pop() // Keep only last 5 addresses
        localStorage.setItem(`addresses_${currentUser?.email}`, JSON.stringify(addresses))
      }
    } else {
      addressToUse = selectedAddress
    }
    
    // Process payment
    processPayment(addressToUse)
  }

  const processPayment = async (shippingAddress) => {
    setIsProcessing(true)

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

      // Get Razorpay key
      const keyResponse = await fetch(`${API_URL}/api/v1/getKey`, {
        method: 'GET',
        credentials: 'include'
      })
      
      if (!keyResponse.ok) {
        throw new Error(`Failed to get payment key: ${keyResponse.status}`)
      }
      
      const keyData = await keyResponse.json()
      
      if (!keyData.success) {
        throw new Error('Failed to get payment configuration')
      }

      // Create order
      const orderResponse = await fetch(`${API_URL}/api/v1/payment/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: totalAmount })
      })

      if (!orderResponse.ok) {
        throw new Error(`Failed to create order: ${orderResponse.status}`)
      }

      const orderData = await orderResponse.json()
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order')
      }

      const options = {
        key: keyData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Sujan EcomStore",
        description: "Payment for your order",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            console.log('Payment response received:', response)
            
            // Verify payment
            const verifyResponse = await fetch(`${API_URL}/api/v1/paymentverification`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyResponse.json()
            console.log('Verification response:', verifyData)

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || 'Payment verification failed')
            }

            // Create order record
            const order = {
              id: `ORD-${Date.now()}`,
              userId: currentUser.email,
              userEmail: currentUser.email,
              items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                category: item.category
              })),
              total: totalAmount,
              subtotal: getCartTotal(),
              tax: 50,
              status: 'processing',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              createdAt: new Date().toISOString(),
              shippingAddress: shippingAddress
            }

            // Save order to localStorage
            const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
            existingOrders.push(order)
            localStorage.setItem('userOrders', JSON.stringify(existingOrders))

            // Send SMS notification (simulate)
            const smsMessage = `Order Confirmed! Order ID: ${order.id}. Total: ₹${totalAmount}. Track your order at sujanstore.com. Thank you for shopping with us!`
            console.log(`SMS sent to ${shippingAddress.phone}: ${smsMessage}`)

            // Clear cart
            clearCart()
            
            // Show success notification
            showNotification('Payment successful! Order placed successfully!', 'success')
            
            // Navigate to success page with payment reference
            navigate(`/paymentSuccess?reference=${response.razorpay_payment_id}`, { 
              replace: true,
              state: { orderDetails: order }
            })

          } catch (error) {
            console.error("Payment verification error:", error)
            showNotification(`Payment verification failed: ${error.message}`, "error")
            setIsProcessing(false)
          }
        },
        prefill: { 
          name: shippingAddress.name, 
          email: currentUser.email,
          contact: shippingAddress.phone
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function() {
            setIsProcessing(false)
            showNotification('Payment cancelled', 'info')
          }
        }
      }

      // Load Razorpay script and open payment modal
      if (!window.Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => {
          const razor = new window.Razorpay(options)
          razor.open()
        }
        script.onerror = () => {
          throw new Error('Failed to load Razorpay script')
        }
        document.body.appendChild(script)
      } else {
        const razor = new window.Razorpay(options)
        razor.open()
      }

    } catch (error) {
      console.error("Payment error:", error)
      showNotification(`Payment failed: ${error.message}`, "error")
      setIsProcessing(false)
    }
  }

  const handleAddressSelection = (address) => {
    setSelectedAddress(address)
  }

  const handleRemoveAddress = (indexToRemove) => {
    const updatedAddresses = savedAddresses.filter((_, index) => index !== indexToRemove)
    setSavedAddresses(updatedAddresses)
    localStorage.setItem(`addresses_${currentUser?.email}`, JSON.stringify(updatedAddresses))
    
    if (selectedAddress === savedAddresses[indexToRemove]) {
      if (updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses[0])
      } else {
        setSelectedAddress(null)
        setIsNewAddress(true)
      }
    }
  }

  const handleCancel = () => {
    navigate('/cart')
  }

  return (
    <div className="address-form-overlay">
      <div className="address-form-container">
        <div className="address-form-header">
          <h2>Shipping Address</h2>
          <button className="close-btn" onClick={handleCancel}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="address-options">
          {savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <h3>Saved Addresses</h3>
              {savedAddresses.map((address, index) => (
                <div 
                  key={index} 
                  className={`address-card ${selectedAddress === address && !isNewAddress ? 'selected' : ''}`}
                  onClick={() => {
                    setIsNewAddress(false)
                    handleAddressSelection(address)
                  }}
                >
                  <div className="address-radio">
                    <input 
                      type="radio" 
                      name="addressOption" 
                      checked={selectedAddress === address && !isNewAddress}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="address-details">
                    <p className="address-name">{address.name}</p>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>Phone: {address.phone}</p>
                  </div>
                  <button 
                    className="btn-remove" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveAddress(index)
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <div 
                className={`address-card new-address ${isNewAddress ? 'selected' : ''}`}
                onClick={() => setIsNewAddress(true)}
              >
                <div className="address-radio">
                  <input 
                    type="radio" 
                    name="addressOption" 
                    checked={isNewAddress}
                    onChange={() => {}}
                  />
                </div>
                <div className="address-details">
                  <p className="new-address-label">
                    <i className="fa-solid fa-plus"></i> Add New Address
                  </p>
                </div>
              </div>
            </div>
          )}

          {isNewAddress && (
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="House no, Building name, Street, Area"
                  className={errors.address ? 'error' : ''}
                ></textarea>
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="6-digit ZIP code"
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                </div>
                
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-proceed"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
