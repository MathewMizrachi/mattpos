
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
  onWithdrawal?: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ 
  onRefund, 
  onProfitPlus, 
  onWithdrawal = () => {}
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`fixed ${isMobile ? 'bottom-[4.5rem] left-0 right-0' : 'bottom-0 left-0 right-[24rem]'} z-10 flex flex-wrap items-center`}
      style={{ 
        backgroundColor: '#dddddd',
        height: '4.5rem' // Match height with PaymentFooter
      }}
    >
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] text-[#0A2645] h-full rounded-none text-lg md:text-xl flex items-center justify-center font-bold flex-1"
        onClick={onRefund}
      >
        REFUNDS
      </Button>
      
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] text-[#0A2645] h-full rounded-none text-lg md:text-xl flex items-center justify-center font-bold flex-1"
        onClick={onWithdrawal}
      >
        WITHDRAWAL
      </Button>
      
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] h-full rounded-none flex items-center justify-center flex-1"
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-12 w-12 md:h-16 md:w-16 object-contain" 
        />
      </Button>
    </div>
  );
};

export default ActionStrip;
