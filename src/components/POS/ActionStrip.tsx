
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
  onWithdrawal: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ 
  onRefund, 
  onProfitPlus, 
  onWithdrawal
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`fixed ${isMobile ? 'bottom-[4.5rem] left-0 right-0' : 'bottom-0 left-0 right-[24rem]'} z-10 flex flex-wrap items-center`}
      style={{ 
        backgroundColor: '#0A2645',
        height: isMobile ? '3.5rem' : '4.5rem' // Match PaymentFooter height on widescreen
      }}
    >
      <Button 
        className="bg-[#0A2645] hover:bg-[#1c3a5d] text-white h-full rounded-none text-sm md:text-base flex items-center justify-center font-bold flex-1"
        onClick={onRefund}
      >
        refunds
      </Button>
      
      <Button 
        className="bg-[#0A2645] hover:bg-[#1c3a5d] text-white h-full rounded-none text-sm md:text-base flex items-center justify-center font-bold flex-1"
        onClick={onWithdrawal}
      >
        withdrawal
      </Button>
      
      <Button 
        className="bg-[#0A2645] hover:bg-[#1c3a5d] h-full rounded-none flex items-center justify-center flex-1"
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-13 w-13 md:h-18 md:w-18 object-contain" 
          style={{ transform: 'scale(2.5)' }} 
        />
      </Button>
    </div>
  );
};

export default ActionStrip;
