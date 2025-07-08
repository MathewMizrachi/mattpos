
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartBarIcon, ArrowLeft, DollarSignIcon, TrendingUpIcon, UsersIcon, BarChart3Icon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import db from '@/lib/db';

// Import refactored components
import { SalesReportTab } from '@/components/Reports/SalesReportTab';
import { InventoryStatusTab } from '@/components/Reports/InventoryStatusTab';
import { PaymentMethodsTab } from '@/components/Reports/PaymentMethodsTab';
import { ProfitPlusTab } from '@/components/Reports/ProfitPlusTab';
import { ReportTypeSelector } from '@/components/Reports/ReportTypeSelector';

const Reports = () => {
  const { currentUser, getShiftPaymentBreakdown } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sales');
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const [inventorySortBy, setInventorySortBy] = useState<'problematic' | 'popular' | 'restocked' | 'status'>('problematic');
  const [profitPlusSearchTerm, setProfitPlusSearchTerm] = useState('');
  const [profitPlusSortBy, setProfitPlusSortBy] = useState<'name' | 'count' | 'value' | 'commission'>('name');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Get ALL products from the database instead of AppContext
  const allProducts = db.getAllProducts();
  
  // Sample data - this would typically come from API calls
  const salesData = [
    { date: '2025-03-31', total: 1256.75, transactions: 42, avgSale: 29.92 },
    { date: '2025-04-01', total: 987.50, transactions: 35, avgSale: 28.21 },
    { date: '2025-04-02', total: 1432.25, transactions: 48, avgSale: 29.84 },
    { date: '2025-04-03', total: 1105.00, transactions: 39, avgSale: 28.33 },
  ];
  
  // Generate inventory data from ALL available products in the database
  const inventoryData = allProducts.map(product => {
    const currentStock = product.stock !== undefined ? product.stock : 0;
    const reorderLevel = Math.max(5, Math.floor(currentStock * 0.3)); // 30% of current stock as reorder level, minimum 5
    
    return {
      productName: product.name,
      currentStock: currentStock,
      reorderLevel: reorderLevel,
      lastRestocked: '2025-04-01', // Sample data as we don't have real restock dates
      isProblematic: currentStock < reorderLevel
    };
  });
  
  const paymentMethodsData = [
    { method: 'Shop2Shop', amount: 587.25, percentage: 12.2 },
    { method: 'Card', amount: 2156.75, percentage: 45.0 },
    { method: 'Cash', amount: 1845.50, percentage: 38.5 },
    { method: 'Account', amount: 205.00, percentage: 4.3 },
  ];
  
  const profitPlusData = {
    daily: [
      { date: '2025-03-31', transactions: 5, revenue: 450.00, commission: 22.50 },
      { date: '2025-04-01', transactions: 3, revenue: 275.00, commission: 13.75 },
      { date: '2025-04-02', transactions: 7, revenue: 675.00, commission: 33.75 },
      { date: '2025-04-03', transactions: 4, revenue: 400.00, commission: 20.00 },
    ],
    products: [
      { name: "Airtime R10", count: 35, value: 350.00, commission: 17.50 },
      { name: "Data 1GB", count: 12, value: 1020.00, commission: 51.00 },
      { name: "Electricity", count: 6, value: 430.00, commission: 21.50 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return `R ${amount.toFixed(2)}`;
  };

  const getTotalSales = () => {
    return salesData.reduce((sum, day) => sum + day.total, 0);
  };

  const getTotalTransactions = () => {
    return salesData.reduce((sum, day) => sum + day.transactions, 0);
  };

  const getAverageTransaction = () => {
    const total = getTotalSales();
    const transactions = getTotalTransactions();
    return transactions > 0 ? total / transactions : 0;
  };

  const getProblematicItems = () => {
    return inventoryData.filter(item => item.isProblematic).length;
  };

  return (
    <div className="min-h-screen bg-[#0A2645]">
      {/* Header */}
      <div className="bg-[#0A2645] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="mr-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-1">Reports & Analytics</h1>
              <p className="text-white/70">Till2Day Restaurant System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {isMobile ? (
              <ReportTypeSelector activeTab={activeTab} setActiveTab={setActiveTab} />
            ) : (
              <Tabs defaultValue="sales" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg mb-6">
                  <TabsTrigger 
                    value="sales" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white text-gray-600 font-medium"
                  >
                    Sales Report
                  </TabsTrigger>
                  <TabsTrigger 
                    value="inventory" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white text-gray-600 font-medium"
                  >
                    Inventory Status
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white text-gray-600 font-medium"
                  >
                    Payment Methods
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profitplus" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white text-gray-600 font-medium"
                  >
                    Profit+
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            
            {/* Content Area */}
            {activeTab === 'sales' && (
              <SalesReportTab 
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                salesData={salesData}
              />
            )}
            
            {activeTab === 'inventory' && (
              <InventoryStatusTab 
                inventoryData={inventoryData}
                searchTerm={inventorySearchTerm}
                setSearchTerm={setInventorySearchTerm}
                sortBy={inventorySortBy}
                setSortBy={setInventorySortBy}
              />
            )}
            
            {activeTab === 'payment' && (
              <PaymentMethodsTab 
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                paymentMethodsData={paymentMethodsData}
              />
            )}
            
            {activeTab === 'profitplus' && (
              <ProfitPlusTab 
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                profitPlusData={profitPlusData}
                searchTerm={profitPlusSearchTerm}
                setSearchTerm={setProfitPlusSearchTerm}
                sortBy={profitPlusSortBy}
                setSortBy={setProfitPlusSortBy}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
