import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductCard, { type Product } from '../components/ProductCard';
import '../components/ProductCard.css';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('https://my-shop-production-backend.onrender.com/products');
        setProducts(response.data);
        console.log('Produtos carregados:', response.data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Falha ao carregar produtos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const allCategories = products.map(p => p.category).filter(Boolean) as string[];
    const uniqueCategories = Array.from(new Set(allCategories));
    return ['all', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (filteredProducts.length === 0 && !loading && !error) {
    return (
      <div className="products-page-container">
        <h2 className="products-page-title">Nossos Produtos</h2>
        <div className="filter-controls">
          <label htmlFor="category-select" className="filter-label">Filtrar por Categoria:</label>
          <select
            id="category-select"
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas as Categorias</option>
            {categories
              .filter(cat => cat !== 'all')
              .sort((a, b) => a.localeCompare(b))
              .map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
        <div className="no-products-message">Nenhum produto encontrado para a categoria selecionada.</div>
      </div>
    );
  }

  return (
    <div className="products-page-container">
      <h2 className="products-page-title">Nossos Produtos</h2>
      <div className="filter-controls">
        <label htmlFor="category-select" className="filter-label">Filtrar por Categoria:</label>
        <select
          id="category-select"
          className="category-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Todas as Categorias</option>
          {categories
            .filter(cat => cat !== 'all')
            .sort((a, b) => a.localeCompare(b))
            .map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>
      </div>
      <div className="products-grid">
        {filteredProducts.map(product => {
          return (
            <ProductCard
              key={product._id}
              product={product}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;