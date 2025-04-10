
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Shift } from '@/types';

interface SalesTabProps {
  totalSales: number;
  grossProfit: number;
  shift: Shift;
  expectedCashInDrawer: number;
}

const SalesTab: React.FC<SalesTabProps> = ({
  totalSales,
  grossProfit,
  shift,
  expectedCashInDrawer
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-4">Shift Summary</h3>
        
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Revenue</span>
          <span>{formatCurrency(totalSales)}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Gross Profit</span>
          <span>{formatCurrency(grossProfit)}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Transactions</span>
          <span>{shift.transactionCount || 0}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="font-medium">Starting Float</span>
          <span>{formatCurrency(shift.startFloat)}</span>
        </div>
        
        <div className="flex justify-between py-2">
          <span className="font-medium">Expected Cash in Drawer</span>
          <span>{formatCurrency(expectedCashInDrawer)}</span>
        </div>
      </div>
    </div>
  );
};

export default SalesTab;
