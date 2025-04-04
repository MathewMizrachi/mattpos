
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from './ProfitPlus/MobileLayout';
import DesktopLayout from './ProfitPlus/DesktopLayout';
import { serviceCategories } from './ProfitPlus/data';

interface ProfitPlusScreenProps {
  onCancel: () => void;
}

const ProfitPlusScreen: React.FC<ProfitPlusScreenProps> = ({ onCancel }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex items-center p-4 border-b border-gray-200">
        <Button 
          variant="ghost" 
          className="text-[#0A2645]"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <h1 className="text-xl font-bold text-[#0A2645] mx-auto pr-12">ProfitPlus Services</h1>
      </div>
      
      {isMobile 
        ? <MobileLayout serviceCategories={serviceCategories} />
        : <DesktopLayout serviceCategories={serviceCategories} />
      }
      
      <div className="mt-auto py-2 text-center text-[#0A2645] opacity-70 text-xs fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        Powered by ProfitPlus
      </div>
    </div>
  );
};

export default ProfitPlusScreen;
