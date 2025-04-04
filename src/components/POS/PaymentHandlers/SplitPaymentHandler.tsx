
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { SplitPaymentDetails } from '@/types';

interface SplitPaymentHandlerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => any;
  customerInfo?: { name: string; phone: string };
  onClose: () => void;
}

const SplitPaymentHandler: React.FC<SplitPaymentHandlerProps> = ({
  calculateTotal,
  processPayment,
  customerInfo,
  onClose
}) => {
  const { toast } = useToast();
  
  const handleProcessSplitPayment = (payments: SplitPaymentDetails[]) => {
    // Calculate total from split payments to ensure it matches
    const splitTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const cartTotal = calculateTotal();
    
    if (Math.abs(splitTotal - cartTotal) > 0.01) {
      toast({
        title: "Payment amount mismatch",
        description: `Total payments (${formatCurrency(splitTotal)}) don't match cart total (${formatCurrency(cartTotal)})`,
        variant: "destructive"
      });
      return;
    }
    
    const result = processPayment(
      cartTotal, 
      'split', 
      customerInfo?.name, 
      customerInfo?.phone, 
      payments
    );
    
    if (result.success) {
      toast({
        title: "Split payment successful",
        description: `Total: ${formatCurrency(cartTotal)}`,
      });
      onClose();
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };

  return {
    handleProcessSplitPayment
  };
};

export default SplitPaymentHandler;
