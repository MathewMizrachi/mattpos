
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingBag, CreditCard, Banknote, Users } from 'lucide-react';

const PaymentMethodSelection: React.FC = () => {
  return (
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
    </div>
  );
};

export default PaymentMethodSelection;
