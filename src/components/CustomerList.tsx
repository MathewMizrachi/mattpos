
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
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

interface CustomerListProps {
  onBack: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onBack }) => {
  const { customers, markCustomerAsPaid } = useApp();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Format date to show only date part
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleMakePayment = async (customerId: number) => {
    // Navigate to POS with customer info
    navigate('/pos', { state: { customerId } });
  };
  
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
                  <TableHead>Payment Term</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.idNumber || '-'}</TableCell>
                    <TableCell>{customer.paymentTermDays ? `${customer.paymentTermDays} days` : '-'}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>{formatDate(customer.updatedAt)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={processingId === customer.id || !customer.paymentTermDays}
                        onClick={() => handleMakePayment(customer.id)}
                        className="flex items-center gap-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 hover:text-[#0A2645] border-[#FAA225]"
                      >
                        <Check className="h-4 w-4" />
                        Make Payment
                      </Button>
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
