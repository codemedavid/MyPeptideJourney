import { useState, useEffect } from 'react';
import type { CartItem, Product, ProductVariation } from '../types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('peptide_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('peptide_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, variation?: ProductVariation, quantity: number = 1) => {
    // Check available stock
    const availableStock = variation ? variation.stock_quantity : product.stock_quantity;
    
    if (availableStock === 0) {
      alert('This product is out of stock!');
      return;
    }

    const price = variation ? variation.price : (product.discount_active && product.discount_price ? product.discount_price : product.base_price);
    
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && 
              (variation ? item.variation?.id === variation.id : !item.variation)
    );

    if (existingItemIndex > -1) {
      // Update existing item - check if total quantity exceeds stock
      const currentQuantity = cartItems[existingItemIndex].quantity;
      const newQuantity = currentQuantity + quantity;
      
      if (newQuantity > availableStock) {
        const maxCanAdd = availableStock - currentQuantity;
        if (maxCanAdd <= 0) {
          alert(`Only ${availableStock} ${availableStock === 1 ? 'item' : 'items'} available in stock. You already have ${currentQuantity} in your cart.`);
          return;
        }
        alert(`Only ${availableStock} ${availableStock === 1 ? 'item' : 'items'} available in stock. Adding ${maxCanAdd} instead of ${quantity}.`);
        quantity = maxCanAdd;
      }
      
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      // Add new item - check if quantity exceeds stock
      if (quantity > availableStock) {
        alert(`Only ${availableStock} ${availableStock === 1 ? 'item' : 'items'} available in stock. Adding ${availableStock} instead of ${quantity}.`);
        quantity = availableStock;
      }
      
      const newItem: CartItem = {
        product,
        variation,
        quantity,
        price
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    // Check available stock
    const item = cartItems[index];
    const availableStock = item.variation ? item.variation.stock_quantity : item.product.stock_quantity;
    
    if (quantity > availableStock) {
      alert(`Only ${availableStock} ${availableStock === 1 ? 'item' : 'items'} available in stock.`);
      quantity = availableStock;
    }

    const updatedItems = [...cartItems];
    updatedItems[index].quantity = quantity;
    setCartItems(updatedItems);
  };

  const removeFromCart = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('peptide_cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
}
