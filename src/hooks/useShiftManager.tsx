
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseShiftManagerProps {
  calculateExpectedCashInDrawer: (shiftId: number) => number;
  endShift: (cashAmount: number) => any;
  getShiftPaymentBreakdown: (shiftId: number) => any;
  getShiftRefundBreakdown: (shiftId: number) => any;
  getLowStockProducts: (limit: number) => any[];
  navigateToDashboard: () => void;
  processWithdrawal: (amount: number, reason: string) => boolean;
}

export const useShiftManager = ({
  calculateExpectedCashInDrawer,
  endShift,
  getShiftPaymentBreakdown,
  getShiftRefundBreakdown,
  getLowStockProducts,
  navigateToDashboard,
  processWithdrawal,
}: UseShiftManagerProps) => {
  const { toast } = useToast();
  
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showReconciliationReport, setShowReconciliationReport] = useState(false);
  const [showWithdrawalScreen, setShowWithdrawalScreen] = useState(false);
  const [completedShift, setCompletedShift] = useState<any>(null);
  const [endShiftCashAmount, setEndShiftCashAmount] = useState(0);
  
  const handleEndShiftRequest = () => {
    setShowEndShiftForm(true);
  };
  
  const handleSubmitEndShift = (cashAmount: number, currentShift: any) => {
    setEndShiftCashAmount(cashAmount);
    const endedShift = endShift(cashAmount);
    
    if (endedShift) {
      setCompletedShift(endedShift);
      setShowEndShiftForm(false);
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
  
  const handleProcessWithdrawal = (amount: number, reason: string) => {
    const success = processWithdrawal(amount, reason);
    if (success) {
      handleCloseWithdrawalScreen();
    }
    return success;
  };

  const handleEndOfDayReport = () => {
    // Navigate to reports page
    navigateToDashboard();
    
    // Optionally navigate to reports page with shift data
    // We could use react-router to navigate to reports with query params or state
    toast({
      title: "Navigating to shift reports",
      description: "Please wait while we prepare your shift report"
    });
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
    handleEndOfDayReport,
  };
};
