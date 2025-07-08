
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A2645] via-[#0A2645] to-[#1a3a5c] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Gradient */}
        <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-xl mb-8 border border-gray-200 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="mr-4 bg-white border-2 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5c] p-3 rounded-xl mr-4 shadow-lg">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0A2645] to-[#1a3a5c] bg-clip-text text-transparent">
                      Reports & Analytics
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">Business Intelligence Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live Data
                  </span>
                  <span>Till2Day Restaurant System</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5c] p-1">
            <div className="bg-white rounded-t-2xl">
              <CardContent className="p-8">
                {isMobile ? (
                  <div className="mb-8">
                    <ReportTypeSelector activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>
                ) : (
                  <Tabs defaultValue="sales" onValueChange={setActiveTab} value={activeTab}>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-2xl mb-8 shadow-inner">
                      <TabsList className="grid w-full grid-cols-4 bg-transparent p-1 rounded-xl">
                        <TabsTrigger 
                          value="sales" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0A2645] data-[state=active]:to-[#1a3a5c] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:bg-white/50"
                        >
                          📊 Sales Report
                        </TabsTrigger>
                        <TabsTrigger 
                          value="inventory" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0A2645] data-[state=active]:to-[#1a3a5c] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:bg-white/50"
                        >
                          📦 Inventory Status
                        </TabsTrigger>
                        <TabsTrigger 
                          value="payment" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0A2645] data-[state=active]:to-[#1a3a5c] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:bg-white/50"
                        >
                          💳 Payment Methods
                        </TabsTrigger>
                        <TabsTrigger 
                          value="profitplus" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0A2645] data-[state=active]:to-[#1a3a5c] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 font-semibold rounded-lg transition-all duration-200 hover:bg-white/50"
                        >
                          💰 Profit+
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </Tabs>
                )}
                
                {/* Content Area with Enhanced Styling */}
                <div className="bg-gradient-to-br from-gray-50/50 to-white p-6 rounded-2xl shadow-inner border border-gray-100">
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
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
