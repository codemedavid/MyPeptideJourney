import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Award, FlaskConical, Package, Eye, AlertTriangle } from 'lucide-react';
import type { Product, ProductVariation } from '../types';

interface MenuItemCardProps {
  product: Product;
  onAddToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  cartQuantity?: number;
  cartItems?: Array<{ product: Product; variation?: ProductVariation; quantity: number }>;
  onUpdateQuantity?: (index: number, quantity: number) => void;
  onViewDetails?: (product: Product) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  product, 
  onAddToCart, 
  cartQuantity = 0,
  cartItems = [],
  onViewDetails,
}) => {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariation 
    ? selectedVariation.price 
    : (product.discount_active && product.discount_price) 
      ? product.discount_price 
      : product.base_price;

  const hasDiscount = !selectedVariation && product.discount_active && product.discount_price;
  const isTirzepatide = product.name.toLowerCase().includes('tirzepatide');

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariation, quantity);
    setQuantity(1);
  };

  // Get available stock for current selection
  const getAvailableStock = () => {
    if (selectedVariation) {
      return selectedVariation.stock_quantity;
    }
    return product.stock_quantity;
  };

  const availableStock = getAvailableStock();
  
  // Get current cart quantity for this specific product/variation combination
  const getCurrentCartQuantity = () => {
    if (cartItems.length > 0) {
      return cartItems
        .filter(item => 
          item.product.id === product.id && 
          (selectedVariation ? item.variation?.id === selectedVariation.id : !item.variation)
        )
        .reduce((sum, item) => sum + item.quantity, 0);
    }
    // Fallback to cartQuantity if cartItems not provided
    return cartQuantity;
  };

  const currentCartQuantity = getCurrentCartQuantity();
  const maxCanAdd = availableStock - currentCartQuantity;

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= maxCanAdd) {
      setQuantity(newQuantity);
    } else {
      alert(`Only ${maxCanAdd} ${maxCanAdd === 1 ? 'item' : 'items'} available to add. You already have ${currentCartQuantity} in your cart.`);
    }
  };
  
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="card card-hover overflow-hidden animate-fadeIn">
      {/* Product Image - Clickable */}
      <div 
        className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden cursor-pointer group"
        onClick={() => onViewDetails?.(product)}
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FlaskConical className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-blue-300" />
          </div>
        )}
        
        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">View Details</span>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 flex flex-col gap-1 md:gap-2 z-10">
          {isTirzepatide && (
            <span className="inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg animate-pulse border-2 border-white">
              <AlertTriangle className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 animate-pulse" />
              ⚠️ LIMITED STOCK
            </span>
          )}
          {product.featured && (
            <span className="inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-blue-100 text-blue-700 shadow-md">
              <Award className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-red-500 text-white shadow-md">
              {Math.round((1 - currentPrice / product.base_price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Purity Badge */}
        <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3">
          <span className="inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold bg-green-100 text-green-700 shadow-md">
            {product.purity_percentage}% Pure
          </span>
        </div>

        {/* Stock Status */}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 md:p-4 lg:p-5">
        <h3 
          className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onViewDetails?.(product)}
        >
          {product.name}
        </h3>
        <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 mb-2 md:mb-3 lg:mb-4 line-clamp-2">{product.description}</p>
        
        {/* View Details Button */}
        {onViewDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="mb-2 md:mb-3 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3 h-3" />
            View Full Details
          </button>
        )}

        {/* Scientific Details */}
        <div className="grid grid-cols-2 gap-1 md:gap-2 mb-2 md:mb-3 lg:mb-4">
          {product.molecular_weight && (
            <div className="text-[10px] md:text-xs">
              <span className="text-gray-500">MW:</span>
              <span className="ml-0.5 md:ml-1 font-medium text-gray-700">{product.molecular_weight}</span>
            </div>
          )}
          {product.cas_number && (
            <div className="text-[10px] md:text-xs">
              <span className="text-gray-500">CAS:</span>
              <span className="ml-0.5 md:ml-1 font-medium text-gray-700">{product.cas_number}</span>
            </div>
          )}
          <div className="text-[10px] md:text-xs col-span-2">
            <span className="text-gray-500">Storage:</span>
            <span className="ml-0.5 md:ml-1 font-medium text-gray-700">{product.storage_conditions}</span>
          </div>
        </div>

        {/* Variations (Sizes) */}
        {product.variations && product.variations.length > 0 && (
          <div className="mb-2 md:mb-3 lg:mb-4" onClick={(e) => e.stopPropagation()}>
            <label className="block text-[11px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              <Package className="w-3 h-3 md:w-4 md:h-4 inline mr-0.5 md:mr-1" />
              Select Size:
            </label>
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariation(variation);
                  }}
                  disabled={variation.stock_quantity === 0}
                  className={`
                    px-1.5 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-sm font-medium transition-all
                    ${selectedVariation?.id === variation.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : variation.stock_quantity === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }
                  `}
                >
                  {variation.name}
                  <div className="text-[9px] md:text-xs mt-0.5 md:mt-1">
                    ₱{variation.price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline mb-2 md:mb-3 lg:mb-4">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
            ₱{currentPrice.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          {hasDiscount && (
            <span className="ml-1 md:ml-2 text-sm md:text-base lg:text-lg text-gray-400 line-through">
              ₱{product.base_price.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 mb-2 md:mb-3 lg:mb-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center border-2 border-gray-200 rounded-md md:rounded-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrementQuantity();
              }}
              className="p-1 md:p-1.5 lg:p-2 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
            </button>
            <span className="px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 font-semibold text-gray-800 min-w-[28px] md:min-w-[40px] text-center text-xs md:text-sm lg:text-base">
              {quantity}
            </span>
            {maxCanAdd <= 5 && maxCanAdd > 0 && (
              <span className="text-[9px] md:text-[10px] text-orange-600 font-medium ml-1">
                (max: {maxCanAdd})
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                incrementQuantity();
              }}
              disabled={quantity >= maxCanAdd}
              className={`p-1 md:p-1.5 lg:p-2 hover:bg-gray-100 transition-colors ${
                quantity >= maxCanAdd ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!product.available || availableStock === 0 || maxCanAdd === 0}
            className="flex-1 bg-blue-600 text-white px-2 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-md md:rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-[11px] sm:text-xs md:text-sm lg:text-base"
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 inline mr-1 md:mr-2" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Cart Status */}
        {cartQuantity > 0 && (
          <div className="text-center text-[10px] md:text-xs lg:text-sm text-green-600 font-medium">
            {cartQuantity} in cart
          </div>
        )}

        {/* Stock Warning */}
        {isTirzepatide && product.stock_quantity > 0 && (
          <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg md:rounded-xl p-2 md:p-2.5 mb-2 md:mb-3">
            <div className="flex items-center justify-center gap-1.5 md:gap-2">
              <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-red-600 animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold text-red-700">
                ⚠️ LIMITED STOCK - Only {product.stock_quantity} left!
              </span>
            </div>
          </div>
        )}
        {!isTirzepatide && product.stock_quantity > 0 && product.stock_quantity < 10 && (
          <div className="text-center text-[9px] md:text-[10px] lg:text-xs text-orange-600">
            Only {product.stock_quantity} left in stock
          </div>
        )}

        {/* Complete Set Details */}
        {product.show_complete_set_details === true && (
          <div className="mt-2 md:mt-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-purple-200">
            <p className="text-[10px] md:text-xs font-semibold text-purple-700 mb-1.5 md:mb-2">Complete Set Includes:</p>
            <ul className="space-y-0.5 md:space-y-1 text-[9px] md:text-[10px] text-gray-700">
              <li className="flex items-center gap-1.5">
                <span className="text-purple-600">🧬</span>
                <span>Peptide and BAC Water</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-600">🧬</span>
                <span>Syringe for reconstitute</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-600">🧬</span>
                <span>6pcs Insulin Syringe</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-600">🧬</span>
                <span>Plastic container and box</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-600">🧬</span>
                <span>10pcs alcohol pads</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
