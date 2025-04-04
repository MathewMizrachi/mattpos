
import React from 'react';
import ActionButton from './ActionButton';

interface ProfitPlusButtonProps {
  onClick: () => void;
}

const ProfitPlusButton: React.FC<ProfitPlusButtonProps> = ({ onClick }) => {
  return (
    <ActionButton 
      label="Profit+"
      onClick={onClick}
      icon="/lovable-uploads/12e46de3-00e4-4fb9-9591-ba308ee8e365.png"
    />
  );
};

export default ProfitPlusButton;
