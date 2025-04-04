
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
}

const ServiceItem: React.FC<ServiceItemProps> = ({ name, logo, bgColor, subItems }) => {
  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col items-center justify-center p-4 h-24">
        <div className="text-white font-bold text-center">
          {logo}
        </div>
      </div>
      
      {subItems && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-500 p-2 flex items-center justify-center">
          {subItems.map((subItem, idx) => (
            <div key={idx} className="text-xs text-white flex items-center">
              <span className="mr-1">{subItem.icon === 'whatsapp' ? '📱' : '💾'}</span>
              <span>{subItem.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceItem;
