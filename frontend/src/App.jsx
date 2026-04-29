import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Notification from "./components/Notification";
import AddressForm from "./components/AddressForm.jsx";
import AdminRoute from "./components/AdminRoute";

// Pages (User side)
import Home from "./pages/Home";
import Products from "./pages/Products";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CategoryPage from "./pages/CategoryPage";
import PaymentSuccess from "./pages/PaymentSuccess";
// import ForgotPassword from "./pages/ForgotPassword";

// Pages (Admin side)
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";

// Contexts
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext"; 

function App() {
  const { cartCount } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("User from context:", currentUser);
    console.log("Cart items count:", cartCount);
  }, [currentUser, cartCount]);

  return (
    <div className="App">
      <Header />
      <Notification />
      <main>
        <AdminProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />
            <Route path="/addressForm" element={<AddressForm />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
          </Routes>
        </AdminProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
