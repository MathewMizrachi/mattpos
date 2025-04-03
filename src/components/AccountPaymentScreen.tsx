
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AccountPaymentScreenProps {
  total: number;
  onProcessPayment: (customerName: string, customerPhone: string, idNumber?: string, paymentTermDays?: number) => void;
  onCancel: () => void;
  customerInfo?: { name: string; phone: string };
}

const AccountPaymentScreen: React.FC<AccountPaymentScreenProps> = ({
  total,
  onProcessPayment,
  onCancel,
  customerInfo
}) => {
  const [customerName, setCustomerName] = useState(customerInfo?.name || '');
  const [customerPhone, setCustomerPhone] = useState(customerInfo?.phone || '');
  const [idNumber, setIdNumber] = useState('');
  const [paymentTermDays, setPaymentTermDays] = useState('30');
  
  const handleProcessPayment = () => {
    if (!customerName) {
      toast({
        title: "Customer name required",
        description: "Please enter customer name",
        variant: "destructive"
      });
      return;
    }
    
    if (!customerPhone) {
      toast({
        title: "Phone number required",
        description: "Please enter customer phone number",
        variant: "destructive"
      });
      return;
    }
    
    // Call parent's onProcessPayment with customer details
    onProcessPayment(
      customerName, 
      customerPhone,
      idNumber || undefined,
      parseInt(paymentTermDays) || 30
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-2">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Account Payment</h2>
          <p className="text-xl mt-2">
            Total: <span className="font-bold">{formatCurrency(total)}</span>
          </p>
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
            <Label htmlFor="idNumber" className="text-white mb-1 block">ID/Passport Number</Label>
            <Input 
              id="idNumber" 
              value={idNumber} 
              onChange={(e) => setIdNumber(e.target.value)} 
              placeholder="Enter ID or passport number (optional)"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="paymentTerm" className="text-white mb-1 block">Payment Term (days)</Label>
            <Input 
              id="paymentTerm" 
              type="number"
              min="1"
              max="365"
              value={paymentTermDays} 
              onChange={(e) => setPaymentTermDays(e.target.value)} 
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
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
            className="flex-1 bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPaymentScreen;
