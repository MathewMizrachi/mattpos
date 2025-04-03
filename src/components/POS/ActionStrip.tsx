
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
      {/* First quarter - Refunds */}
      <Button 
        className="bg-[#0A2645] hover:bg-[#1c3a5d] text-white h-full rounded-none text-sm md:text-base flex items-center justify-center font-bold"
        style={{ width: '25%' }}
        onClick={onRefund}
      >
        refunds
      </Button>
      
      {/* Second quarter - Withdrawal */}
      <Button 
        className="bg-[#0A2645] hover:bg-[#1c3a5d] text-white h-full rounded-none text-sm md:text-base flex items-center justify-center font-bold"
        style={{ width: '25%' }}
        onClick={onWithdrawal}
      >
        withdrawal
      </Button>
      
      {/* Second half - ProfitPlus */}
      <Button 
        className="bg-[#0A2645] hover:bg-[#1c3a5d] h-full rounded-none flex items-center justify-center"
        style={{ width: '50%' }}
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-12 w-12 md:h-16 md:w-16 object-contain" 
          style={{ transform: 'scale(2.1)' }} 
        />
      </Button>
    </div>
  );
};

export default ActionStrip;

