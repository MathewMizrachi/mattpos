
import React from 'react';
import PaymentForm from '@/components/PaymentForm';
import { CashPaymentHandler } from '../PaymentHandlers';

interface CashPaymentScreenContainerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'cash') => any;
  onClose: () => void;
}

const CashPaymentScreenContainer: React.FC<CashPaymentScreenContainerProps> = ({
  calculateTotal,
  processPayment,
  onClose
}) => {
  const { handleProcessCashPayment } = CashPaymentHandler({
    calculateTotal,
    processPayment,
    onClose
  });

  return (
    <PaymentForm 
      total={calculateTotal()}
      onProcessPayment={handleProcessCashPayment}
      onCancel={onClose}
    />
  );
};

export default CashPaymentScreenContainer;
