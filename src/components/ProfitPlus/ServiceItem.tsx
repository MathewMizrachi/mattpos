
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ServiceItemProps {
  id: string;
  name: string;
  imageUrl: string;
  onClick?: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  name,
  imageUrl,
  onClick
}) => {
  const isMobile = useIsMobile();

  return (
    <div 
      className="flex flex-col items-center cursor-pointer p-2"
      onClick={onClick || (() => console.log(`Selected service: ${name}`))}
    >
      <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-lg overflow-hidden mb-1 bg-gray-100 flex items-center justify-center`}>
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-contain"
        />
      </div>
      {name && (
        <span className="text-xs text-center mt-1">{name}</span>
      )}
    </div>
  );
};

export default ServiceItem;
