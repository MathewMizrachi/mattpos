
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft } from 'lucide-react';
import { serviceCategories } from './data';
import ServiceCategory from './ServiceCategory';
import type { ProfitPlusScreenProps } from './types';

const ProfitPlusScreen: React.FC<ProfitPlusScreenProps> = ({ onClose }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header 
        className="flex items-center justify-between px-4 py-3 bg-[#0A2645] text-white"
        style={{ height: isMobile ? '60px' : '70px' }}
      >
        <button 
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10"
          onClick={onClose}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/12e46de3-00e4-4fb9-9591-ba308ee8e365.png" 
            alt="Profit+" 
            className="h-10"
          />
        </div>
        <div className="w-10"></div> {/* Empty div for balance */}
      </header>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{ paddingBottom: isMobile ? '110px' : '100px' }}
      >
        {serviceCategories.map(category => (
          <ServiceCategory 
            key={category.id}
            name={category.name}
            items={category.items}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfitPlusScreen;
