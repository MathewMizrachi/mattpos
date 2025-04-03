
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ArrowDownLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
  onWithdrawal?: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ onRefund, onProfitPlus, onWithdrawal }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className="fixed bottom-[3.5rem] left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6"
      style={{ 
        backgroundColor: '#0A2645',
        height: isMobile ? '3rem' : '3.5rem'
      }}
    >
      <div className="flex items-center space-x-4">
        <Button 
          className="bg-transparent hover:bg-transparent text-white text-xs md:text-sm p-0"
          onClick={onRefund}
        >
          <RefreshCcw className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
          Customer Refund
        </Button>
        
        <Button 
          className="bg-transparent hover:bg-transparent text-white text-xs md:text-sm p-0"
          onClick={onWithdrawal || (() => {})}
        >
          <ArrowDownLeft className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
          Withdrawal
        </Button>
      </div>
      
      <Button 
        className="bg-[#0A2645] hover:bg-[#17365c] p-0 h-full flex items-center justify-center"
        style={{ width: isMobile ? '3rem' : '3.5rem' }}
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-full w-full object-contain p-1"
        />
      </Button>
    </div>
  );
};

export default ActionStrip;
