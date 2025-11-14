import React, { useState } from 'react';
import { X, ShoppingCart, Award, FlaskConical, Package, Info, Thermometer, Beaker, Plus, Minus, AlertTriangle } from 'lucide-react';
import type { Product, ProductVariation } from '../types';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

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
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FlaskConical className="w-24 h-24 text-blue-300" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {isTirzepatide && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg animate-pulse border-2 border-white">
                      <AlertTriangle className="w-4 h-4 mr-1.5 animate-pulse" />
                      ⚠️ LIMITED STOCK
                    </span>
                  )}
                  {product.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 shadow-md">
                      <Award className="w-4 h-4 mr-1" />
                      Featured
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white shadow-md">
                      {Math.round((1 - currentPrice / product.base_price) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Purity Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 shadow-md">
                    {product.purity_percentage}% Pure
                  </span>
                </div>

                {/* Stock Status */}
                {product.stock_quantity === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Warning */}
              {isTirzepatide && product.stock_quantity > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 rounded-xl p-4 text-center animate-pulse">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                    <p className="text-base font-bold text-red-700">
                      ⚠️ LIMITED STOCK - Only {product.stock_quantity} left!
                    </p>
                  </div>
                  <p className="text-sm text-red-600 font-medium">
                    Hurry! Stock is running low. Order now before it's gone!
                  </p>
                </div>
              )}
              {!isTirzepatide && product.stock_quantity > 0 && product.stock_quantity < 10 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-orange-700 font-medium">
                    ⚠️ Only {product.stock_quantity} left in stock
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4 md:space-y-6">
              {/* Product Name */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-blue-600">
                  ₱{currentPrice.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    ₱{product.base_price.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                )}
              </div>

              {/* Variations */}
              {product.variations && product.variations.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Select Size:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.variations.map((variation) => (
                      <button
                        key={variation.id}
                        onClick={() => setSelectedVariation(variation)}
                        disabled={variation.stock_quantity === 0}
                        className={`
                          px-4 py-3 rounded-lg text-sm font-medium transition-all border-2
                          ${selectedVariation?.id === variation.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : variation.stock_quantity === 0
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                      >
                        <div className="font-semibold">{variation.name}</div>
                        <div className="text-xs mt-1">
                          ₱{variation.price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                        </div>
                        {variation.stock_quantity === 0 && (
                          <div className="text-[10px] mt-1 text-red-500">Out of Stock</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scientific Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-blue-600" />
                  Scientific Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Purity:</span>
                    <span className="ml-2 font-medium text-gray-700">{product.purity_percentage}%</span>
                  </div>
                  {product.molecular_weight && (
                    <div>
                      <span className="text-gray-500">Molecular Weight:</span>
                      <span className="ml-2 font-medium text-gray-700">{product.molecular_weight}</span>
                    </div>
                  )}
                  {product.cas_number && (
                    <div>
                      <span className="text-gray-500">CAS Number:</span>
                      <span className="ml-2 font-medium text-gray-700">{product.cas_number}</span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Storage Conditions:
                    </span>
                    <span className="ml-2 font-medium text-gray-700">{product.storage_conditions}</span>
                  </div>
                  {product.sequence && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Sequence:</span>
                      <span className="ml-2 font-medium text-gray-700 font-mono text-xs break-all">{product.sequence}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="px-4 py-2 font-semibold text-gray-800 min-w-[50px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.available || product.stock_quantity === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-blue-800 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* Complete Set Details */}
              {product.show_complete_set_details === true && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
                  <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Complete Set Includes:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-xl">🧬</span>
                      <span>Peptide and BAC Water</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">🧬</span>
                      <span>Syringe for reconstitute</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">🧬</span>
                      <span>6pcs Insulin Syringe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">🧬</span>
                      <span>Plastic container and box</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-xl">🧬</span>
                      <span>10pcs alcohol pads</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>RESEARCH USE ONLY:</strong> ALWAYS CONSULT A LICENSED HEALTHCARE PROFESSIONAL FOR PERSONALISED MEDICAL GUIDANCE</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

