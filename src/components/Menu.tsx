import React from 'react';
import MenuItemCard from './MenuItemCard';
import ProductDetailModal from './ProductDetailModal';
import Hero from './Hero';
import type { Product, ProductVariation, CartItem } from '../types';
import { Search, Filter, Sparkles, Package } from 'lucide-react';

interface MenuProps {
  menuItems: Product[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  cartItems: CartItem[];
  updateQuantity: (index: number, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name' | 'price' | 'purity'>('name');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Filter products based on search
  const filteredProducts = menuItems.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.cas_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to check if product is Tirzepatide (best seller)
  const isTirzepatide = (product: Product) => {
    return product.name.toLowerCase().includes('tirzepatide');
  };

  // Sort products - Always prioritize Tirzepatide products first
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aIsTirzepatide = isTirzepatide(a);
    const bIsTirzepatide = isTirzepatide(b);
    
    // If one is Tirzepatide and the other isn't, Tirzepatide comes first
    if (aIsTirzepatide && !bIsTirzepatide) return -1;
    if (!aIsTirzepatide && bIsTirzepatide) return 1;
    
    // If both are Tirzepatide or both are not, sort by selected criteria
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.base_price - b.base_price;
      case 'purity':
        return b.purity_percentage - a.purity_percentage;
      default:
        return 0;
    }
  });

  const getCartQuantity = (productId: string, variationId?: string) => {
    return cartItems
      .filter(item => 
        item.product.id === productId && 
        (variationId ? item.variation?.id === variationId : !item.variation)
      )
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Hero />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 lg:py-8">
        {/* Search and Filter Controls */}
        <div className="mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row gap-2 md:gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search peptides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 lg:py-4 text-sm md:text-base border-2 border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all bg-white"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 md:gap-3 sm:w-auto bg-white rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 border-2 border-gray-200 shadow-sm">
            <Filter className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'purity')}
              className="px-1 md:px-2 py-1 md:py-2 focus:outline-none bg-transparent font-medium text-gray-700 text-xs md:text-sm lg:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="purity">Sort by Purity</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 md:mb-6 flex items-center gap-1.5 md:gap-2">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
          <p className="text-gray-700 font-medium text-xs md:text-sm lg:text-base">
            Showing <span className="font-bold text-blue-600">{sortedProducts.length}</span> premium product{sortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-10 md:py-16 lg:py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10 lg:p-12 max-w-md mx-auto border-2 border-gray-100">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Package className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 md:mb-3">No products found</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                {searchQuery 
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : 'No products available in this category. Please check back soon!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm md:text-base shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {sortedProducts.map((product) => (
              <MenuItemCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                cartQuantity={getCartQuantity(product.id)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Menu;
