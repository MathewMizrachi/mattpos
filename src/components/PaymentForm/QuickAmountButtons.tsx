
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface QuickAmountButtonsProps {
  total: number;
  onSelectAmount: (amount: string) => void;
}

const QuickAmountButtons: React.FC<QuickAmountButtonsProps> = ({ total, onSelectAmount }) => {
  const generateQuickAmounts = () => {
    const amounts = [50, 100, 200, 500];
    return amounts.filter(amount => amount >= total);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {generateQuickAmounts().map((amount) => (
        <Button
          key={amount}
          type="button"
          variant="outline"
          className="text-white border-white hover:bg-white/20"
          onClick={() => onSelectAmount(amount.toString())}
        >
          {formatCurrency(amount)}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        className="col-span-2 text-white border-white hover:bg-white/20"
        onClick={() => onSelectAmount(total.toString())}
      >
        Exact Amount ({formatCurrency(total)})
      </Button>
    </div>
  );
};

export default QuickAmountButtons;
