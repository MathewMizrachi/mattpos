
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ onRefund, onProfitPlus }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`fixed ${isMobile ? 'bottom-[4.5rem] left-0 right-0' : 'bottom-0 left-0 right-[24rem]'} z-10 flex items-center`}
      style={{ 
        backgroundColor: '#0A2645',
        height: isMobile ? '3.5rem' : '5rem'
      }}
    >
      <Button 
        className="bg-[#0A2645] hover:bg-[#17365c] text-white h-full w-full rounded-none text-xs md:text-sm flex items-center justify-center"
        onClick={onRefund}
      >
        <RefreshCcw className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
        Refunds
      </Button>
      
      <Button 
        className="bg-[#0A2645] hover:bg-[#17365c] h-full rounded-none flex items-center justify-center"
        style={{ width: isMobile ? '40%' : '180px' }}
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-10 w-10 md:h-12 md:w-12 object-contain"
        />
      </Button>
    </div>
  );
};

export default ActionStrip;
