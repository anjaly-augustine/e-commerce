import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext"; // Path to the context we created
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/CartPage";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import api from "./services/api";

// We create a wrapper component to access the theme state inside the Router
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme(); // Access the current theme (light or dark)

  useEffect(() => {
  const loadUser = async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("token");
  if (token) {
    loadUser();
  } else {
    setLoading(false);
  }
}, []);


  if (loading) return null;

  return (
    // This div ensures the "Ultra Dark" background covers the entire viewport
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* User Protected Routes */}
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />

          {/* Admin ONLY Route */}
          <Route
            path="/admin"
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;