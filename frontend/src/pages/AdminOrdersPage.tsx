import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrdersPage.css';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  discountValue?: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: string;
  paymentType: string;
  createdAt: string;
  updatedAt: string;
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>('https://ecommerce-devnology.onrender.com/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo',
      hour12: false,
    };
    return date.toLocaleString('pt-BR', options);
  };

  if (loading) {
    return <div className="admin-orders-container">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="admin-orders-container error-message">{error}</div>;
  }

  return (
    <div className="admin-orders-container">
      <h2>Pedidos Recebidos</h2>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Pedido ID: {order._id}</h3>
              <p>Total: R$ {order.totalPrice.toFixed(2)}</p>
              <p>Status do Pagamento: {order.paymentStatus}</p>
              <p>Tipo de Pagamento: {order.paymentType}</p>
              <p>Data e Hora: {formatDateTime(order.createdAt)}</p>
              <h4>Itens do Pedido:</h4>
              <ul className="order-items-list">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity}) - R$ {(item.quantity * (item.price - (item.discountValue || 0))).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;