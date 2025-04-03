
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { ShoppingBag, CreditCard, Banknote, Users, Split } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface CustomerInfo {
  name: string;
  phone: string;
}

interface PaymentOptionsProps {
  onSelectPaymentMethod: (method: 'shop2shop' | 'cash' | 'card' | 'account' | 'split', customerInfo?: CustomerInfo) => void;
  onCancel: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  onSelectPaymentMethod,
  onCancel
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const form = useForm<CustomerInfo>({
    defaultValues: {
      name: '',
      phone: ''
    }
  });

  const handleAccountPayment = () => {
    if (!customerName || !customerPhone) {
      toast({
        title: "Customer information required",
        description: "Please enter customer name and phone number for account payment",
        variant: "destructive"
      });
      return;
    }
    
    onSelectPaymentMethod('account', { name: customerName, phone: customerPhone });
  };

  const handleSplitPayment = () => {
    onSelectPaymentMethod('split', 
      customerName && customerPhone ? { name: customerName, phone: customerPhone } : undefined
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Select Payment Method</h2>
      </div>
      
      <div className="mb-6 space-y-4">
        <div>
          <Label htmlFor="customerName" className="text-white mb-1 block">Customer Name</Label>
          <Input 
            id="customerName" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            placeholder="Enter customer name"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        
        <div>
          <Label htmlFor="customerPhone" className="text-white mb-1 block">Phone Number</Label>
          <Input 
            id="customerPhone" 
            value={customerPhone} 
            onChange={(e) => setCustomerPhone(e.target.value)} 
            placeholder="Enter phone number"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={() => onSelectPaymentMethod('shop2shop')}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <ShoppingBag className="h-8 w-8 mr-4" />
          Shop2Shop
        </Button>
        
        <Button 
          onClick={() => onSelectPaymentMethod('cash')}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <Banknote className="h-8 w-8 mr-4" />
          Cash
        </Button>
        
        <Button 
          onClick={() => onSelectPaymentMethod('card')}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <CreditCard className="h-8 w-8 mr-4" />
          Card
        </Button>
        
        <Button 
          onClick={handleAccountPayment}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <Users className="h-8 w-8 mr-4" />
          Account
        </Button>
        
        <Button 
          onClick={handleSplitPayment}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <Split className="h-8 w-8 mr-4" />
          Split Payment
        </Button>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={onCancel}
          variant="outline"
          className="w-full bg-transparent text-white border-gray-600 hover:bg-gray-700"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PaymentOptions;
