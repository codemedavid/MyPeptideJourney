import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Edit, Trash2, Package, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import type { Product } from '../types';
import { useMenu } from '../hooks/useMenu';
import { useOrders } from '../contexts/OrdersContext';
import { useCategories } from '../hooks/useCategories';
import { formatPrice } from '../utils/currency';

interface InventoryManagementProps {
  onBack: () => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ onBack }) => {
  const { products, loading, refreshProducts } = useMenu();
  const { orders, refreshOrders } = useOrders();
  const { categories } = useCategories();
  
  // Refresh orders when component mounts to ensure latest data
  useEffect(() => {
    refreshOrders();
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Calculate statistics
  const stats = useMemo(() => {
    // Calculate total sales income from completed orders
    const totalSales = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + Number(order.total_amount), 0);

    // Count vials sold from completed orders
    const vialsSold = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => {
        const itemsCount = order.order_items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0;
        return sum + itemsCount;
      }, 0);

    // Calculate inventory value
    const inventoryValue = products.reduce((sum, product) => {
      const productValue = Number(product.base_price) * product.stock_quantity;
      return sum + productValue;
    }, 0);

    // Count low stock items (stock < 10)
    const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length;

    return {
      totalSales,
      vialsSold,
      inventoryValue,
      totalItems: products.length,
      lowStockCount
    };
  }, [orders, products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Stock filter
      let matchesStock = true;
      if (stockFilter === 'in_stock') {
        matchesStock = product.stock_quantity > 0;
      } else if (stockFilter === 'out_of_stock') {
        matchesStock = product.stock_quantity === 0;
      } else if (stockFilter === 'low_stock') {
        matchesStock = product.stock_quantity > 0 && product.stock_quantity < 10;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const handleSell = (product: Product) => {
    // This could open a modal or navigate to a sell page
    alert(`Sell functionality for ${product.name} - Coming soon!`);
  };

  const handleEdit = (product: Product) => {
    // Navigate to edit page or open edit modal
    window.location.href = `/admin?view=edit&id=${product.id}`;
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Are you sure you want to delete ${product.name}? This action cannot be undone.`)) {
      // Delete functionality would be handled by parent component
      alert('Delete functionality - Please use the main product management page');
    }
  };

  const handleExport = () => {
    // Export inventory to CSV
    const csvContent = [
      ['Product Name', 'Category', 'Price per Vial', 'Quantity', 'Total Value', 'Status'].join(','),
      ...filteredProducts.map(p => [
        p.name,
        categories.find(c => c.id === p.category)?.name || p.category,
        formatPrice(p.base_price),
        p.stock_quantity,
        formatPrice(p.base_price * p.stock_quantity),
        p.stock_quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 md:gap-2 group"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm md:text-base">Back</span>
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Peptide Inventory
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
          {/* Total Sales Income */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl shadow-xl p-3 md:p-6 text-white">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <h3 className="text-xs md:text-sm font-semibold opacity-90">Total Sales Income</h3>
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 opacity-80" />
            </div>
            <p className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{formatPrice(stats.totalSales)}</p>
            <p className="text-xs md:text-sm opacity-90">Vials Sold: {stats.vialsSold}</p>
          </div>

          {/* Inventory Value */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl shadow-xl p-3 md:p-6 text-white">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <h3 className="text-xs md:text-sm font-semibold opacity-90">Inventory Value</h3>
              <Package className="h-4 w-4 md:h-6 md:w-6 opacity-80" />
            </div>
            <p className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{formatPrice(stats.inventoryValue)}</p>
            <p className="text-xs md:text-sm opacity-90">Total Items: {stats.totalItems}</p>
          </div>

          {/* Low Stock */}
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl md:rounded-2xl shadow-xl p-3 md:p-6 text-white">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <h3 className="text-xs md:text-sm font-semibold opacity-90">Low Stock</h3>
              <AlertTriangle className="h-4 w-4 md:h-6 md:w-6 opacity-80" />
            </div>
            <p className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{stats.lowStockCount}</p>
            <p className="text-xs md:text-sm opacity-90">Needs attention</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-3 md:p-4 mb-4 md:mb-6 border-2 border-blue-100">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-center">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Items</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-sm md:text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-2 md:space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-8 md:p-12 text-center border-2 border-blue-100">
              <Package className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 text-sm md:text-lg">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const category = categories.find(c => c.id === product.category);
              const totalValue = Number(product.base_price) * product.stock_quantity;
              const isLowStock = product.stock_quantity > 0 && product.stock_quantity < 10;
              const isOutOfStock = product.stock_quantity === 0;

              return (
                <div
                  key={product.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-3 md:p-6 border-2 border-blue-100 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                        <h3 className="text-base md:text-xl font-bold text-gray-900 truncate">{product.name}</h3>
                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap">
                          {category?.name || product.category}
                        </span>
                        <span
                          className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-700'
                              : isLowStock
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                        <div>
                          <p className="text-gray-500 mb-0.5 md:mb-1 text-[10px] md:text-sm">Price per Vial</p>
                          <p className="font-semibold text-gray-900 text-sm md:text-base">{formatPrice(product.base_price)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5 md:mb-1 text-[10px] md:text-sm">Quantity</p>
                          <p className="font-semibold text-gray-900 text-sm md:text-base">{product.stock_quantity} vials</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5 md:mb-1 text-[10px] md:text-sm">Total Value</p>
                          <p className="font-semibold text-blue-600 text-sm md:text-base">{formatPrice(totalValue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5 md:mb-1 text-[10px] md:text-sm">Expiration</p>
                          <p className="font-semibold text-gray-900 text-sm md:text-base">N/A</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row md:flex-col gap-2 md:w-auto">
                      <button
                        onClick={() => handleSell(product)}
                        className="flex-1 md:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        Sell
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 md:flex-none bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex-1 md:flex-none bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;

