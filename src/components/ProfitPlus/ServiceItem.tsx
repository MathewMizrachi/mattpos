
import React from 'react';

export interface ServiceSubItem {
  name: string;
  icon: string;
}

export interface ServiceItemProps {
  name: string;
  logo: string;
  bgColor: string;
  subItems?: ServiceSubItem[];
  imageUrl?: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ name, logo, bgColor, imageUrl }) => {
  return (
    <div 
      className="relative aspect-square rounded-lg overflow-hidden shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-white font-bold text-center text-xl">
            {logo}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItem;
