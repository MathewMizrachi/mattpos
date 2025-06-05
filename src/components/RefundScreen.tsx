
import React from 'react';
import { Product } from '@/types';
import RefundPOS from './RefundPOS';

interface RefundScreenProps {
  onProcessRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => void;
  onCancel: () => void;
}

const RefundScreen: React.FC<RefundScreenProps> = ({
  onProcessRefund,
  onCancel
}) => {
  return (
    <RefundPOS
      onProcessRefund={onProcessRefund}
      onCancel={onCancel}
    />
  );
};

export default RefundScreen;
