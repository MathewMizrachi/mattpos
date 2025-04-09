
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface EndShiftFormProps {
  onSubmit: (cashAmount: number) => void;
  onCancel: () => void;
  onEndShiftReport?: () => void;
  expectedAmount: number;
}

const EndShiftForm: React.FC<EndShiftFormProps> = ({
  onSubmit,
  onCancel,
  onEndShiftReport,
  expectedAmount
}) => {
  const [cashAmount, setCashAmount] = useState(expectedAmount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit(cashAmount);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-[#0A2645] text-white flex items-center">
        <Button variant="ghost" size="icon" onClick={onCancel} className="mr-2">
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <h2 className="text-xl font-bold">End Shift</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Expected Cash in Drawer:</span>
            <span className="font-bold">{formatCurrency(expectedAmount)}</span>
          </div>
          
          <label className="block text-gray-700 font-medium mb-1">
            Actual Cash in Drawer
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={cashAmount}
            onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
            className="w-full"
            required
          />
          
          {cashAmount !== expectedAmount && (
            <div className={`text-sm mt-1 ${cashAmount < expectedAmount ? 'text-red-600' : 'text-amber-600'}`}>
              {cashAmount < expectedAmount
                ? `Shortage of ${formatCurrency(expectedAmount - cashAmount)}`
                : `Excess of ${formatCurrency(cashAmount - expectedAmount)}`}
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="bg-[#0A2645] hover:bg-[#0A2645]/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit & End Shift'}
          </Button>
          
          {onEndShiftReport && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onEndShiftReport}
            >
              View Shift Report
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EndShiftForm;
