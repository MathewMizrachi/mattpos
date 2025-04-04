
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerInformationProps {
  customerName: string;
  customerPhone: string;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  customerName,
  customerPhone,
  setCustomerName,
  setCustomerPhone
}) => {
  return (
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
  );
};

export default CustomerInformation;
