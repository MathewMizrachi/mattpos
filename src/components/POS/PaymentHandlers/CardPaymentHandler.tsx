
import { useToast } from '@/hooks/use-toast';

interface CardPaymentHandlerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'card') => any;
  onClose: () => void;
}

const useCardPaymentHandler = ({
  calculateTotal,
  processPayment,
  onClose
}: CardPaymentHandlerProps) => {
  const { toast } = useToast();
  
  const handleProcessCardPayment = () => {
    const result = processPayment(calculateTotal(), 'card');
    
    if (result.success) {
      toast({
        title: "Card payment successful",
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
    handleProcessCardPayment
  };
};

export default useCardPaymentHandler;
