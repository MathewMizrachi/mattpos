
import React from 'react';
import AccountPaymentScreen from '@/components/AccountPaymentScreen';
import { AccountPaymentHandler } from '../PaymentHandlers';

interface AccountPaymentScreenContainerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'account', customerName: string, customerPhone: string) => any;
  customerInfo?: { name: string; phone: string };
  onClose: () => void;
}

const AccountPaymentScreenContainer: React.FC<AccountPaymentScreenContainerProps> = ({
  calculateTotal,
  processPayment,
  customerInfo,
  onClose
}) => {
  const { handleProcessAccountPayment } = AccountPaymentHandler({
    calculateTotal,
    processPayment,
    onClose
  });

  return (
    <AccountPaymentScreen
      total={calculateTotal()}
      onProcessPayment={handleProcessAccountPayment}
      onCancel={onClose}
      customerInfo={customerInfo}
    />
  );
};

export default AccountPaymentScreenContainer;
