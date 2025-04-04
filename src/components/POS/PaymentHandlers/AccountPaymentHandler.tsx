
import { useToast } from '@/hooks/use-toast';

interface AccountPaymentHandlerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'account', customerName: string, customerPhone: string) => any;
  onClose: () => void;
}

const useAccountPaymentHandler = ({
  calculateTotal,
  processPayment,
  onClose
}: AccountPaymentHandlerProps) => {
  const { toast } = useToast();
  
  const handleProcessAccountPayment = (customerName: string, customerPhone: string) => {
    const result = processPayment(calculateTotal(), 'account', customerName, customerPhone);
    
    if (result.success) {
      toast({
        title: "Account payment successful",
        description: "",
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
    handleProcessAccountPayment
  };
};

export default useAccountPaymentHandler;
