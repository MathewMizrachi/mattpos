
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

// Import refactored components
import { ReportHeader } from '@/components/Reports/ReportHeader';
import { SalesReportTab } from '@/components/Reports/SalesReportTab';
import { InventoryStatusTab } from '@/components/Reports/InventoryStatusTab';
import { PaymentMethodsTab } from '@/components/Reports/PaymentMethodsTab';
import { ProfitPlusTab } from '@/components/Reports/ProfitPlusTab';
import { ReportTypeSelector } from '@/components/Reports/ReportTypeSelector';

const Reports = () => {
  const { currentUser, getShiftPaymentBreakdown, products } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sales');
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [toDate, setToDate] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Sample data - this would typically come from API calls
  const salesData = [
    { date: '2025-03-31', total: 1256.75, transactions: 42, avgSale: 29.92 },
    { date: '2025-04-01', total: 987.50, transactions: 35, avgSale: 28.21 },
    { date: '2025-04-02', total: 1432.25, transactions: 48, avgSale: 29.84 },
    { date: '2025-04-03', total: 1105.00, transactions: 39, avgSale: 28.33 },
  ];
  
  const inventoryData = products.map(product => ({
    productName: product.name,
    currentStock: product.stock !== undefined ? product.stock : 0,
    reorderLevel: Math.max(10, Math.floor((product.stock || 0) * 0.2)), // 20% of current stock as reorder level
    lastRestocked: '2025-04-01' // Sample data as we don't have real restock dates
  }));
  
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
    <div className="min-h-screen bg-[#0A2645] p-4">
      <div className="max-w-6xl mx-auto">
        <ReportHeader />
        
        <Card>
          <CardHeader>
            <CardTitle>Report Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <ReportTypeSelector activeTab={activeTab} setActiveTab={setActiveTab} />
            ) : (
              <Tabs defaultValue="sales" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="w-full justify-start mb-6 bg-[#FAA225] text-[#0A2645]" scrollable>
                  <TabsTrigger value="sales" className="data-[state=active]:bg-white whitespace-nowrap">Sales Report</TabsTrigger>
                  <TabsTrigger value="inventory" className="data-[state=active]:bg-white whitespace-nowrap">Inventory Status</TabsTrigger>
                  <TabsTrigger value="payment" className="data-[state=active]:bg-white whitespace-nowrap">Payment Methods</TabsTrigger>
                  <TabsTrigger value="profitplus" className="data-[state=active]:bg-white whitespace-nowrap">Profit+</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            
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
              <InventoryStatusTab inventoryData={inventoryData} />
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
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
