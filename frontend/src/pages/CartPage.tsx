// frontend/src/pages/CartPage.tsx
import React from 'react';
import { useCart, type CartItem } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

import placeholderImage from '../assets/placeholder-product.png';

const CartPage: React.FC = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  // Loga o conteúdo atual do carrinho para depuração
  console.log('Conteúdo atual do carrinho na CartPage:', cartItems);

  // Funções para manipular a quantidade de itens no carrinho
  const handleIncrease = (productId: string) => {
    increaseQuantity(productId);
  };

  const handleDecrease = (productId: string) => {
    decreaseQuantity(productId);
  };

  // Lida com a remoção de um item do carrinho, pedindo confirmação
  const handleRemove = (productId: string) => {
    const confirmation = window.confirm('Deseja realmente remover este produto do carrinho?');
    if (confirmation) {
      removeFromCart(productId);
    }
  };

  // Determina a URL da imagem do produto, usando um placeholder se necessário
  const getImageUrl = (productImage: string | null) => {
    return productImage && !productImage.includes('placeimg.com')
      ? productImage
      : placeholderImage;
  };

  // Redireciona para a página de checkout ou alerta se o carrinho estiver vazio
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.');
      navigate('/products');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <h1>Seu Carrinho de Compras</h1>

      {/* Bloco condicional para carrinho vazio ou com itens */}
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio. Que tal explorar nossos produtos?</p>
          <Link to="/products" className="continue-shopping-button">
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <>
          {/* Lista de itens no carrinho */}
          <div className="cart-items-list">
            {cartItems.map((item: CartItem) => {
              const itemPrice = (item.product.hasDiscount && item.product.discountValue)
                ? (item.product.price - item.product.discountValue)
                : item.product.price;

              const itemSubtotal = itemPrice * item.quantity;

              return (
                <div key={item.product._id} className="cart-item">
                  {/* Link e imagem do produto */}
                  <Link to={`/products/${item.product._id}`} className="cart-item-image-link">
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                  </Link>
                  {/* Detalhes do item: nome, preço e controles de quantidade */}
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
                  {/* Botão para remover item */}
                  <button onClick={() => handleRemove(item.product._id)} className="remove-item-button">
                    Remover
                  </button>
                </div>
              );
            })}
          </div>

          {/* Resumo do carrinho: total e botões de ação */}
          <div className="cart-summary">
            <h2>Resumo do Pedido</h2>
            <p className="cart-total">Total: <span>R$ {getTotalPrice().toFixed(2)}</span></p>
            <button className="checkout-button" onClick={handleCheckout}>
              Finalizar Compra
            </button>
            <Link to="/products" className="continue-shopping-button">
              Continuar Comprando
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;