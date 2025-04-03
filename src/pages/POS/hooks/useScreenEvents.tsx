
import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseScreenEventsProps {
  cart: any[];
  handleEndShift: () => void;
}

export const useScreenEvents = ({ cart, handleEndShift }: UseScreenEventsProps) => {
  const { toast } = useToast();
  
  // Mount event listener for end shift
  React.useEffect(() => {
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
      const onEndShift = () => handleEndShift();
      screenManager.addEventListener('endshift', onEndShift);
      return () => screenManager.removeEventListener('endshift', onEndShift);
    }
  }, [cart, handleEndShift]);
  
  return {};
};
