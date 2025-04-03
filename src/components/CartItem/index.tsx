
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import CartItemMobile from './CartItemMobile';
import CartItemDesktop from './CartItemDesktop';
import type { CartItemProps } from './types';

const CartItem: React.FC<CartItemProps> = (props) => {
  const isMobile = useIsMobile();
  
  return isMobile ? <CartItemMobile {...props} /> : <CartItemDesktop {...props} />;
};

export default CartItem;
