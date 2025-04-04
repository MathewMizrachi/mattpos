
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
      
      {/* Main content with the three images */}
      {isMobile ? (
        <div className="flex-grow p-6 flex flex-col space-y-6">
          <div className="w-full max-w-sm mx-auto">
            <img 
              src="/lovable-uploads/3d914bdb-a5d0-4d7d-a1f8-debd2456d19a.png"
              alt="Airtime, Electricity & DStv"
              className="w-full rounded-lg"
            />
          </div>
          <div className="w-full max-w-sm mx-auto">
            <img 
              src="/lovable-uploads/6f1c1040-7a81-4020-b402-6ba070f21561.png"
              alt="WhatsApp & Social Bundles"
              className="w-full rounded-lg"
            />
          </div>
          <div className="w-full max-w-sm mx-auto">
            <img 
              src="/lovable-uploads/83575fc1-170c-4ed2-a5ea-b6577dbd1f03.png"
              alt="Gaming"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div className="flex-grow flex justify-center items-center pb-10">
          <div className="flex space-x-8">
            <img 
              src="/lovable-uploads/3d914bdb-a5d0-4d7d-a1f8-debd2456d19a.png"
              alt="Airtime, Electricity & DStv"
              className="max-h-[80vh] object-contain rounded-lg"
            />
            <img 
              src="/lovable-uploads/6f1c1040-7a81-4020-b402-6ba070f21561.png"
              alt="WhatsApp & Social Bundles"
              className="max-h-[80vh] object-contain rounded-lg"
            />
            <img 
              src="/lovable-uploads/83575fc1-170c-4ed2-a5ea-b6577dbd1f03.png"
              alt="Gaming"
              className="max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitPlusScreen;
