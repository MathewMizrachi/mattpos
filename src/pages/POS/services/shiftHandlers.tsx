
import { useToast } from "@/hooks/use-toast";

interface ShiftHandlersProps {
  currentShift: any;
  endShift: (cashAmount: number) => any;
  endShiftCashAmount: number;
  setCompletedShift: (shift: any) => void;
  setShowEndShiftForm: (show: boolean) => void;
  setShowReconciliationReport: (show: boolean) => void;
  setEndShiftCashAmount: (amount: number) => void;
  navigateToDashboard: () => void;
}

export const useShiftHandlers = ({
  currentShift,
  endShift,
  endShiftCashAmount,
  setCompletedShift,
  setShowEndShiftForm,
  setShowReconciliationReport,
  setEndShiftCashAmount,
  navigateToDashboard
}: ShiftHandlersProps) => {
  const { toast } = useToast();
  
  const handleSubmitEndShift = (cashAmount: number) => {
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
    handleSubmitEndShift,
    handleCloseReconciliation
  };
};
