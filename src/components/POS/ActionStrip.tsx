
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ActionButton from './ActionButton';

interface ActionStripProps {
  onRefund: () => void;
  onWithdrawal: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ 
  onRefund, 
  onWithdrawal
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`fixed ${isMobile ? 'bottom-[4.5rem] left-0 right-0' : 'bottom-0 left-0 right-[24rem]'} z-10 flex flex-wrap items-center`}
      style={{ 
        backgroundColor: '#0A2645',
        height: isMobile ? '3.5rem' : '4.5rem'
      }}
    >
      <ActionButton 
        label="refunds"
        onClick={onRefund}
      />
      
      <ActionButton 
        label="withdrawal"
        onClick={onWithdrawal}
      />
    </div>
  );
};

export default ActionStrip;
