import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import placeholderImage from '../assets/placeholder-product.png';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string | null;
  image: string | null;
  price: number;
  material: string | null;
  department: string | null;
  supplierProductId: string;
  supplier: 'brazilian' | 'european';
  hasDiscount: boolean;
  discountValue: number;
  gallery: string[];
  adjective: string | null;
  detailsMaterial: string | null;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const displayPrice = product.hasDiscount && product.discountValue
    ? (product.price - product.discountValue).toFixed(2)
    : product.price.toFixed(2);

  const imageUrl = product.image && !product.image.includes('placeimg.com')
    ? product.image
    : placeholderImage;

  const handleAddToCart = () => {
    const confirmation = window.confirm(`Deseja realmente adicionar "${product.name}" ao carrinho?`);

    if (confirmation) {
      addToCart(product);
      console.log('Produto adicionado ao carrinho:', product);
    } else {
      console.log('Adição ao carrinho cancelada para:', product.name);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link-details">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <span className="details-text">Detalhes do Produto</span>
        </div>
      </Link>

      <div className="product-pricing">
        <p className="product-price">R$ {displayPrice}</p>
        {product.hasDiscount && (
          <p className="product-discount">
            <span className="original-price">R$ {product.price.toFixed(2)}</span> (-R$ {product.discountValue.toFixed(2)})
          </p>
        )}
      </div>

      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default ProductCard;