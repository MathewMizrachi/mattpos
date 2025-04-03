
import React from 'react';
import EndShiftForm from '@/components/EndShiftForm';
import ReconciliationReport from '@/components/ReconciliationReport';

interface EndShiftScreensProps {
  showEndShiftForm: boolean;
  showReconciliationReport: boolean;
  completedShift: any;
  endShiftCashAmount: number;
  handleSubmitEndShift: (cashAmount: number) => void;
  setShowEndShiftForm: (show: boolean) => void;
  getShiftPaymentBreakdown: (shiftId: number) => any;
  getShiftRefundBreakdown: (shiftId: number) => any;
  getLowStockProducts: (limit: number) => any[];
  calculateExpectedCashInDrawer: (shiftId: number) => number;
  handleCloseReconciliation: () => void;
}

export const EndShiftScreens: React.FC<EndShiftScreensProps> = ({
  showEndShiftForm,
  showReconciliationReport,
  completedShift,
  endShiftCashAmount,
  handleSubmitEndShift,
  setShowEndShiftForm,
  getShiftPaymentBreakdown,
  getShiftRefundBreakdown,
  getLowStockProducts,
  calculateExpectedCashInDrawer,
  handleCloseReconciliation
}) => {
  if (showEndShiftForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <EndShiftForm
          onSubmit={handleSubmitEndShift}
          onCancel={() => setShowEndShiftForm(false)}
          expectedAmount={endShiftCashAmount}
        />
      </div>
    );
  }
  
  if (showReconciliationReport && completedShift) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <ReconciliationReport 
          shift={completedShift}
          totalSales={completedShift.salesTotal || 0}
          grossProfit={completedShift.salesTotal ? completedShift.salesTotal * 0.25 : 0} // Assuming 25% profit margin
          paymentBreakdown={getShiftPaymentBreakdown(completedShift.id)}
          lowStockProducts={getLowStockProducts(5)}
          refundBreakdown={getShiftRefundBreakdown(completedShift.id)}
          cashExpected={calculateExpectedCashInDrawer(completedShift.id)}
          cashActual={endShiftCashAmount}
          onClose={handleCloseReconciliation}
        />
      </div>
    );
  }
  
  return null;
};
