
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ActionButton from './ActionButton';
import ProfitPlusButton from './ProfitPlusButton';

interface ActionStripProps {
  onRefund: () => void;
  onWithdrawal: () => void;
  onProfitPlus: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ 
  onRefund, 
  onWithdrawal,
  onProfitPlus
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
      
      <ProfitPlusButton
        onClick={onProfitPlus}
      />
    </div>
  );
};

export default ActionStrip;
