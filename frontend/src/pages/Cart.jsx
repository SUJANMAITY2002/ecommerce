import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
//import AddressForm from '../components/AddressForm.jsx'
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { isLoggedIn } = useAuth()
 // const [showAddressForm, setShowAddressForm] = useState(false)

 const navigate = useNavigate();

const handleCheckout = () => {
  if (!isLoggedIn()) {
    showNotification('Please login to proceed with checkout', 'error')
    return
  }

  if (cartItems.length === 0) {
    showNotification('Your cart is empty', 'error')
    return
  }

  
  navigate("/addressForm")
  // handleCheckout
navigate("/addressForm", { state: { totalAmount: getCartTotal() + 50 } })

}


  if (cartItems.length === 0) {
    return (
      <section className="addToCartElement">
        <div className="container">
          <div id="productCartContainer">
            <p>Your cart is empty</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="addToCartElement">
      <div className="container">
        <section>
          <div id="productCartContainer">
            {cartItems.map((item) => (
              <div className="cards" key={item.id}>
                <article className="information [ card ]">
                  <div>
                    <span className="category">{item.category}</span>
                  </div>
                  <div className="imageContainer">
                    <img
                      className="productImage"
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name}
                    />
                  </div>
                  <h2 className="productName">{item.name}</h2>
                  <p className="productPrice">₹{item.price}</p>

                  <div className="stockElement">
                    <button
                      className="cartIncrement"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <p className="productQuantity">{item.quantity}</p>
                    <button
                      className="cartDecrement"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                  </div>

                  <button
                    className="add-to-cart-button remove-to-cart-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="productCartTotalElem">
          <div className="productCartTotalElement">
            <p>Selected Offer Summary</p>
            <div className="productOrderTotal">
              <div>
                <p>Sub Total:</p>
                <p className="productSubTotal">₹{getCartTotal()}</p>
              </div>
              <div>
                <p>Tax (₹50 fixed):</p>
                <p className="productTax">₹50</p>
              </div>
              <hr />
              <div>
                <p>Final Total:</p>
                <p className="productFinalTotal">
                  ₹{getCartTotal() + 50}
                </p>
              </div>
              <div>
                <button
                  className="ordernow"
                  onClick={handleCheckout}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default Cart
