
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
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import CustomerForm from './CustomerForm';

interface CustomerListProps {
  onBack: () => void;
  onSelectCustomer?: (customerId: number) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onBack, onSelectCustomer }) => {
  const { customers, addCustomer } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const isMobile = useIsMobile();
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );
  
  const handleCustomerClick = (customerId: number) => {
    if (onSelectCustomer) {
      onSelectCustomer(customerId);
    }
  };
  
  const handleAddCustomer = (customerData: any) => {
    const success = addCustomer(customerData);
    if (success) {
      toast({
        title: "Customer added successfully",
        description: `${customerData.name} has been added to the system`,
      });
    } else {
      toast({
        title: "Failed to add customer",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  // Mock function to get total purchases for each customer
  const getTotalPurchases = (customerId: number) => {
    // Generate a consistent amount based on customer ID
    const baseAmount = (customerId * 150) + ((customerId % 7) * 75);
    return baseAmount;
  };
  
  // Mock function to get amount owed for each customer
  const getAmountOwed = (customerId: number) => {
    // Generate a consistent random amount based on customer ID
    const baseAmount = customerId * 100;
    const multiplier = (customerId % 3) + 1;
    return baseAmount * multiplier;
  };
  
  return (
    <div className="min-h-screen bg-[#0A2645] flex flex-col">
      <header className="bg-[#0A2645] p-4 shadow-sm flex justify-between items-center border-2 border-[#FAA225] rounded-lg m-4 mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Accounts</h1>
            <p className="text-sm text-white/70">Manage customer accounts and payments</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAddCustomer(true)}
            className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </header>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-2 top-3 h-4 w-4 text-white/70" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-[#0A2645] text-white border-2 border-[#FAA225] focus:border-[#FAA225] placeholder:text-white/50"
            />
          </div>
        </div>
        
        <div className="bg-[#0A2645] rounded-lg shadow overflow-x-auto border-2 border-[#FAA225]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#0A2645] border-[#FAA225]">
                <TableHead className={`text-[#FAA225] font-bold ${isMobile ? "text-xs p-2" : ""}`}>Name</TableHead>
                {!isMobile && <TableHead className="text-[#FAA225] font-bold">Phone</TableHead>}
                <TableHead className={`text-[#FAA225] font-bold ${isMobile ? "text-xs p-2" : ""}`}>Total Purchases</TableHead>
                <TableHead className={`text-[#FAA225] font-bold ${isMobile ? "text-xs p-2" : ""}`}>Owing</TableHead>
                <TableHead className={`text-[#FAA225] font-bold ${isMobile ? "text-xs p-2" : ""}`}>Status</TableHead>
                <TableHead className={`text-[#FAA225] font-bold ${isMobile ? "text-xs p-2" : ""}`}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-4 text-white/70">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id} 
                    className={`cursor-pointer hover:bg-white/5 border-b border-[#FAA225]/30 ${isMobile ? 'text-xs' : ''}`}
                    onClick={() => handleCustomerClick(customer.id)}
                  >
                    <TableCell className={`font-medium text-white ${isMobile ? 'p-2' : ''}`}>{customer.name}</TableCell>
                    {!isMobile && <TableCell className="text-white">{customer.phone}</TableCell>}
                    <TableCell className={`text-white font-semibold ${isMobile ? 'p-2' : ''}`}>{formatCurrency(getTotalPurchases(customer.id))}</TableCell>
                    <TableCell className={`text-red-400 font-semibold ${isMobile ? 'p-2' : ''}`}>{formatCurrency(getAmountOwed(customer.id))}</TableCell>
                    <TableCell className={isMobile ? 'p-2' : ''}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        customer.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {customer.isPaid ? "Paid" : "Outstanding"}
                      </span>
                    </TableCell>
                    <TableCell className={isMobile ? 'p-2' : ''}>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 border-[#FAA225] font-bold ${isMobile ? 'text-xs px-2 py-1' : ''}`}
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
      
      <CustomerForm
        isOpen={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
};

export default CustomerList;
