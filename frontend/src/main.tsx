import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css'; 

import HomePage from './pages/HomePage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage.tsx';

import CartPage from './pages/CartPage.tsx'; 
import CheckoutPage from './pages/CheckoutPage.tsx'; 

import AdminLoginPage from './pages/AdminLoginPage.tsx'; 
import AdminOrdersPage from './pages/AdminOrdersPage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />

        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} /> 
          
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);