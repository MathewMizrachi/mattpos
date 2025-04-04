
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface CashPaymentHandlerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'cash') => any;
  onClose: () => void;
}

const useCashPaymentHandler = ({
  calculateTotal,
  processPayment,
  onClose
}: CashPaymentHandlerProps) => {
  const { toast } = useToast();
  
  const handleProcessCashPayment = (cashReceived: number) => {
    const result = processPayment(cashReceived, 'cash');
    
    if (result.success) {
      toast({
        title: "Payment successful",
        description: `Change: ${formatCurrency(result.change)}`,
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
    handleProcessCashPayment
  };
};

export default useCashPaymentHandler;
