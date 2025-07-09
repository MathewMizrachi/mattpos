
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, User, Phone, CreditCard, Calendar, Clock } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <div className="min-h-screen bg-[#0A2645] p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-[#0A2645]">Customer Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={onBack} variant="outline" className="text-[#0A2645] border-[#0A2645]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customer List
            </Button>
          </CardContent>
        </Card>
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
  
  // Payment options modal
  if (showPaymentOptions) {
    return (
      <div className="min-h-screen bg-[#0A2645] p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-[#0A2645]">Select Payment Method</CardTitle>
            <p className="text-gray-600 mt-2">Process payment for {customer.name}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'shop2shop') => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2 p-2 rounded border">
                <RadioGroupItem value="cash" id="customer-cash" />
                <Label htmlFor="customer-cash" className="flex-1 cursor-pointer">Cash Payment</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded border">
                <RadioGroupItem value="card" id="customer-card" />
                <Label htmlFor="customer-card" className="flex-1 cursor-pointer">Card Payment</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded border">
                <RadioGroupItem value="shop2shop" id="customer-shop2shop" />
                <Label htmlFor="customer-shop2shop" className="flex-1 cursor-pointer">Shop2Shop</Label>
              </div>
            </RadioGroup>
            
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentOptions(false)}
                className="flex-1 text-[#0A2645] border-[#0A2645]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProcessPayment}
                className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90"
              >
                Process Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A2645] p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={onBack} 
                  variant="outline" 
                  size="lg"
                  className="bg-white text-[#0A2645] border-2 border-[#0A2645] hover:bg-[#0A2645] hover:text-white font-semibold px-4 py-2"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-[#0A2645]">Customer Profile</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  customer.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {customer.isPaid ? "Paid" : "Outstanding"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0A2645] flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#0A2645]">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Name:</span>
                  <span>{customer.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#0A2645]">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{customer.phone}</span>
                </div>
                {customer.idNumber && (
                  <div className="flex items-center gap-2 text-[#0A2645]">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">ID/Passport:</span>
                    <span>{customer.idNumber}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#0A2645]">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-[#0A2645]">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Payment Terms:</span>
                  <span>{customer.paymentTermDays ? `${customer.paymentTermDays} days` : 'None'}</span>
                </div>
              </div>
            </div>
            
            {!customer.isPaid && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <Button 
                  size="sm"
                  onClick={() => onMakePayment(customer.id)}
                  className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90"
                >
                  <Check className="h-4 w-4 mr-1" />
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
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0A2645]">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-[#0A2645]">{formatDate(transaction.date)}</TableCell>
                        <TableCell className="text-[#0A2645]">{transaction.description}</TableCell>
                        <TableCell className="text-[#0A2645] font-medium">{formatCurrency(transaction.amount)}</TableCell>
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
                              className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 border-[#FAA225]"
                            >
                              Pay
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>{customer.isPaid ? "All accounts have been settled" : "No transaction history available"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfile;
