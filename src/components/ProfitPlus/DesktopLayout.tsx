
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServiceCategory from './ServiceCategory';
import { ServiceCategoryData } from './types';

interface DesktopLayoutProps {
  serviceCategories: ServiceCategoryData[];
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ serviceCategories }) => {
  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="container mx-auto py-4 pb-16">
        <div className="grid grid-cols-3 gap-8">
          {serviceCategories.slice(0, 3).map((category, index) => (
            <ServiceCategory
              key={index}
              title={category.title}
              items={category.items}
              itemsLimit={9}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8">
          {serviceCategories.slice(3, 6).map((category, index) => (
            <ServiceCategory
              key={index}
              title={category.title}
              items={category.items}
              itemsLimit={9}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          {serviceCategories.slice(6, 8).map((category, index) => (
            <ServiceCategory
              key={index}
              title={category.title}
              items={category.items}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default DesktopLayout;
