
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, CreditCard, Banknote, Users, ArrowLeft, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [amount, setAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState(total);
  const [payments, setPayments] = useState<SplitPaymentDetails[]>([]);
  const [customerName, setCustomerName] = useState(customerInfo?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customerInfo?.phone || '');
  const [showCustomerFields, setShowCustomerFields] = useState(false);

  const handleSelectMethod = (method: 'cash' | 'card' | 'shop2shop' | 'account') => {
    setSelectedMethod(method);
    if (method === 'account' && !customerInfo) {
      setShowCustomerFields(true);
    }
  };

  const handleAddPayment = () => {
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    if (parsedAmount > remainingAmount) {
      toast({
        title: "Amount too high",
        description: `Maximum amount is ${formatCurrency(remainingAmount)}`,
        variant: "destructive"
      });
      return;
    }
    
    if (selectedMethod === 'account' && (!customerName || !customerPhone)) {
      toast({
        title: "Customer information required",
        description: "Please enter customer name and phone number for account payment",
        variant: "destructive"
      });
      return;
    }
    
    const newPayment: SplitPaymentDetails = {
      method: selectedMethod!,
      amount: parsedAmount,
    };
    
    if (selectedMethod === 'account') {
      newPayment.customerName = customerName;
      newPayment.customerPhone = customerPhone;
    }
    
    setPayments([...payments, newPayment]);
    setRemainingAmount(prev => prev - parsedAmount);
    setAmount('');
    setSelectedMethod(null);
    setShowCustomerFields(false);
  };

  const handleComplete = () => {
    if (remainingAmount > 0) {
      toast({
        title: "Incomplete payment",
        description: `There is still ${formatCurrency(remainingAmount)} remaining to be paid`,
        variant: "destructive"
      });
      return;
    }
    
    onProcessSplitPayment(payments);
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'shop2shop': return 'Shop2Shop';
      case 'account': return 'Account';
      default: return method;
    }
  };

  // If no payment method is selected, show the method selection screen
  if (!selectedMethod) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-2">
        <div className="w-full max-w-md mx-auto text-white">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Split Payment</h2>
            <p className="text-xl mt-2">
              Remaining: <span className="font-bold">{formatCurrency(remainingAmount)}</span>
            </p>
            
            {payments.length > 0 && (
              <div className="mt-4 bg-gray-800 p-4 rounded-lg text-left">
                <h3 className="font-bold mb-2">Payment Details:</h3>
                {payments.map((payment, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>{getMethodLabel(payment.method)}</span>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4 mb-6">
            <Button 
              onClick={() => handleSelectMethod('shop2shop')}
              className="w-full h-16 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-lg"
              disabled={remainingAmount <= 0}
            >
              <ShoppingBag className="h-6 w-6 mr-3" />
              Shop2Shop
            </Button>
            
            <Button 
              onClick={() => handleSelectMethod('cash')}
              className="w-full h-16 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-lg"
              disabled={remainingAmount <= 0}
            >
              <Banknote className="h-6 w-6 mr-3" />
              Cash
            </Button>
            
            <Button 
              onClick={() => handleSelectMethod('card')}
              className="w-full h-16 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-lg"
              disabled={remainingAmount <= 0}
            >
              <CreditCard className="h-6 w-6 mr-3" />
              Card
            </Button>
            
            <Button 
              onClick={() => handleSelectMethod('account')}
              className="w-full h-16 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-lg"
              disabled={remainingAmount <= 0}
            >
              <Users className="h-6 w-6 mr-3" />
              Account
            </Button>
          </div>
          
          <div className="flex justify-between space-x-4">
            <Button 
              onClick={onCancel} 
              variant="outline"
              className="flex-1 bg-transparent text-white border-gray-600 hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <Button 
              onClick={handleComplete} 
              className="flex-1 bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
              disabled={remainingAmount > 0}
            >
              <Check className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // If a payment method is selected, show the amount entry screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-2">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">{getMethodLabel(selectedMethod)} Payment</h2>
          <p className="text-xl mt-2">
            Remaining: <span className="font-bold">{formatCurrency(remainingAmount)}</span>
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="amount" className="text-white mb-1 block">Amount</Label>
            <Input 
              id="amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              type="number"
              step="0.01"
              min="0.01"
              max={remainingAmount.toString()}
            />
          </div>
          
          {showCustomerFields && (
            <>
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
            </>
          )}
        </div>
        
        <div className="flex justify-between space-x-4">
          <Button 
            onClick={() => setSelectedMethod(null)} 
            variant="outline"
            className="flex-1 bg-transparent text-white border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleAddPayment} 
            className="flex-1 bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
          >
            <Check className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentScreen;
