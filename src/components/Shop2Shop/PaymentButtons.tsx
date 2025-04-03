
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentButtonsProps {
  onCancel: () => void;
  onComplete: () => void;
}

export const PaymentButtons: React.FC<PaymentButtonsProps> = ({ onCancel, onComplete }) => {
  return (
    <div className="flex justify-center space-x-4">
      <Button
        variant="outline"
        onClick={onCancel}
        className="bg-transparent text-white border-white hover:bg-white/10"
      >
        Cancel
      </Button>
      <Button 
        onClick={onComplete} 
        className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
      >
        Complete
      </Button>
    </div>
  );
};
