
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Shift } from '@/types';

interface ShiftHeaderProps {
  shift: Shift;
  onClose: () => void;
}

const ShiftHeader: React.FC<ShiftHeaderProps> = ({ shift, onClose }) => {
  const formattedDate = shift ? format(new Date(shift.startTime), 'yyyy-MM-dd') : '';
  const formattedStartTime = shift ? format(new Date(shift.startTime), 'HH:mm:ss') : '';
  const formattedEndTime = shift?.endTime ? format(new Date(shift.endTime), 'HH:mm:ss') : 'Active';

  return (
    <div className="p-4 bg-[#0A2645] text-white flex items-center">
      <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold">Shift Report</h1>
        <p className="text-sm">
          {formattedDate} ({formattedStartTime} - {formattedEndTime})
        </p>
      </div>
    </div>
  );
};

export default ShiftHeader;
