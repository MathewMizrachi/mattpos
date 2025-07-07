
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import db from '@/lib/db';

// Import refactored components
import { ReportHeader } from '@/components/Reports/ReportHeader';
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
  console.log('=== INVENTORY DEBUG INFO ===');
  console.log('Total products from database:', allProducts.length);
  console.log('Database products sample:', allProducts.slice(0, 5));
  
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

  console.log('Final inventory data for display:', inventoryData.length);
  console.log('=== END DEBUG INFO ===');
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2645] to-[#1e3a5f] p-4">
      <div className="max-w-7xl mx-auto">
        <ReportHeader />
        
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A2645] to-[#1e3a5f] text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Business Analytics Dashboard</h2>
            <p className="text-blue-100">Comprehensive insights into your business performance</p>
          </div>
          
          <div className="p-6">
            {isMobile ? (
              <ReportTypeSelector activeTab={activeTab} setActiveTab={setActiveTab} />
            ) : (
              <Tabs defaultValue="sales" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg mb-6">
                  <TabsTrigger 
                    value="sales" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white font-medium"
                  >
                    Sales Report
                  </TabsTrigger>
                  <TabsTrigger 
                    value="inventory" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white font-medium"
                  >
                    Inventory Status
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white font-medium"
                  >
                    Payment Methods
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profitplus" 
                    className="data-[state=active]:bg-[#0A2645] data-[state=active]:text-white font-medium"
                  >
                    Profit+
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            
            <div className="bg-gray-50 rounded-lg p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
