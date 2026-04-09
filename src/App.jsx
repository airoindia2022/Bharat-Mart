import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';

import Cart from './pages/Cart';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />

                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/orders" element={<Orders />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
