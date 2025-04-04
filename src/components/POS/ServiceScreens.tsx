
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';
import RefundScreen from '@/components/RefundScreen';
import WithdrawalScreen from '@/components/WithdrawalScreen';
import EndShiftForm from '@/components/EndShiftForm';
import ReconciliationReport from '@/components/ReconciliationReport';
import ShiftReport from '@/components/ShiftReport';

interface ServiceScreensProps {
  showRefundScreen: boolean;
  showWithdrawalScreen: boolean;
  showEndShiftForm: boolean;
  showReconciliationReport: boolean;
  showShiftReport?: boolean;
  currentShift: any;
  completedShift: any;
  endShiftCashAmount: number;
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  processWithdrawal: (amount: number, reason: string) => boolean;
  onCloseRefundScreen: () => void;
  onCloseWithdrawalScreen: () => void;
  setShowEndShiftForm: (show: boolean) => void;
  handleSubmitEndShift: (cashAmount: number, currentShift: any) => void;
  handleCloseReconciliation: () => void;
  handleEndOfDayReport?: () => void;
  handleCloseShiftReport?: () => void;
  getShiftPaymentBreakdown: (shiftId: number) => any;
  getShiftRefundBreakdown: (shiftId: number) => any;
  getLowStockProducts: (limit: number) => any[];
  calculateExpectedCashInDrawer: (shiftId: number) => number;
}

const ServiceScreens: React.FC<ServiceScreensProps> = ({
  showRefundScreen,
  showWithdrawalScreen,
  showEndShiftForm,
  showReconciliationReport,
  showShiftReport,
  currentShift,
  completedShift,
  endShiftCashAmount,
  processRefund,
  processWithdrawal,
  onCloseRefundScreen,
  onCloseWithdrawalScreen,
  setShowEndShiftForm,
  handleSubmitEndShift,
  handleCloseReconciliation,
  handleEndOfDayReport,
  handleCloseShiftReport,
  getShiftPaymentBreakdown,
  getShiftRefundBreakdown,
  getLowStockProducts,
  calculateExpectedCashInDrawer
}) => {
  const { toast } = useToast();

  const handleProcessRefund = (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => {
    const success = processRefund(product, quantity, refundMethod);
    
    if (success) {
      toast({
        title: "Refund processed successfully",
        description: `${formatCurrency(product.price * quantity)} refunded via ${refundMethod === 'cash' ? 'cash' : 'Shop2Shop'}`,
      });
      onCloseRefundScreen();
    } else {
      toast({
        title: "Refund failed",
        description: "There was an error processing the refund",
        variant: "destructive"
      });
    }
  };

  if (showRefundScreen) {
    return (
      <RefundScreen
        onProcessRefund={handleProcessRefund}
        onCancel={onCloseRefundScreen}
      />
    );
  }

  if (showWithdrawalScreen) {
    return (
      <WithdrawalScreen
        onWithdraw={processWithdrawal}
        onCancel={onCloseWithdrawalScreen}
      />
    );
  }

  if (showShiftReport && currentShift) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <ShiftReport
          shift={currentShift}
          paymentBreakdown={getShiftPaymentBreakdown(currentShift.id)}
          refundBreakdown={getShiftRefundBreakdown(currentShift.id)}
          lowStockProducts={getLowStockProducts(5)}
          expectedCashInDrawer={calculateExpectedCashInDrawer(currentShift.id)}
          onClose={handleCloseShiftReport || (() => setShowEndShiftForm(true))}
        />
      </div>
    );
  }

  if (showEndShiftForm && currentShift) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <EndShiftForm
          onSubmit={(amount) => handleSubmitEndShift(amount, currentShift)}
          onCancel={() => setShowEndShiftForm(false)}
          onEndShiftReport={handleEndOfDayReport}
          expectedAmount={calculateExpectedCashInDrawer(currentShift.id)}
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
          grossProfit={completedShift.salesTotal ? completedShift.salesTotal * 0.25 : 0}
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

export default ServiceScreens;
