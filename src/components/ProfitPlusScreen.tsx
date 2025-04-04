
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfitPlusScreenProps {
  onCancel: () => void;
}

const ProfitPlusScreen: React.FC<ProfitPlusScreenProps> = ({ onCancel }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with ProfitPlus logo */}
      <div className="bg-[#0A2645] py-6 flex justify-center items-center relative">
        <Button 
          variant="ghost" 
          className="text-white absolute left-4"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-12 object-contain" 
        />
      </div>
      
      {/* Services Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Airtime, Electricity & DStv</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-1.png"
            name="Airtime"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-2.png"
            name="Electricity"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-3.png"
            name="DStv"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-4.png"
            name="MTN"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-5.png"
            name="Vodacom"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-6.png"
            name="Cell C"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-7.png"
            name="Telkom"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-8.png"
            name="Easyload"
          />
          <ServiceIcon 
            icon="/lovable-uploads/uploaded-icon-9.png"
            name="Prepaid"
          />
        </div>
      </div>
      
      <div className="mt-auto py-4 text-center text-gray-500 opacity-70 text-sm">
        Powered by ProfitPlus
      </div>
    </div>
  );
};

interface ServiceIconProps {
  icon: string;
  name: string;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ icon, name }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg overflow-hidden mb-2 w-full aspect-square flex items-center justify-center">
        <img 
          src={icon} 
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-xs text-center">{name}</span>
    </div>
  );
};

export default ProfitPlusScreen;
