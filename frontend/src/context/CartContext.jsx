import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartProductLS") || "[]");
    setCartItems(storedCart);
  }, []);

  // Save to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartProductLS", JSON.stringify(cartItems));
  }, [cartItems]);

const addToCart = (product) => {
  let message = "";
  let success = true;

  setCartItems((prev) => {
    const existing = prev.find((item) => item.id === product.id);
    if (existing) {
      message = "Quantity updated in cart";
      return prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
    } else {
      message = "Product added to cart";
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    }
  });

  return { success, message };
};


  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // ✅ Add cartCount for Header button
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
const updateCartValue = () => {
  const storedCart = JSON.parse(localStorage.getItem("cartProductLS") || "[]");
  setCartItems(storedCart);
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        cartCount,
        updateCartValue, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
