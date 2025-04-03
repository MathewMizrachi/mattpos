
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
      className="fixed bottom-32 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6"
      style={{ 
        backgroundColor: '#0A2645',
        height: isMobile ? '3rem' : '3.5rem'  // Increased height
      }}
    >
      <ActionButton 
        onClick={onRefund}
        icon={<RefreshCcw className="h-4 w-4 md:h-5 md:w-5" />}
        label="Refunds"
      />
      
      <ActionButton 
        onClick={onProfitPlus}
        icon={
          <img 
            src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
            alt="ProfitPlus" 
            className="h-full w-full object-contain"
          />
        }
        variant="icon"
      />
    </div>
  );
};

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  variant?: 'default' | 'icon';
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  icon, 
  label, 
  variant = 'default' 
}) => {
  const isMobile = useIsMobile();
  
  if (variant === 'icon') {
    return (
      <Button 
        className="bg-[#0A2645] hover:bg-[#17365c] p-1.5 md:p-2 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center"
        onClick={onClick}
      >
        {icon}
      </Button>
    );
  }
  
  return (
    <Button 
      className="bg-[#0A2645] hover:bg-[#17365c] text-white border border-gray-700 text-xs md:text-sm"
      onClick={onClick}
    >
      {icon && <span className="mr-1.5 md:mr-2">{icon}</span>}
      {isMobile && label ? label.substring(0, 6) : label}
    </Button>
  );
};

export default ActionStrip;
