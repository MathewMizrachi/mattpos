
import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ArrowUpDown } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CustomerListProps {
  onBack: () => void;
}

type SortKey = 'paymentTermDays' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const CustomerList: React.FC<CustomerListProps> = ({ onBack }) => {
  const { customers, markCustomerAsPaid } = useApp();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'shop2shop'>('cash');
  const navigate = useNavigate();
  
  // Format date to show only date part
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleMakePayment = async (customerId: number) => {
    // Navigate to POS with customer info
    navigate('/pos', { state: { customerId } });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if already sorting by this key
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort key and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handlePaymentOptionClick = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setShowPaymentOptions(true);
  };

  const handleProcessPayment = () => {
    if (selectedCustomerId === null) return;
    
    const success = markCustomerAsPaid(selectedCustomerId);
    if (success) {
      toast({
        title: "Payment processed successfully",
        description: `Account marked as paid using ${paymentMethod}`,
      });
      setShowPaymentOptions(false);
      setSelectedCustomerId(null);
    } else {
      toast({
        title: "Payment processing failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Sort and memoize the customers array
  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      if (sortKey === 'paymentTermDays') {
        const valueA = a.paymentTermDays || 0;
        const valueB = b.paymentTermDays || 0;
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        const dateA = new Date(a[sortKey]).getTime();
        const dateB = new Date(b[sortKey]).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  }, [customers, sortKey, sortDirection]);

  // Check if a customer has exceeded their payment term
  const hasExceededPaymentTerm = (customer: any) => {
    if (!customer.paymentTermDays || customer.isPaid) return false;
    
    const createdDate = new Date(customer.createdAt);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > customer.paymentTermDays;
  };
  
  // If showing payment options modal
  if (showPaymentOptions && selectedCustomerId !== null) {
    const customer = customers.find(c => c.id === selectedCustomerId);
    
    return (
      <div className="min-h-screen bg-gray-50 pt-6 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
          <p className="mb-4">Process payment for {customer?.name}</p>
          
          <RadioGroup value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'shop2shop') => setPaymentMethod(value)} className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Cash</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shop2shop" id="shop2shop" />
              <Label htmlFor="shop2shop">Shop2Shop</Label>
            </div>
          </RadioGroup>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentOptions(false)}
              className="flex-1"
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
          <h1 className="text-2xl font-bold">Customers / Accounts</h1>
        </div>
        
        {customers.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No customers yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>ID/Passport</TableHead>
                  <TableHead onClick={() => toggleSort('paymentTermDays')} className="cursor-pointer">
                    Payment Term
                    <ArrowUpDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead onClick={() => toggleSort('createdAt')} className="cursor-pointer">
                    Created
                    <ArrowUpDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead onClick={() => toggleSort('updatedAt')} className="cursor-pointer">
                    Last Updated
                    <ArrowUpDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell className={hasExceededPaymentTerm(customer) ? "text-red-600 font-semibold" : ""}>
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.idNumber || '-'}</TableCell>
                    <TableCell>{customer.paymentTermDays ? `${customer.paymentTermDays} days` : '-'}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>{formatDate(customer.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={processingId === customer.id}
                          onClick={() => handleMakePayment(customer.id)}
                          className="flex items-center gap-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 hover:text-[#0A2645] border-[#FAA225]"
                        >
                          <Check className="h-4 w-4" />
                          Make Payment
                        </Button>
                        {!customer.isPaid && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePaymentOptionClick(customer.id)}
                            className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
