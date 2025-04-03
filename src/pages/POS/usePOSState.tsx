
import { useState } from 'react';
import { Product } from '@/types';

interface UsePOSStateProps {
  cart: any[];
}

export const usePOSState = ({ cart }: UsePOSStateProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartExpanded, setCartExpanded] = useState(false);
  
  const toggleCartExpand = () => {
    setCartExpanded(prev => !prev);
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };
  
  return {
    searchTerm,
    setSearchTerm,
    cartExpanded,
    toggleCartExpand,
    calculateTotal,
  };
};
