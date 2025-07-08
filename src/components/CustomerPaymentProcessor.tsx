
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import PaymentForm from '@/components/PaymentForm';
import CardPaymentScreen from '@/components/CardPaymentScreen';
import Shop2ShopScreen from '@/components/Shop2ShopScreen';

interface CustomerPaymentProcessorProps {
  customerId: number;
  customerName: string;
  onClose: () => void;
}

const CustomerPaymentProcessor: React.FC<CustomerPaymentProcessorProps> = ({
  customerId,
  customerName,
  onClose
}) => {
  const { markCustomerAsPaid } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'shop2shop'>('cash');
  const [showMethodSelection, setShowMethodSelection] = useState(true);
  const [showCashPayment, setShowCashPayment] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showShop2ShopPayment, setShowShop2ShopPayment] = useState(false);
  
  const handleSelectPaymentMethod = () => {
    setShowMethodSelection(false);
    
    switch(paymentMethod) {
      case 'cash':
        setShowCashPayment(true);
        break;
      case 'card':
        setShowCardPayment(true);
        break;
      case 'shop2shop':
        setShowShop2ShopPayment(true);
        break;
    }
  };
  
  const handleProcessPayment = (cashReceived?: number) => {
    const success = markCustomerAsPaid(customerId);
    
    if (success) {
      toast({
        title: "Payment processed successfully",
        description: `Account marked as paid using ${paymentMethod}`,
      });
      onClose();
    } else {
      toast({
        title: "Payment processing failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  if (showCashPayment) {
    return (
      <PaymentForm 
        total={100} // This would normally be the customer's outstanding balance
        onProcessPayment={handleProcessPayment}
        onCancel={() => {
          setShowCashPayment(false);
          setShowMethodSelection(true);
        }}
      />
    );
  }
  
  if (showCardPayment) {
    return (
      <CardPaymentScreen
        total={100} // This would normally be the customer's outstanding balance
        onProcessPayment={handleProcessPayment}
        onCancel={() => {
          setShowCardPayment(false);
          setShowMethodSelection(true);
        }}
      />
    );
  }
  
  if (showShop2ShopPayment) {
    return (
      <Shop2ShopScreen
        total={100} // This would normally be the customer's outstanding balance
        onProcessPayment={handleProcessPayment}
        onCancel={() => {
          setShowShop2ShopPayment(false);
          setShowMethodSelection(true);
        }}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A2645] pt-6 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
        <p className="mb-4">Process payment for {customerName}</p>
        
        <RadioGroup value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'shop2shop') => setPaymentMethod(value)} className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="cash" id="customer-cash" />
            <Label htmlFor="customer-cash">Cash</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="card" id="customer-card" />
            <Label htmlFor="customer-card">Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="shop2shop" id="customer-shop2shop" />
            <Label htmlFor="customer-shop2shop">Shop2Shop</Label>
          </div>
        </RadioGroup>
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSelectPaymentMethod}
            className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 hover:text-[#0A2645]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPaymentProcessor;
