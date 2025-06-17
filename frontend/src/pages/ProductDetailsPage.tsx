import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { type Product } from '../components/ProductCard'; 
import { useCart } from '../context/CartContext';
import './ProductDetailsPage.css';

import placeholderImage from '../assets/placeholder-product.png';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID do produto não fornecido.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<Product>(`http://localhost:3000/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do produto:', err);
        setError('Falha ao carregar detalhes do produto. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="details-loading">Carregando detalhes do produto...</div>;
  }

  if (error) {
    return <div className="details-error">{error}</div>;
  }

  if (!product) {
    return <div className="details-not-found">Produto não encontrado.</div>;
  }

  const imageUrl = product.image && !product.image.includes('placeimg.com')
    ? product.image
    : placeholderImage;

  const handleAddToCart = () => {
    // Usando product.name diretamente
    const confirmation = window.confirm(`Deseja realmente adicionar "${product.name}" ao carrinho?`);
    if (confirmation) {
      addToCart(product);
      console.log('Produto adicionado ao carrinho:', product);
    } else {
      console.log('Adição ao carrinho cancelada para:', product.name);
    }
  };

  return (
    <div className="product-details-container">
      <button onClick={() => navigate('/products')} className="back-button">
        &larr; Voltar para Produtos
      </button>
      <div className="product-details-card">
        <img src={imageUrl} alt={product.name} className="product-details-image" />
        <div className="product-details-info">
          <h1 className="product-details-name">{product.name}</h1>
          <p className="product-details-category">
            Categoria: {product.category || 'N/A'}
          </p>
          <p className="product-details-description">
            {product.description} 
          </p>
          <div className="product-details-pricing">
            <span className="current-price">R$ {product.price.toFixed(2)}</span>
            {product.hasDiscount && (
              <>
                <span className="original-price-details">R$ {product.price.toFixed(2)}</span>
                <span className="discount-value-details">(-R$ {product.discountValue.toFixed(2)})</span>
              </>
            )}
          </div>
          <p className="product-details-material">Material: {product.material || 'N/A'}</p>
          <p className="product-details-department">Departamento: {product.department || 'N/A'}</p>
          
          <button onClick={handleAddToCart} className="add-to-cart-details-button">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;