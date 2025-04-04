
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface CustomerListProps {
  onBack: () => void;
  onSelectCustomer?: (customerId: number) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onBack, onSelectCustomer }) => {
  const { customers } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const handleCustomerClick = (customerId: number) => {
    if (onSelectCustomer) {
      onSelectCustomer(customerId);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button onClick={onBack} variant="outline" className="mr-4 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Customers</h1>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Button className="bg-[#0A2645] text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Customer
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCustomerClick(customer.id)}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {customer.isPaid ? "Paid" : "Outstanding"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerClick(customer.id);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
