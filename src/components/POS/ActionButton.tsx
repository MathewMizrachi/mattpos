
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  className = ''
}) => {
  return (
    <Button 
      className={`bg-[#0A2645] hover:bg-[#0A2645]/90 text-[#FAA225] h-full rounded-none text-sm md:text-base flex items-center justify-center font-bold uppercase ${className}`}
      style={{ width: '25%' }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
