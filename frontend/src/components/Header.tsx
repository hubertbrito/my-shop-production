import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShoppingCart, FaUserShield } from 'react-icons/fa';

import './Header.css';

interface HeaderProps {
  totalCartItems: number;
}

const Header: React.FC<HeaderProps> = ({ totalCartItems }) => {
  return (
    <header className="app-header">
      <nav>
        <Link to="/" className="logo" aria-label="Página Inicial da Loja">
          <FaStore className="logo-icon" />
        </Link>
        <div className="nav-links">
          <Link to="/products" className="products-link">Produtos</Link> 
          <Link to="/cart" className="cart-link" aria-label="Ver Carrinho de Compras">
            <FaShoppingCart className="cart-icon" />
            {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
          </Link>
          <Link to="/admin-login" className="admin-link" aria-label="Acesso à Área Administrativa">
            <FaUserShield className="admin-icon" /> Admin
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;