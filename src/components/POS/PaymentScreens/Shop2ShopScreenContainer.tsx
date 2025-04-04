
import React from 'react';
import Shop2ShopScreen from '@/components/Shop2ShopScreen';
import { Shop2ShopPaymentHandler } from '../PaymentHandlers';

interface Shop2ShopScreenContainerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'shop2shop') => any;
  onClose: () => void;
}

const Shop2ShopScreenContainer: React.FC<Shop2ShopScreenContainerProps> = ({
  calculateTotal,
  processPayment,
  onClose
}) => {
  const { handleProcessShop2ShopPayment } = Shop2ShopPaymentHandler({
    calculateTotal,
    processPayment,
    onClose
  });

  return (
    <Shop2ShopScreen
      total={calculateTotal()}
      onProcessPayment={handleProcessShop2ShopPayment}
      onCancel={onClose}
    />
  );
};

export default Shop2ShopScreenContainer;
