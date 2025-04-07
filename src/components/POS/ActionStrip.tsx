
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ActionButton from './ActionButton';
import ProfitPlusButton from './ProfitPlusButton';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
  onWithdrawal: () => void;
  onBottleDeposit?: () => void; // New prop for bottle deposit
  onCoinExchange?: () => void; // New prop for coin exchange
}

const ActionStrip: React.FC<ActionStripProps> = ({ 
  onRefund, 
  onProfitPlus, 
  onWithdrawal,
  onBottleDeposit = () => {}, // Default empty function
  onCoinExchange = () => {}   // Default empty function
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
        className="basis-1/4"
      />
      
      <ActionButton 
        label="withdrawal"
        onClick={onWithdrawal}
        className="basis-1/4"
      />
      
      <ActionButton 
        label="bottle deposit"
        onClick={onBottleDeposit}
        className="basis-1/4"
      />
      
      <ActionButton 
        label="coin exchange"
        onClick={onCoinExchange}
        className="basis-1/4"
      />
      
      <ProfitPlusButton onClick={onProfitPlus} />
    </div>
  );
};

export default ActionStrip;
