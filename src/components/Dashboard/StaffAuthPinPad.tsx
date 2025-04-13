import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import PinPad from '@/components/PinPad';
import { Button } from '@/components/ui/button';

interface StaffAuthPinPadProps {
  onCancel: () => void;
  onPinSubmit: (staffId: number) => void;
}

const StaffAuthPinPad: React.FC<StaffAuthPinPadProps> = ({ onCancel, onPinSubmit }) => {
  const { toast } = useToast();
  
  const handlePinSubmit = (pin: string) => {
    if (pin === '55') {
      onPinSubmit(1); // Manager ID
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid staff PIN",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 bg-[#0A2645] text-white rounded-lg shadow-lg">
      <PinPad 
        onSubmit={handlePinSubmit}
        title="Staff Authentication"
        subtitle="Enter staff PIN to start shift"
        titleClassName="text-white"
        subtitleClassName="text-white/70"
      />
      
      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default StaffAuthPinPad;
