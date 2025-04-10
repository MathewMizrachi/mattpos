
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Shift } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import ShiftHeader from './ShiftHeader';
import ShiftTabSelector from './ShiftTabSelector';
import SalesTab from './tabs/SalesTab';
import PaymentMethodsTab from './tabs/PaymentMethodsTab';
import RefundsTab from './tabs/RefundsTab';
import InventoryTab from './tabs/InventoryTab';
import ProfitPlusTab from './tabs/ProfitPlusTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShiftReportProps {
  shift: Shift;
  paymentBreakdown: {
    cash: number;
    card: number;
    shop2shop: number;
    account: number;
  };
  refundBreakdown: {
    total: number;
    items: {
      productId: number;
      productName: string;
      quantity: number;
      amount: number;
    }[];
  };
  lowStockProducts: any[];
  expectedCashInDrawer: number;
  onClose: () => void;
}

const ShiftReport: React.FC<ShiftReportProps> = ({
  shift,
  paymentBreakdown,
  refundBreakdown,
  lowStockProducts,
  expectedCashInDrawer,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('sales');
  const isMobile = useIsMobile();
  
  // Calculate totals
  const totalSales = shift?.salesTotal || 0;
  const grossProfit = totalSales * 0.25; // Assuming 25% profit margin
  
  // Calculate Profit+ stats (example data - should be replaced with real data in production)
  const profitPlusStats = {
    transactions: 5,
    revenue: 450.00,
    commission: 22.50,
    products: [
      { name: "Airtime R10", count: 15, value: 150.00, commission: 7.50 },
      { name: "Electricity", count: 3, value: 300.00, commission: 15.00 }
    ]
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <ShiftHeader shift={shift} onClose={onClose} />
      
      <div className="p-6">
        {isMobile ? (
          <>
            <ShiftTabSelector 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              hasRefunds={refundBreakdown.items.length > 0}
              hasLowStock={lowStockProducts.length > 0}
            />
            
            {activeTab === 'sales' && (
              <SalesTab 
                totalSales={totalSales}
                grossProfit={grossProfit}
                shift={shift}
                expectedCashInDrawer={expectedCashInDrawer}
              />
            )}
            
            {activeTab === 'payment' && (
              <PaymentMethodsTab 
                paymentBreakdown={paymentBreakdown}
                totalSales={totalSales}
              />
            )}
            
            {activeTab === 'refunds' && refundBreakdown.items.length > 0 && (
              <RefundsTab refundBreakdown={refundBreakdown} />
            )}
            
            {activeTab === 'inventory' && lowStockProducts.length > 0 && (
              <InventoryTab lowStockProducts={lowStockProducts} />
            )}
            
            {activeTab === 'profitplus' && (
              <ProfitPlusTab profitPlusStats={profitPlusStats} />
            )}
          </>
        ) : (
          <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-6 bg-[#FAA225] text-[#0A2645]">
              <TabsTrigger value="sales" className="data-[state=active]:bg-white">Sales</TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-white">Payment Methods</TabsTrigger>
              {refundBreakdown.items.length > 0 && (
                <TabsTrigger value="refunds" className="data-[state=active]:bg-white">Refunds</TabsTrigger>
              )}
              {lowStockProducts.length > 0 && (
                <TabsTrigger value="inventory" className="data-[state=active]:bg-white">Low Stock</TabsTrigger>
              )}
              <TabsTrigger value="profitplus" className="data-[state=active]:bg-white">Profit+</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales">
              <SalesTab 
                totalSales={totalSales}
                grossProfit={grossProfit}
                shift={shift}
                expectedCashInDrawer={expectedCashInDrawer}
              />
            </TabsContent>
            
            <TabsContent value="payment">
              <PaymentMethodsTab 
                paymentBreakdown={paymentBreakdown}
                totalSales={totalSales}
              />
            </TabsContent>
            
            {refundBreakdown.items.length > 0 && (
              <TabsContent value="refunds">
                <RefundsTab refundBreakdown={refundBreakdown} />
              </TabsContent>
            )}
            
            {lowStockProducts.length > 0 && (
              <TabsContent value="inventory">
                <InventoryTab lowStockProducts={lowStockProducts} />
              </TabsContent>
            )}
            
            <TabsContent value="profitplus">
              <ProfitPlusTab profitPlusStats={profitPlusStats} />
            </TabsContent>
          </Tabs>
        )}
        
        <div className="flex justify-end mt-8">
          <Button onClick={onClose}>
            Back to End Shift
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShiftReport;
