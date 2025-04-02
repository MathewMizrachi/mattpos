
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

interface CardPaymentScreenProps {
  total: number;
  onProcessPayment: () => void;
  onCancel: () => void;
}

const CardPaymentScreen: React.FC<CardPaymentScreenProps> = ({
  total,
  onProcessPayment,
  onCancel
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProcessPayment();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <Card className="w-full max-w-md bg-[#0A2645] border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Card Payment</CardTitle>
          <CardDescription className="text-center text-4xl font-bold text-white">
            {formatCurrency(total)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Cardholder Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-white text-[#0A2645] border-gray-300" 
                placeholder="John Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
              <Input 
                id="cardNumber" 
                value={cardNumber} 
                onChange={(e) => setCardNumber(e.target.value)} 
                className="bg-white text-[#0A2645] border-gray-300" 
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                <Input 
                  id="expiry" 
                  value={expiry} 
                  onChange={(e) => setExpiry(e.target.value)} 
                  className="bg-white text-[#0A2645] border-gray-300" 
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc" className="text-white">CVC</Label>
                <Input 
                  id="cvc" 
                  value={cvc} 
                  onChange={(e) => setCvc(e.target.value)} 
                  className="bg-white text-[#0A2645] border-gray-300" 
                  placeholder="123"
                  type="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="text-white border-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={onProcessPayment}
            className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
          >
            Pay {formatCurrency(total)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardPaymentScreen;
