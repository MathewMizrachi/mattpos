
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  onClick,
  icon
}) => {
  const isMobile = useIsMobile();
  
  return (
    <button 
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center p-2 h-full border-r border-white/20 hover:bg-white/10 transition-all"
    >
      {icon ? (
        <div className="flex flex-col items-center">
          <img src={icon} alt={label} className="w-6 h-6 mb-1" />
          <span className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>{label}</span>
        </div>
      ) : (
        <span className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>{label}</span>
      )}
    </button>
  );
};

export default ActionButton;
