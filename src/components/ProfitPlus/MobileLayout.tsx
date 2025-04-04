
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServiceCategory from './ServiceCategory';
import { ServiceCategoryData } from './types';

interface MobileLayoutProps {
  serviceCategories: ServiceCategoryData[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ serviceCategories }) => {
  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="pb-16 px-2">
        {serviceCategories.map((category, index) => (
          <ServiceCategory
            key={index}
            title={category.title}
            items={category.items}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default MobileLayout;
