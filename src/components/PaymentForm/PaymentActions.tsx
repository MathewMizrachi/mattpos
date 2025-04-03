
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PaymentActionsProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({ onCancel, isSubmitDisabled }) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        className="text-white border-white hover:bg-white/20" 
        onClick={onCancel}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
        disabled={isSubmitDisabled}
      >
        Complete Sale
      </Button>
    </div>
  );
};

export default PaymentActions;
