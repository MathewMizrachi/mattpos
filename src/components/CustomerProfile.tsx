
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
      <div className="min-h-screen bg-[#0A2645] pt-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Button onClick={onBack} variant="outline" className="mr-4 bg-[#0A2645] text-white border-[#FAA225] hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Customer Not Found</h1>
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
  
  // Mock transactions for display purposes
  const transactions = [
    {
      id: 1,
      date: new Date('2025-03-15'),
      amount: 350.75,
      isPaid: false,
      description: 'Grocery Purchase'
    },
    {
      id: 2,
      date: new Date('2025-03-01'),
      amount: 120.50,
      isPaid: true,
      description: 'Household Items'
    },
    {
      id: 3,
      date: new Date('2025-02-20'),
      amount: 250.00,
      isPaid: false,
      description: 'Electronics'
    }
  ];
  
  // If showing payment options modal
  if (showPaymentOptions) {
    return (
      <div className="min-h-screen bg-[#0A2645] pt-6 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0A2645] border-2 border-[#FAA225] rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Select Payment Method</h2>
          <p className="mb-4 text-white">Process payment for {customer.name}</p>
          
          <RadioGroup value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'shop2shop') => setPaymentMethod(value)} className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="cash" id="customer-cash" />
              <Label htmlFor="customer-cash" className="text-white">Cash</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="card" id="customer-card" />
              <Label htmlFor="customer-card" className="text-white">Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shop2shop" id="customer-shop2shop" />
              <Label htmlFor="customer-shop2shop" className="text-white">Shop2Shop</Label>
            </div>
          </RadioGroup>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentOptions(false)}
              className="flex-1 bg-[#0A2645] text-white border-[#FAA225] hover:bg-white/10"
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
    <div className="min-h-screen bg-[#0A2645] pt-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="outline" className="mr-4 bg-[#0A2645] text-white border-[#FAA225] hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Customer Profile</h1>
        </div>
        
        <div className="bg-[#0A2645] border-2 border-[#FAA225] rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">{customer.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-white/70">Phone: {customer.phone}</p>
              {customer.idNumber && <p className="text-white/70">ID/Passport: {customer.idNumber}</p>}
              <p className="text-white/70">Created: {formatDate(customer.createdAt)}</p>
              <p className="text-white/70">Payment Terms: {customer.paymentTermDays ? `${customer.paymentTermDays} days` : 'None'}</p>
            </div>
            <div className="flex flex-col justify-end items-end">
              <p className="text-lg font-bold mb-2 text-white">
                Status: <span className={customer.isPaid ? "text-green-400" : "text-red-400"}>
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
        
        <div className="bg-[#0A2645] border-2 border-[#FAA225] rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Transaction History</h2>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#FAA225]">
                  <TableHead className="text-[#FAA225]">Date</TableHead>
                  <TableHead className="text-[#FAA225]">Description</TableHead>
                  <TableHead className="text-[#FAA225]">Amount</TableHead>
                  <TableHead className="text-[#FAA225]">Status</TableHead>
                  <TableHead className="text-[#FAA225]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-[#FAA225]/30 hover:bg-white/5">
                    <TableCell className="text-white">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="text-white">{transaction.description}</TableCell>
                    <TableCell className="text-white">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {transaction.isPaid ? "Paid" : "Outstanding"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {!transaction.isPaid && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleMarkAsPaid}
                          className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 hover:text-[#0A2645] border-[#FAA225]"
                        >
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-white/70">
              {customer.isPaid ? "All accounts have been settled" : "No transaction history available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
