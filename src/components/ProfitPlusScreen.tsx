
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProfitPlusScreenProps {
  onCancel: () => void;
}

const ProfitPlusScreen: React.FC<ProfitPlusScreenProps> = ({ onCancel }) => {
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
            icon="/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png"
            name="MTN"
          />
          <ServiceIcon 
            icon="/lovable-uploads/244aad63-e667-4a2e-a60c-e6e1a4338903.png"
            name="Vodacom"
          />
          <ServiceIcon 
            icon="/lovable-uploads/4531f963-ec96-471b-b1d6-1adba2dbf7cb.png"
            name="Cell C"
          />
          <ServiceIcon 
            icon="/lovable-uploads/886ad285-9db8-4d56-bcad-1cdc5ab763b5.png"
            name="Telkom"
          />
          <ServiceIcon 
            icon="/lovable-uploads/994da451-404b-44cf-a00d-5d8a3840a069.png"
            name="Eskom"
          />
          <ServiceIcon 
            icon="/lovable-uploads/b6cede87-26cc-4d43-b178-f4555df34f1e.png"
            name="City Power"
          />
          <ServiceIcon 
            icon="/lovable-uploads/fd658335-de63-4813-b0d9-355f4313e4a5.png"
            name="DStv"
          />
          <ServiceIcon 
            icon="/lovable-uploads/886ad285-9db8-4d56-bcad-1cdc5ab763b5.png"
            name="Metro"
          />
          <ServiceIcon 
            icon="/lovable-uploads/fd658335-de63-4813-b0d9-355f4313e4a5.png"
            name="GOtv"
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
      <div className="bg-gray-100 rounded-lg p-3 mb-2 w-16 h-16 flex items-center justify-center">
        <img 
          src={icon} 
          alt={name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <span className="text-sm text-center">{name}</span>
    </div>
  );
};

export default ProfitPlusScreen;
