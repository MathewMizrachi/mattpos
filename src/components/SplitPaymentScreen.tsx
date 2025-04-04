
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import SplitPaymentSetup from './SplitPayment/SplitPaymentSetup';
import PaymentProcess from './SplitPayment/PaymentProcess';

interface SplitPaymentScreenProps {
  total: number;
  onProcessSplitPayment: (payments: SplitPaymentDetails[]) => void;
  onCancel: () => void;
  customerInfo?: { name: string; phone: string };
}

export interface SplitPaymentDetails {
  method: 'cash' | 'card' | 'shop2shop' | 'account';
  amount: number;
  customerName?: string;
  customerPhone?: string;
}

const SplitPaymentScreen: React.FC<SplitPaymentScreenProps> = ({
  total,
  onProcessSplitPayment,
  onCancel,
  customerInfo
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | 'shop2shop' | 'account' | null>(null);
  const [amounts, setAmounts] = useState({
    shop2shop: '0',
    cash: '0',
    card: '0',
    account: '0'
  });
  
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState<number>(-1);
  const [payments, setPayments] = useState<SplitPaymentDetails[]>([]);
  const [customerName, setCustomerName] = useState(customerInfo?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customerInfo?.phone || '');
  const [showCustomerFields, setShowCustomerFields] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(total);
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [readyForPayment, setReadyForPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<('shop2shop' | 'cash' | 'card' | 'account')[]>([]);

  useEffect(() => {
    const newTotal = Object.entries(amounts).reduce((sum, [method, amountStr]) => {
      const amount = parseFloat(amountStr) || 0;
      return sum + amount;
    }, 0);
    
    setTotalAllocated(newTotal);
    setReadyForPayment(Math.abs(newTotal - total) < 0.01);
  }, [amounts, total]);

  // Determine which payment methods to include
  useEffect(() => {
    const methods: ('shop2shop' | 'cash' | 'card' | 'account')[] = [];
    Object.entries(amounts).forEach(([method, amountStr]) => {
      const amount = parseFloat(amountStr) || 0;
      if (amount > 0) {
        methods.push(method as 'shop2shop' | 'cash' | 'card' | 'account');
      }
    });
    setPaymentMethods(methods);
  }, [amounts]);

  // Start the payment process when ready
  useEffect(() => {
    if (readyForPayment && currentPaymentIndex === -1) {
      setCurrentPaymentIndex(0);
    }
  }, [readyForPayment]);

  const handleAmountChange = (method: keyof typeof amounts, value: string) => {
    setAmounts(prev => ({
      ...prev,
      [method]: value
    }));
  };

  const handleProcessPayment = () => {
    if (currentPaymentIndex >= paymentMethods.length) {
      return;
    }

    const method = paymentMethods[currentPaymentIndex];
    const amount = parseFloat(amounts[method]) || 0;
    
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Payment amount must be greater than 0"
      });
      return;
    }
    
    // For account payment, ensure customer information is provided
    if (method === 'account' && (!customerName || !customerPhone)) {
      toast({
        title: "Customer information required",
        description: "Please enter customer name and phone number for account payment"
      });
      return;
    }
    
    const newPayment: SplitPaymentDetails = {
      method,
      amount
    };
    
    if (method === 'account') {
      newPayment.customerName = customerName;
      newPayment.customerPhone = customerPhone;
    }
    
    setPayments([...payments, newPayment]);
    setRemainingAmount(prev => prev - amount);
    
    // Move to next payment method
    if (currentPaymentIndex < paymentMethods.length - 1) {
      setCurrentPaymentIndex(currentPaymentIndex + 1);
    } else {
      // All payments processed, complete the transaction
      onProcessSplitPayment([...payments, newPayment]);
    }
  };

  // If we're in the setup phase (not yet ready for payment)
  if (currentPaymentIndex === -1) {
    return (
      <SplitPaymentSetup
        total={total}
        totalAllocated={totalAllocated}
        amounts={amounts}
        customerName={customerName}
        customerPhone={customerPhone}
        showCustomerFields={showCustomerFields}
        handleAmountChange={handleAmountChange}
        setCustomerName={setCustomerName}
        setCustomerPhone={setCustomerPhone}
        setShowCustomerFields={setShowCustomerFields}
        onCancel={onCancel}
        onProceed={() => setCurrentPaymentIndex(0)}
        readyForPayment={readyForPayment}
      />
    );
  }

  // We're now in the payment process
  const currentMethod = paymentMethods[currentPaymentIndex];
  const methodAmount = parseFloat(amounts[currentMethod]) || 0;

  return (
    <PaymentProcess
      currentMethod={currentMethod}
      methodAmount={methodAmount}
      currentPaymentIndex={currentPaymentIndex}
      totalPayments={paymentMethods.length}
      customerName={customerName}
      customerPhone={customerPhone}
      onCancel={onCancel}
      onProcessPayment={handleProcessPayment}
    />
  );
};

export default SplitPaymentScreen;
