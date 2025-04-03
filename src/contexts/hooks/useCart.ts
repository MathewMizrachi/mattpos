
import { useState } from 'react';
import { CartItem, Product } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1, customPrice?: number) => {
    // If a custom price is provided, use it instead of the product's default price
    const productToAdd = customPrice !== undefined ? { ...product, price: customPrice } : product;
    
    setCart(prevCart => {
      // Check if this product (with same price) is already in the cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === productToAdd.id && 
        item.product.price === productToAdd.price
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        return prevCart.map((item, index) => 
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Check if this product (with different price) is in the cart
        const sameProductDifferentPrice = prevCart.findIndex(item => 
          item.product.id === productToAdd.id && 
          item.product.price !== productToAdd.price
        );
        
        if (sameProductDifferentPrice >= 0) {
          // Remove all instances of this product and add with the new price and combined quantity
          const totalQuantity = prevCart.reduce((sum, item) => 
            item.product.id === productToAdd.id ? sum + item.quantity : sum, 0
          );
          
          const cartWithoutProduct = prevCart.filter(item => item.product.id !== productToAdd.id);
          return [...cartWithoutProduct, { product: productToAdd, quantity: totalQuantity + quantity }];
        } else {
          // Add new item to cart
          return [...prevCart, { product: productToAdd, quantity }];
        }
      }
    });
  };

  const updateCartItem = (productId: number, quantity: number, price?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, price);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        (item.product.id === productId && 
        (price === undefined || item.product.price === price))
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number, price?: number) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.product.id === productId &&
        (price === undefined || item.product.price === price))
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
}
