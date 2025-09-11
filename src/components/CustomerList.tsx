
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Search, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A2645] via-[#0A2645] to-[#1a3a5f] flex flex-col">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAA225]/20 via-[#FAA225]/10 to-transparent opacity-50"></div>
        <header className="relative bg-white/95 backdrop-blur-sm p-6 shadow-lg border-b-4 border-[#FAA225] rounded-xl m-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="text-[#0A2645] hover:bg-[#0A2645]/10 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-[#FAA225] to-[#e8940f] rounded-lg shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#0A2645] bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] bg-clip-text">
                    Customer Accounts
                  </h1>
                  <p className="text-sm text-[#0A2645]/70 mt-1">Manage customer accounts and payment records</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowAddCustomer(true)}
                className="bg-gradient-to-r from-[#FAA225] to-[#e8940f] hover:from-[#e8940f] hover:to-[#FAA225] text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </header>
      </div>
      
      <div className="flex-1 px-6 pb-6 space-y-6">
        {/* Enhanced Search Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-white/70" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 backdrop-blur-sm text-white placeholder:text-white/70 border-white/30 focus:border-[#FAA225] focus:ring-[#FAA225]/20 transition-all duration-200"
            />
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-500 font-medium">No customers found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
              </div>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div 
                key={customer.id} 
                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => handleCustomerClick(customer.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary text-base truncate">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {customer.phone}
                    </p>
                  </div>
                  <div className="ml-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      customer.isPaid 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {customer.isPaid ? "Paid" : "Outstanding"}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Total Purchases:</span>
                    <p className="font-semibold text-primary">
                      {formatCurrency(getTotalPurchases(customer.id))}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Amount Owing:</span>
                    <p className="font-bold text-red-600">
                      {formatCurrency(getAmountOwed(customer.id))}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full bg-gradient-to-r from-secondary to-secondary/80 text-primary border-none font-bold shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomerClick(customer.id);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 hover:shadow-3xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-primary/80 border-none">
                  <TableHead className="text-secondary font-bold text-sm whitespace-nowrap">
                    Name
                  </TableHead>
                  <TableHead className="text-secondary font-bold text-sm whitespace-nowrap">
                    Phone
                  </TableHead>
                  <TableHead className="text-secondary font-bold text-sm whitespace-nowrap">
                    Total Purchases
                  </TableHead>
                  <TableHead className="text-secondary font-bold text-sm whitespace-nowrap">
                    Owing
                  </TableHead>
                  <TableHead className="text-secondary font-bold text-sm whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="text-secondary font-bold text-sm whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500 font-medium">No customers found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <TableRow 
                      key={customer.id} 
                      className={`cursor-pointer hover:bg-gradient-to-r hover:from-secondary/5 hover:to-secondary/10 border-b border-gray-100 transition-all duration-200 hover:shadow-lg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      onClick={() => handleCustomerClick(customer.id)}
                    >
                      <TableCell className="font-semibold text-primary">
                        {customer.name}
                      </TableCell>
                      <TableCell className="text-primary/80">
                        {customer.phone}
                      </TableCell>
                      <TableCell className="text-primary font-semibold">
                        {formatCurrency(getTotalPurchases(customer.id))}
                      </TableCell>
                      <TableCell className="text-red-600 font-bold">
                        {formatCurrency(getAmountOwed(customer.id))}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all duration-200 ${
                          customer.isPaid 
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200" 
                            : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200"
                        }`}>
                          {customer.isPaid ? "Paid" : "Outstanding"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-gradient-to-r from-secondary to-secondary/80 text-primary hover:from-secondary/80 hover:to-secondary border-none font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerClick(customer.id);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
