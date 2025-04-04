
import React from 'react';
import ServiceItem from './ServiceItem';
import type { ServiceItem as ServiceItemType } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServiceCategoryProps {
  name: string;
  items: ServiceItemType[];
}

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ name, items }) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-700 mb-3 px-4">{name}</h2>
      <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'} gap-2`}>
        {items.map((item) => (
          <ServiceItem
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            onClick={item.action}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceCategory;
