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
  processWithdrawal?: (amount: number, reason: string) => boolean;
}

export function useShiftManager({
  calculateExpectedCashInDrawer,
  endShift,
  getShiftPaymentBreakdown,
  getShiftRefundBreakdown,
  getLowStockProducts,
  navigateToDashboard,
  processWithdrawal,
}: UseShiftManagerProps) {
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showReconciliationReport, setShowReconciliationReport] = useState(false);
  const [showWithdrawalScreen, setShowWithdrawalScreen] = useState(false);
  const [completedShift, setCompletedShift] = useState<Shift | null>(null);
  const [endShiftCashAmount, setEndShiftCashAmount] = useState(0);
  const { toast } = useToast();
  
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
  
  const handleShowWithdrawalScreen = () => {
    setShowWithdrawalScreen(true);
  };
  
  const handleCloseWithdrawalScreen = () => {
    setShowWithdrawalScreen(false);
  };
  
  const handleProcessWithdrawal = (amount: number, reason: string): boolean => {
    if (processWithdrawal) {
      const success = processWithdrawal(amount, reason);
      
      if (success) {
        toast({
          title: "Withdrawal completed",
          description: `Successfully withdrawn from register`,
        });
        setShowWithdrawalScreen(false);
      } else {
        toast({
          title: "Withdrawal failed",
          description: "There was an error processing the withdrawal",
          variant: "destructive"
        });
      }
      
      return success;
    }
    return false;
  };
  
  return {
    showEndShiftForm,
    showReconciliationReport,
    showWithdrawalScreen,
    completedShift,
    endShiftCashAmount,
    setShowEndShiftForm,
    handleEndShiftRequest,
    handleSubmitEndShift,
    handleCloseReconciliation,
    handleShowWithdrawalScreen,
    handleCloseWithdrawalScreen,
    handleProcessWithdrawal,
  };
}
