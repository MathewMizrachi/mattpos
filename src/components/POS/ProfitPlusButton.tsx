
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfitPlusButtonProps {
  onClick: () => void;
  imageScale?: number;
}

const ProfitPlusButton: React.FC<ProfitPlusButtonProps> = ({
  onClick,
  imageScale = 2.1
}) => {
  return (
    <Button 
      className="bg-[#0A2645] hover:bg-[#1c3a5d] h-full rounded-none flex items-center justify-center"
      style={{ width: '50%' }}
      onClick={onClick}
    >
      <img 
        src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
        alt="ProfitPlus" 
        className="h-12 w-12 md:h-16 md:w-16 object-contain" 
        style={{ transform: `scale(${imageScale})` }} 
      />
    </Button>
  );
};

export default ProfitPlusButton;
