
import React from 'react';
import SplitPaymentScreen from '@/components/SplitPaymentScreen';
import { useSplitPaymentHandler } from '../PaymentHandlers';

interface SplitPaymentScreenContainerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'split', customerName?: string, customerPhone?: string, splitPayments?: any[]) => any;
  customerInfo?: { name: string; phone: string };
  onClose: () => void;
}

const SplitPaymentScreenContainer: React.FC<SplitPaymentScreenContainerProps> = ({
  calculateTotal,
  processPayment,
  customerInfo,
  onClose
}) => {
  const { handleProcessSplitPayment } = useSplitPaymentHandler({
    calculateTotal,
    processPayment,
    customerInfo,
    onClose
  });

  return (
    <SplitPaymentScreen
      total={calculateTotal()}
      onProcessSplitPayment={handleProcessSplitPayment}
      onCancel={onClose}
      customerInfo={customerInfo}
    />
  );
};

export default SplitPaymentScreenContainer;
