
import React from 'react';
import ServiceItem, { ServiceItemProps } from './ServiceItem';

export interface ServiceCategoryProps {
  title: string;
  items: ServiceItemProps[];
  itemsLimit?: number;
}

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ 
  title, 
  items, 
  itemsLimit 
}) => {
  const displayItems = itemsLimit ? items.slice(0, itemsLimit) : items;
  
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-center text-sm sm:text-base text-gray-600 font-medium mb-3 sm:mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {displayItems.map((item, index) => (
          <ServiceItem 
            key={index}
            name={item.name}
            logo={item.logo}
            bgColor={item.bgColor}
            subItems={item.subItems}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceCategory;
