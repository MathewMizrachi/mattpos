
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowDown, Banknote } from 'lucide-react';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
  onWithdrawal?: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ onRefund, onProfitPlus, onWithdrawal = () => {} }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`fixed ${isMobile ? 'bottom-[4.5rem] left-0 right-0' : 'bottom-0 left-0 right-[24rem]'} z-10 flex items-center`}
      style={{ 
        backgroundColor: '#0A2645',
        height: isMobile ? '3.5rem' : '4.5rem'
      }}
    >
      <Button 
        className="bg-[#0A2645] hover:bg-[#0A2645]/80 text-[#FAA225] h-full w-1/3 rounded-none text-lg md:text-2xl flex items-center justify-center font-bold gap-2"
        onClick={onRefund}
      >
        <ArrowDown className="h-5 w-5 md:h-6 md:w-6" />
        <span>Refunds</span>
      </Button>
      
      <Button 
        className="bg-[#0A2645] hover:bg-[#0A2645]/80 text-[#FAA225] h-full w-1/3 rounded-none text-lg md:text-2xl flex items-center justify-center font-bold gap-2"
        onClick={onWithdrawal}
      >
        <Banknote className="h-5 w-5 md:h-6 md:w-6" />
        <span>Withdrawal</span>
      </Button>
      
      <Button 
        className="bg-[#0A2645] hover:bg-[#0A2645]/80 h-full w-1/3 rounded-none flex items-center justify-center"
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-30 w-30 md:h-36 md:w-36 object-contain"
          style={{ transform: 'scale(1.125)' }} 
        />
      </Button>
    </div>
  );
};

export default ActionStrip;
