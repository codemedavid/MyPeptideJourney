import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import SubNav from './components/SubNav';
import MobileNav from './components/MobileNav';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import FloatingCartButton from './components/FloatingCartButton';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Testimonials from './components/Testimonials';
import PeptideCalculator from './components/PeptideCalculator';
import { useMenu } from './hooks/useMenu';
import { OrdersProvider } from './contexts/OrdersContext';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout' | 'calculator'>('menu');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const handleViewChange = (view: 'menu' | 'cart' | 'checkout' | 'calculator') => {
    setCurrentView(view);
    // Scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex flex-col">
      <Header 
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={() => handleViewChange('menu')}
        onCalculatorClick={() => handleViewChange('calculator')}
      />
      
      {currentView === 'menu' && (
        <>
          <SubNav selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} />
          <MobileNav activeCategory={selectedCategory} onCategoryClick={handleCategoryClick} />
        </>
      )}
      
      <main className="flex-grow">
        {currentView === 'menu' && (
          <Menu 
            menuItems={filteredProducts}
            addToCart={cart.addToCart}
            cartItems={cart.cartItems}
            updateQuantity={cart.updateQuantity}
          />
        )}
        
        {currentView === 'cart' && (
          <Cart 
            cartItems={cart.cartItems}
            updateQuantity={cart.updateQuantity}
            removeFromCart={cart.removeFromCart}
            clearCart={cart.clearCart}
            getTotalPrice={cart.getTotalPrice}
            onContinueShopping={() => handleViewChange('menu')}
            onCheckout={() => handleViewChange('checkout')}
          />
        )}
        
        {currentView === 'checkout' && (
          <Checkout 
            cartItems={cart.cartItems}
            totalPrice={cart.getTotalPrice()}
            onBack={() => handleViewChange('cart')}
          />
        )}
        
        {currentView === 'calculator' && (
          <PeptideCalculator 
            onBack={() => handleViewChange('menu')}
          />
        )}
      </main>
      
      {(currentView === 'menu' || currentView === 'calculator') && (
        <>
          {currentView === 'menu' && (
            <FloatingCartButton 
              itemCount={cart.getTotalItems()}
              onCartClick={() => handleViewChange('cart')}
            />
          )}
          {currentView === 'menu' && <Footer />}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <OrdersProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/calculator" element={<PeptideCalculator />} />
        </Routes>
      </Router>
    </OrdersProvider>
  );
}

export default App;
