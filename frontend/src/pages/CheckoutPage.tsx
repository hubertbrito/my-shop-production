import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, type CartItem } from '../context/CartContext';
import axios from 'axios';
import './CheckoutPage.css';
import placeholderImage from '../assets/placeholder-product.png';
import { FaArrowLeft } from 'react-icons/fa';

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // Obtém a URL da imagem do produto
  const getImageUrl = (productImage: string | null) => {
    return productImage && !productImage.includes('placeimg.com')
      ? productImage
      : placeholderImage;
  };

  // Simula o pagamento e envia o pedido
  const handleSimulatePayment = async (paymentType: string) => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.');
      navigate('/products');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        ...(item.product.hasDiscount && item.product.discountValue !== undefined && { discountValue: item.product.discountValue }),
        quantity: item.quantity,
        image: item.product.image,
      }));

      const orderData = {
        items: orderItems,
        totalPrice: getTotalPrice(),
        paymentStatus: 'Aprovado (Simulado)',
        paymentType: paymentType,
      };

      await axios.post('http://localhost:3000/orders', orderData);

      alert(`Compra efetuada com sucesso via ${paymentType}! Seu pedido foi registrado em nosso banco de dados.`);

      clearCart();
      navigate('/products');
    } catch (error) {
      console.error('Erro ao finalizar o pedido:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Houve um erro ao processar seu pedido: ${error.response.data.message || 'Erro desconhecido'}.`);
      } else {
        alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="checkout-container">
      {/* Botão para voltar ao carrinho no topo da página */}
      <div className="top-actions-checkout">
        <Link to="/cart" className="back-to-cart-button-top">
          <FaArrowLeft className="arrow-icon" /> Voltar para o Carrinho
        </Link>
      </div>

      <h1>Finalizar Compra</h1>

      {/* Exibe conteúdo diferente se o carrinho estiver vazio */}
      {cartItems.length === 0 ? (
        <div className="empty-checkout">
          <p>Não há itens no seu carrinho para finalizar a compra.</p>
          <button onClick={() => navigate('/products')} className="go-to-products-button">
            Ir para Produtos
          </button>
        </div>
      ) : (
        <>
          {/* Seção de resumo do pedido com os itens do carrinho */}
          <div className="order-summary">
            <h2>Resumo do Pedido</h2>
            <div className="summary-items-list">
              {cartItems.map((item: CartItem) => (
                <div key={item.product._id} className="summary-item">
                  <img
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    className="summary-item-image"
                  />
                  <div className="summary-item-details">
                    <h3>{item.product.name}</h3>
                    <p>Preço Unitário: R$ {(item.product.hasDiscount && item.product.discountValue !== undefined
                      ? (item.product.price - item.product.discountValue)
                      : item.product.price
                    ).toFixed(2)}</p>
                    <p>Quantidade: {item.quantity}</p>
                    <p>Subtotal: R$ {(
                      (item.product.hasDiscount && item.product.discountValue !== undefined
                        ? (item.product.price - item.product.discountValue)
                        : item.product.price
                      ) * item.quantity
                    ).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-price-section">
              <h3>Total do Pedido: <span>R$ {getTotalPrice().toFixed(2)}</span></h3>
            </div>
          </div>

          {/* Opções de pagamento simuladas */}
          <div className="payment-options">
            <h2>Opções de Pagamento (Simulado)</h2>
            <button onClick={() => handleSimulatePayment('Pix')} className="payment-button pix-button">
              Pagar com Pix (Simulado)
            </button>
            <button onClick={() => handleSimulatePayment('Cartão de Crédito')} className="payment-button credit-card-button">
              Pagar com Cartão de Crédito (Simulado)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;