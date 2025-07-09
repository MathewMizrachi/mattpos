
import React from 'react';

interface QuickInfoProps {
  mode: 'till' | 'restaurant';
}

const QuickInfo: React.FC<QuickInfoProps> = ({ mode }) => {
  // Component no longer renders anything since both sections are removed
  return null;
};

export default QuickInfo;
