
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ onRefund, onProfitPlus }) => {
  return (
    <div 
      className="fixed bottom-20 left-0 right-0 h-16 z-10 flex items-center justify-between px-6"
      style={{ backgroundColor: '#0A2645' }}
    >
      <Button 
        className="bg-[#0A2645] hover:bg-[#17365c] text-white border border-gray-700"
        onClick={onRefund}
      >
        <RefreshCcw className="mr-2 h-4 w-4" /> Refunds
      </Button>
      
      <Button 
        className="bg-[#0A2645] hover:bg-[#17365c] p-2 h-12 w-12 flex items-center justify-center"
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png" 
          alt="ProfitPlus" 
          className="h-full w-full object-contain"
        />
      </Button>
    </div>
  );
};

export default ActionStrip;
