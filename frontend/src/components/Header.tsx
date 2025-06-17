import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  totalCartItems: number;
}

const Header: React.FC<HeaderProps> = ({ totalCartItems }) => {
  return (
    <header className="app-header">
      <nav>
        <Link to="/" className="logo">Minha Loja</Link>
        <div className="nav-links">
          <Link to="/products">Produtos</Link>
          <Link to="/cart" className="cart-link">
            Carrinho ({totalCartItems})
          </Link>
          <Link to="/admin-login" className="admin-link">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;