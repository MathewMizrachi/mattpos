
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';

interface AccountPaymentScreenProps {
  total: number;
  onProcessPayment: (customerName: string, customerPhone: string, customerIdNumber: string, paymentTermDays: number) => void;
  onCancel: () => void;
  customerInfo?: { name: string; phone: string; idNumber?: string };
}

const AccountPaymentScreen: React.FC<AccountPaymentScreenProps> = ({
  total,
  onProcessPayment,
  onCancel,
  customerInfo
}) => {
  const [customerName, setCustomerName] = useState(customerInfo?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customerInfo?.phone || '');
  const [customerIdNumber, setCustomerIdNumber] = useState(customerInfo?.idNumber || '');
  const [paymentTermDays, setPaymentTermDays] = useState(30); // Default to 30 days

  const handlePayment = () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerIdNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Customer name, phone number, and ID/Passport number are required",
        variant: "destructive"
      });
      return;
    }

    // Process account payment
    onProcessPayment(customerName, customerPhone, customerIdNumber, paymentTermDays);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-2">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Users className="h-20 w-20 text-[#FAA225]" />
          </div>
          <h2 className="text-3xl font-bold">Account Payment</h2>
          <p className="text-5xl mt-2 font-extrabold">{formatCurrency(total)}</p>
        </div>
        
        <div className="space-y-4 mb-6">
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

          <div>
            <Label htmlFor="customerIdNumber" className="text-white mb-1 block">ID/Passport Number</Label>
            <Input 
              id="customerIdNumber" 
              value={customerIdNumber} 
              onChange={(e) => setCustomerIdNumber(e.target.value)} 
              placeholder="Enter ID or passport number"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="paymentTermDays" className="text-white mb-1 block">Payment Term (Days)</Label>
            <Input 
              id="paymentTermDays" 
              type="number"
              value={paymentTermDays} 
              onChange={(e) => setPaymentTermDays(parseInt(e.target.value))} 
              placeholder="Number of days"
              min={1}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onCancel} 
            variant="outline"
            className="bg-transparent text-white border-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPaymentScreen;
