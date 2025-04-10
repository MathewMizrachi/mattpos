
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseShiftManagerProps {
  endShift: (cashAmount: number) => any;
  calculateExpectedCashInDrawer: (shiftId: number) => number;
  getShiftPaymentBreakdown: (shiftId: number) => any;
  getShiftRefundBreakdown: (shiftId: number) => any;
  getLowStockProducts: (limit: number) => any[];
  navigateToDashboard: () => void;
  processWithdrawal: (amount: number, reason: string) => boolean;
}

export const useShiftManager = ({
  endShift,
  calculateExpectedCashInDrawer,
  getShiftPaymentBreakdown,
  getShiftRefundBreakdown,
  getLowStockProducts,
  navigateToDashboard,
  processWithdrawal
}: UseShiftManagerProps) => {
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showShiftReport, setShowShiftReport] = useState(false);
  const [showWithdrawalScreen, setShowWithdrawalScreen] = useState(false);
  const [completedShift, setCompletedShift] = useState<any>(null);
  const [endShiftCashAmount, setEndShiftCashAmount] = useState(0);
  
  const { toast } = useToast();

  const handleEndShiftRequest = () => {
    setShowEndShiftForm(true);
  };
  
  const handleSubmitEndShift = (cashAmount: number, shift: any) => {
    setEndShiftCashAmount(cashAmount);
    
    const result = endShift(cashAmount);
    if (result) {
      setCompletedShift(result);
      setShowEndShiftForm(false);
      setShowShiftReport(true);
      
      toast({
        title: "Shift ended",
        description: "Your shift has been ended successfully.",
      });
    } else {
      toast({
        title: "Error ending shift",
        description: "There was a problem ending your shift.",
        variant: "destructive"
      });
    }
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
      setShowWithdrawalScreen(false);
      return true;
    }
    return false;
  };
  
  const handleCloseShiftReport = () => {
    setShowShiftReport(false);
    navigateToDashboard();
  };

  return {
    showEndShiftForm,
    showShiftReport,
    showWithdrawalScreen,
    completedShift,
    endShiftCashAmount,
    setShowEndShiftForm,
    handleEndShiftRequest,
    handleSubmitEndShift,
    handleShowWithdrawalScreen,
    handleCloseWithdrawalScreen,
    handleProcessWithdrawal,
    handleCloseShiftReport,
  };
};
