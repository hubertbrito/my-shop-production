import React from 'react';
import { useCart, type CartItem } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';
import { FaArrowLeft } from 'react-icons/fa';

import placeholderImage from '../assets/placeholder-product.png';

const CartPage: React.FC = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  console.log('Conteúdo atual do carrinho na CartPage:', cartItems);

  const handleIncrease = (productId: string) => {
    increaseQuantity(productId);
  };

  const handleDecrease = (productId: string) => {
    decreaseQuantity(productId);
  };

  const handleRemove = (productId: string) => {
    const confirmation = window.confirm('Deseja realmente remover este produto do carrinho?');
    if (confirmation) {
      removeFromCart(productId);
    }
  };

  const getImageUrl = (productImage: string | null) => {
    return productImage && !productImage.includes('placeimg.com')
      ? productImage
      : placeholderImage;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <div className="top-actions">
        <Link to="/products" className="continue-shopping-button-top">
          <FaArrowLeft className="arrow-icon" /> Continuar Comprando
        </Link>
      </div>

      <h1>Seu Carrinho de Compras</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio. Que tal explorar nossos produtos?</p>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map((item: CartItem) => {
              const itemPrice = (item.product.hasDiscount && item.product.discountValue)
                ? (item.product.price - item.product.discountValue)
                : item.product.price;

              const itemSubtotal = itemPrice * item.quantity;

              return (
                <div key={item.product._id} className="cart-item">
                  <Link to={`/products/${item.product._id}`} className="cart-item-image-link">
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/products/${item.product._id}`} className="cart-item-name">{item.product.name}</Link>
                    <p className="cart-item-price">R$ {itemSubtotal.toFixed(2)}</p>
                    <div className="cart-item-quantity-controls">
                      <button onClick={() => handleDecrease(item.product._id)} className="quantity-button">
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.product._id)} className="quantity-button">
                        +
                      </button>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(item.product._id)} className="remove-item-button">
                    Remover
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Resumo do Pedido</h2>
            <p className="cart-total">Total: <span>R$ {getTotalPrice().toFixed(2)}</span></p>
            <button className="checkout-button" onClick={handleCheckout}>
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;