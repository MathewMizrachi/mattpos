
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProfitPlusScreenProps {
  onCancel: () => void;
}

const ProfitPlusScreen: React.FC<ProfitPlusScreenProps> = ({ onCancel }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A2645] p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="text-white"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold text-white mx-auto pr-12">ProfitPlus Services</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <ServiceCard 
          title="Airtime" 
          description="Purchase airtime for all major networks"
          iconSrc="/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png"
          comingSoon={false}
        />
        
        <ServiceCard 
          title="Electricity" 
          description="Buy electricity tokens for prepaid meters"
          iconSrc="/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png"
          comingSoon={false}
        />
        
        <ServiceCard 
          title="Gaming" 
          description="Purchase gaming vouchers and lottery tickets"
          iconSrc="/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png"
          comingSoon={true}
        />
        
        <ServiceCard 
          title="Vouchers" 
          description="Buy digital vouchers for various services"
          iconSrc="/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png"
          comingSoon={true}
        />
      </div>
      
      <div className="mt-auto py-4 text-center text-white opacity-70 text-sm">
        Powered by ProfitPlus
      </div>
    </div>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  iconSrc: string;
  comingSoon: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, iconSrc, comingSoon }) => {
  return (
    <div className={`p-6 rounded-lg border border-gray-700 bg-gray-800 ${comingSoon ? 'opacity-60' : ''}`}>
      <div className="flex items-center mb-3">
        <img src={iconSrc} alt={title} className="h-8 w-8 mr-3" />
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {comingSoon && (
          <span className="ml-auto text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
        )}
      </div>
      <p className="text-gray-300">{description}</p>
      
      {!comingSoon && (
        <Button 
          className="w-full mt-4 bg-[#FAA225] text-black hover:bg-[#FAA225]/80"
        >
          Access Service
        </Button>
      )}
    </div>
  );
};

export default ProfitPlusScreen;
