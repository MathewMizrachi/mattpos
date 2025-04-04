
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
        <div className="w-full max-w-lg mx-auto text-white">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Split Payment</h2>
            <p className="text-xl mt-2">
              Total: <span className="font-bold">{formatCurrency(total, 'ZAR')}</span>
            </p>
            <p className="text-md mt-2">
              Allocated: <span className={`font-bold ${totalAllocated > total ? 'text-red-500' : ''}`}>
                {formatCurrency(totalAllocated, 'ZAR')}
              </span>
              <span className="ml-2">
                {totalAllocated < total 
                  ? `(Remaining: ${formatCurrency(total - totalAllocated, 'ZAR')})`
                  : totalAllocated > total 
                    ? `(Over by: ${formatCurrency(totalAllocated - total, 'ZAR')})`
                    : '(Exact amount)'}
              </span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Payment Methods</h3>
              
              <RadioGroup className="space-y-3">
                <div className="flex items-center space-x-3 border border-gray-700 p-3 rounded-md bg-gray-800">
                  <RadioGroupItem value="shop2shop" id="shop2shop" />
                  <Label htmlFor="shop2shop" className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Shop2Shop
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border border-gray-700 p-3 rounded-md bg-gray-800">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center">
                    <Banknote className="h-5 w-5 mr-2" />
                    Cash
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border border-gray-700 p-3 rounded-md bg-gray-800">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Card
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border border-gray-700 p-3 rounded-md bg-gray-800">
                  <RadioGroupItem value="account" id="account" />
                  <Label htmlFor="account" className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Account
                  </Label>
                </div>
              </RadioGroup>
              
              {showCustomerFields && (
                <div className="space-y-3 border border-gray-700 p-3 rounded-md bg-gray-800 mt-4">
                  <h4 className="font-medium">Account Details</h4>
                  <div>
                    <Label htmlFor="customerName" className="text-white mb-1 block">Customer Name</Label>
                    <Input 
                      id="customerName" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      placeholder="Enter customer name"
                      className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone" className="text-white mb-1 block">Phone Number</Label>
                    <Input 
                      id="customerPhone" 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)} 
                      placeholder="Enter phone number"
                      className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Payment Amounts</h3>
              
              <div>
                <Label htmlFor="shop2shop-amount" className="text-white mb-1 block">Shop2Shop Amount</Label>
                <Input 
                  id="shop2shop-amount" 
                  value={amounts.shop2shop} 
                  onChange={(e) => handleAmountChange('shop2shop', e.target.value)} 
                  placeholder="0.00"
                  className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="cash-amount" className="text-white mb-1 block">Cash Amount</Label>
                <Input 
                  id="cash-amount" 
                  value={amounts.cash} 
                  onChange={(e) => handleAmountChange('cash', e.target.value)} 
                  placeholder="0.00"
                  className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="card-amount" className="text-white mb-1 block">Card Amount</Label>
                <Input 
                  id="card-amount" 
                  value={amounts.card} 
                  onChange={(e) => handleAmountChange('card', e.target.value)} 
                  placeholder="0.00" 
                  className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div>
                <Label htmlFor="account-amount" className="text-white mb-1 block">Account Amount</Label>
                <Input 
                  id="account-amount" 
                  value={amounts.account} 
                  onChange={(e) => {
                    handleAmountChange('account', e.target.value);
                    setShowCustomerFields(parseFloat(e.target.value) > 0);
                  }} 
                  placeholder="0.00"
                  className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between space-x-4 mt-6">
            <Button 
              onClick={onCancel} 
              variant="outline"
              className="flex-1 bg-transparent text-white border-gray-600 hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <Button 
              onClick={() => setCurrentPaymentIndex(0)} 
              className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-bold"
              disabled={!readyForPayment}
            >
              <Check className="h-4 w-4 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // We're now in the payment process
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">{getMethodLabel(paymentMethods[currentPaymentIndex])} Payment</h2>
          <p className="text-xl mt-2">
            Amount: <span className="font-bold">{formatCurrency(parseFloat(amounts[paymentMethods[currentPaymentIndex]]) || 0, 'ZAR')}</span>
          </p>
          <p className="text-md mt-2">
            Payment {currentPaymentIndex + 1} of {paymentMethods.length}
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {/* Display appropriate payment instructions based on method */}
          {paymentMethods[currentPaymentIndex] === 'cash' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Please collect cash payment of {formatCurrency(parseFloat(amounts.cash) || 0, 'ZAR')}</p>
            </div>
          )}
          
          {paymentMethods[currentPaymentIndex] === 'card' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Process card payment of {formatCurrency(parseFloat(amounts.card) || 0, 'ZAR')}</p>
              <p className="mt-2">Ensure card payment is approved before proceeding</p>
            </div>
          )}
          
          {paymentMethods[currentPaymentIndex] === 'shop2shop' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Process Shop2Shop payment of {formatCurrency(parseFloat(amounts.shop2shop) || 0, 'ZAR')}</p>
              <p className="mt-2">Verify Shop2Shop transaction before proceeding</p>
            </div>
          )}
          
          {paymentMethods[currentPaymentIndex] === 'account' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Process account payment of {formatCurrency(parseFloat(amounts.account) || 0, 'ZAR')}</p>
              <p className="mt-2">Customer: {customerName}</p>
              <p>Phone: {customerPhone}</p>
            </div>
          )}
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
            onClick={handleProcessPayment}
            className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-bold"
          >
            <Check className="h-4 w-4 mr-2" />
            {currentPaymentIndex < paymentMethods.length - 1 ? "Next Payment" : "Complete Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get display label for payment method
function getMethodLabel(method: string) {
  switch (method) {
    case 'cash': return 'Cash';
    case 'card': return 'Card';
    case 'shop2shop': return 'Shop2Shop';
    case 'account': return 'Account';
    default: return method;
  }
}

export default SplitPaymentScreen;
