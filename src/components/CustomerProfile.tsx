
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface CustomerProfileProps {
  customerId: number;
  onBack: () => void;
  onMakePayment: (customerId: number) => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ 
  customerId, 
  onBack,
  onMakePayment
}) => {
  const { customers, markCustomerAsPaid } = useApp();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'shop2shop'>('cash');
  
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Button onClick={onBack} variant="outline" className="mr-4 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Customer Not Found</h1>
          </div>
        </div>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const handleMarkAsPaid = () => {
    setShowPaymentOptions(true);
  };
  
  const handleProcessPayment = () => {
    const success = markCustomerAsPaid(customerId);
    if (success) {
      toast({
        title: "Payment processed successfully",
        description: `Account marked as paid using ${paymentMethod}`,
      });
      setShowPaymentOptions(false);
    } else {
      toast({
        title: "Payment processing failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  // If showing payment options modal
  if (showPaymentOptions) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
          <p className="mb-4">Process payment for {customer.name}</p>
          
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
              onClick={() => setShowPaymentOptions(false)}
              className="flex-1 text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProcessPayment}
              className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 hover:text-[#0A2645]"
            >
              Process Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="outline" className="mr-4 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Customer Profile</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{customer.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Phone: {customer.phone}</p>
              {customer.idNumber && <p className="text-gray-600">ID/Passport: {customer.idNumber}</p>}
              <p className="text-gray-600">Created: {formatDate(customer.createdAt)}</p>
              <p className="text-gray-600">Payment Terms: {customer.paymentTermDays ? `${customer.paymentTermDays} days` : 'None'}</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="text-lg font-bold mb-2">
                Status: <span className={customer.isPaid ? "text-green-600" : "text-red-600"}>
                  {customer.isPaid ? "Paid" : "Outstanding"}
                </span>
              </p>
              <div className="flex space-x-2">
                {!customer.isPaid && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onMakePayment(customer.id)}
                      className="flex items-center gap-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 hover:text-[#0A2645] border-[#FAA225]"
                    >
                      <Check className="h-4 w-4" />
                      Make Payment
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleMarkAsPaid}
                      className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                    >
                      Mark Paid
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <div className="text-center py-4 text-gray-500">
            {customer.isPaid ? "All accounts have been settled" : "Outstanding account balance"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
