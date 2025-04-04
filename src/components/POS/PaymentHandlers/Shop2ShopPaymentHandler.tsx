
import { useToast } from '@/hooks/use-toast';

interface Shop2ShopPaymentHandlerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'shop2shop') => any;
  onClose: () => void;
}

const useShop2ShopPaymentHandler = ({
  calculateTotal,
  processPayment,
  onClose
}: Shop2ShopPaymentHandlerProps) => {
  const { toast } = useToast();
  
  const handleProcessShop2ShopPayment = () => {
    const result = processPayment(calculateTotal(), 'shop2shop');
    
    if (result.success) {
      toast({
        title: "Shop2Shop payment successful",
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
    handleProcessShop2ShopPayment
  };
};

export default useShop2ShopPaymentHandler;
