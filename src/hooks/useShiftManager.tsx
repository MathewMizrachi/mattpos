
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Shift } from '@/types';

interface UseShiftManagerProps {
  calculateExpectedCashInDrawer: (shiftId: number) => number;
  endShift: (cashAmount: number) => any;
  getShiftPaymentBreakdown: (shiftId: number) => any;
  getShiftRefundBreakdown: (shiftId: number) => any;
  getLowStockProducts: (limit: number) => any[];
  navigateToDashboard: () => void;
}

export function useShiftManager({
  calculateExpectedCashInDrawer,
  endShift,
  getShiftPaymentBreakdown,
  getShiftRefundBreakdown,
  getLowStockProducts,
  navigateToDashboard,
}: UseShiftManagerProps) {
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showReconciliationReport, setShowReconciliationReport] = useState(false);
  const [completedShift, setCompletedShift] = useState<Shift | null>(null);
  const [endShiftCashAmount, setEndShiftCashAmount] = useState(0);
  
  const handleEndShiftRequest = (currentShift: any, cart: any[]) => {
    if (cart.length > 0) {
      return {
        success: false,
        message: "Cannot end shift. Please complete or clear the current transaction"
      };
    }
    
    if (!currentShift) return { success: false };
    
    const expectedCash = calculateExpectedCashInDrawer(currentShift.id);
    setEndShiftCashAmount(expectedCash);
    setShowEndShiftForm(true);
    return { success: true };
  };
  
  const handleSubmitEndShift = (cashAmount: number, currentShift: any) => {
    if (!currentShift) return;
    
    const shift = endShift(cashAmount);
    if (shift) {
      setCompletedShift(shift);
      setShowEndShiftForm(false);
      
      // Prepare report data
      setEndShiftCashAmount(cashAmount);
      setShowReconciliationReport(true);
    }
  };
  
  const handleCloseReconciliation = () => {
    setShowReconciliationReport(false);
    navigateToDashboard();
  };
  
  return {
    showEndShiftForm,
    showReconciliationReport,
    completedShift,
    endShiftCashAmount,
    setShowEndShiftForm,
    handleEndShiftRequest,
    handleSubmitEndShift,
    handleCloseReconciliation,
  };
}
