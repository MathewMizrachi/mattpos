
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
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          <ServiceIcon 
            icon="/lovable-uploads/482f9ff2-ee3a-4c77-881e-8b8c935fbd71.png"
            name="MTN"
          />
          <ServiceIcon 
            icon="/lovable-uploads/35a6c037-2e57-41a8-bfbe-4c5ba108881f.png"
            name="Vodacom"
          />
          <ServiceIcon 
            icon="/lovable-uploads/abfadc69-5bd5-40f2-899f-23d0fda25da0.png"
            name="Cell C"
          />
          <ServiceIcon 
            icon="/lovable-uploads/2dfa0bef-2c41-4930-8aeb-16533944ebd7.png"
            name="Telkom"
          />
          <ServiceIcon 
            icon="/lovable-uploads/884156f9-9194-4015-82ec-621c3d5bc9b6.png"
            name="Electricity & Water"
          />
          <ServiceIcon 
            icon="/lovable-uploads/28553712-bce2-404f-adcd-bb4ecfe22e73.png"
            name="Airtime Any Amount"
          />
          <ServiceIcon 
            icon="/lovable-uploads/836240e7-5634-46d4-b4ff-2fb2ee766db6.png"
            name="DStv"
          />
          <ServiceIcon 
            icon="/lovable-uploads/b18e69fa-5c7f-4337-85f8-f2ebe3bae027.png"
            name="Easyload Airtime"
          />
          <ServiceIcon 
            icon="/lovable-uploads/af2ab5f3-7141-42a6-b154-4348b296ebd7.png"
            name="Easyload Voucher"
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
      <div className="rounded-lg overflow-hidden mb-2 w-16 h-16 flex items-center justify-center">
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
