import { Outlet } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';

import { CartProvider, useCart } from './context/CartContext';
const AppHeader = () => {
  
  const { getTotalItems } = useCart();

  return <Header totalCartItems={getTotalItems()} />;
};

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <AppHeader />
        <main className="main-content">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;