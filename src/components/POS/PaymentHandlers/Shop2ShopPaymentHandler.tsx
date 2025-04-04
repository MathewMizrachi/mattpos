
import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface Shop2ShopPaymentHandlerProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'shop2shop') => any;
  onClose: () => void;
}

const Shop2ShopPaymentHandler: React.FC<Shop2ShopPaymentHandlerProps> = ({
  calculateTotal,
  processPayment,
  onClose
}) => {
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

export default Shop2ShopPaymentHandler;
