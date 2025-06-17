// frontend/src/pages/CheckoutPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, type CartItem } from '../context/CartContext';
import axios from 'axios';
import './CheckoutPage.css';
import placeholderImage from '../assets/placeholder-product.png';

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // Função para obter a URL da imagem do produto, usando um placeholder se necessário
  const getImageUrl = (productImage: string | null) => {
    return productImage && !productImage.includes('placeimg.com')
      ? productImage
      : placeholderImage;
  };

  // Lida com a simulação de pagamento e envio do pedido ao backend
  const handleSimulatePayment = async (paymentType: string) => {
    // Verifica se o carrinho está vazio antes de prosseguir
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.');
      navigate('/products');
      return;
    }

    try {
      // Mapeia os itens do carrinho para o formato esperado pelo backend
      const orderItems = cartItems.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        ...(item.product.hasDiscount && item.product.discountValue !== undefined && { discountValue: item.product.discountValue }),
        quantity: item.quantity,
        image: item.product.image,
      }));

      // Prepara os dados do pedido
      const orderData = {
        items: orderItems,
        totalPrice: getTotalPrice(),
        paymentStatus: 'Aprovado (Simulado)',
        paymentType: paymentType,
      };

      console.log('Enviando pedido para o backend:', orderData);

      // Envia o pedido para a API de ordens
      const response = await axios.post('http://localhost:3000/orders', orderData);

      console.log('Pedido processado pelo backend com sucesso:', response.data);

      // Alerta de sucesso e limpeza do carrinho
      alert(`Compra efetuada com sucesso via ${paymentType}! Seu pedido foi registrado em nosso banco de dados.`);

      clearCart(); // Limpa o carrinho após a compra
      navigate('/products'); // Redireciona para a página de produtos
    } catch (error) {
      // Tratamento de erros durante o processamento do pedido
      console.error('Erro ao finalizar o pedido (fora do fluxo de sucesso esperado):', error);

      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalhes do erro do backend:', error.response.data);
        alert(`Houve um erro ao processar seu pedido: ${error.response.data.message || 'Erro desconhecido'}.`);
      } else {
        alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="checkout-container">
      <h1>Finalizar Compra</h1>

      {/* Renderiza conteúdo diferente se o carrinho estiver vazio */}
      {cartItems.length === 0 ? (
        <div className="empty-checkout">
          <p>Não há itens no seu carrinho para finalizar a compra.</p>
          <button onClick={() => navigate('/products')} className="go-to-products-button">
            Ir para Produtos
          </button>
        </div>
      ) : (
        <>
          {/* Seção de resumo do pedido */}
          <div className="order-summary">
            <h2>Resumo do Pedido</h2>
            {cartItems.map((item: CartItem) => (
              <div key={item.product._id} className="summary-item">
                <img
                  src={getImageUrl(item.product.image)}
                  alt={item.product.name}
                  className="summary-item-image"
                />
                <div className="summary-item-details">
                  <h3>{item.product.name}</h3> {/* Usa product.name diretamente */}
                  <p>
                    Preço Unitário: R$ {(item.product.hasDiscount && item.product.discountValue !== undefined
                      ? (item.product.price - item.product.discountValue)
                      : item.product.price
                    ).toFixed(2)}
                  </p>
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

          {/* Botão para voltar ao carrinho */}
          <button onClick={() => navigate('/cart')} className="back-to-cart-button">
            Voltar para o Carrinho
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;