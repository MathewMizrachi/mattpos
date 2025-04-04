
import React from 'react';
import CardPaymentScreen from '@/components/CardPaymentScreen';
import { useCardPaymentHandler } from '../PaymentHandlers';

interface CardPaymentScreenContainerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'card') => any;
  onClose: () => void;
}

const CardPaymentScreenContainer: React.FC<CardPaymentScreenContainerProps> = ({
  calculateTotal,
  processPayment,
  onClose
}) => {
  const { handleProcessCardPayment } = useCardPaymentHandler({
    calculateTotal,
    processPayment,
    onClose
  });

  return (
    <CardPaymentScreen
      total={calculateTotal()}
      onProcessPayment={handleProcessCardPayment}
      onCancel={onClose}
    />
  );
};

export default CardPaymentScreenContainer;
