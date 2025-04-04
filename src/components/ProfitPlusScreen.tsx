
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfitPlusScreenProps {
  onCancel: () => void;
}

interface ServiceCategory {
  title: string;
  items: ServiceItem[];
}

interface ServiceItem {
  name: string;
  logo: string;
  bgColor: string;
  subItems?: { name: string; icon: string }[];
}

const ProfitPlusScreen: React.FC<ProfitPlusScreenProps> = ({ onCancel }) => {
  const isMobile = useIsMobile();
  
  const serviceCategories: ServiceCategory[] = [
    {
      title: "Airtime, Electricity & DStv",
      items: [
        { name: "Airtime any Amount", logo: "A", bgColor: "#00a7e1" },
        { name: "Easyload Airtime", logo: "🐪", bgColor: "#f7b217" },
        { name: "Easyload Voucher", logo: "🐪", bgColor: "#003870" },
        { name: "Vodacom", logo: "V", bgColor: "#e60000" },
        { name: "MTN", logo: "MTN", bgColor: "#ffcc00" },
        { name: "Cell C", logo: "C", bgColor: "#ee7203" },
        { name: "Telkom", logo: "T", bgColor: "#0066b3" },
        { name: "Electricity & Water", logo: "⚡", bgColor: "#00b4d8" },
        { name: "DStv", logo: "DStv", bgColor: "#003870" },
      ]
    },
    {
      title: "Loads Everything",
      items: [
        { name: "Easyload Voucher", logo: "🐪", bgColor: "#003870" },
        { name: "OTT", logo: "OTT", bgColor: "#a3d45c" },
        { name: "1Voucher", logo: "1", bgColor: "#f26522" },
        { name: "Blu Voucher", logo: "Blu", bgColor: "#ffffff" },
      ]
    },
    {
      title: "WhatsApp & Social Bundles",
      items: [
        { 
          name: "Vodacom", 
          logo: "V", 
          bgColor: "#e60000",
          subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
        },
        { 
          name: "MTN", 
          logo: "MTN", 
          bgColor: "#ffcc00",
          subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
        },
        { 
          name: "Cell C", 
          logo: "C", 
          bgColor: "#ee7203",
          subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
        },
        { 
          name: "Telkom", 
          logo: "T", 
          bgColor: "#0066b3",
          subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
        },
      ]
    },
    {
      title: "Data Deals",
      items: [
        { 
          name: "Vodacom", 
          logo: "V", 
          bgColor: "#e60000",
          subItems: [{ name: "Data", icon: "data" }]
        },
        { 
          name: "MTN", 
          logo: "MTN", 
          bgColor: "#ffcc00",
          subItems: [{ name: "Data", icon: "data" }]
        },
        { 
          name: "Cell C", 
          logo: "C", 
          bgColor: "#ee7203",
          subItems: [{ name: "Data", icon: "data" }]
        },
        { 
          name: "Telkom", 
          logo: "T", 
          bgColor: "#0066b3",
          subItems: [{ name: "Data", icon: "data" }]
        },
      ]
    },
    {
      title: "Gaming",
      items: [
        { name: "Betway", logo: "betway", bgColor: "#00a826" },
        { name: "Hollywood", logo: "HOLLYWOOD", bgColor: "#6a1b9a" },
        { name: "Easy Bet", logo: "easy bet", bgColor: "#ffd500" },
        { name: "Interbets", logo: "INTER", bgColor: "#ffffff" },
        { name: "Playa", logo: "PLAYA", bgColor: "#ffffff" },
        { name: "LottoStar", logo: "lotto★star", bgColor: "#ffffff" },
        { name: "Fafabet", logo: "Fafabet", bgColor: "#ffffff" },
        { name: "Betmatch", logo: "BETMATCH", bgColor: "#ffffff" },
        { name: "SoccerLine", logo: "SOCCERLINE", bgColor: "#ffffff" },
        { name: "SupaBets", logo: "SUPABETS", bgColor: "#ffffff" },
      ]
    },
    {
      title: "Wifi & Others",
      items: [
        { name: "Ikeja", logo: "ikeja", bgColor: "#e63946" },
        { name: "Too Much Wifi", logo: "TOO MUCH WIFI", bgColor: "#000000" },
        { name: "Talk360", logo: "Talk360", bgColor: "#00b4d8" },
        { name: "Knect", logo: "knect", bgColor: "#2a9d8f" },
      ]
    },
    {
      title: "Bill Payments",
      items: [
        { name: "EasyPay", logo: "easypay", bgColor: "#ffffff" },
      ]
    },
    {
      title: "Money Transfer",
      items: [
        { name: "Mukuru", logo: "mukuru", bgColor: "#f26522" },
        { name: "MomConnect", logo: "👩", bgColor: "#2a9d8f" },
        { name: "EcoCash", logo: "EcoCash", bgColor: "#ffffff" },
      ]
    },
  ];

  const renderServiceItem = (item: ServiceItem) => {
    return (
      <div 
        key={item.name}
        className="relative rounded-lg overflow-hidden shadow-md"
        style={{ backgroundColor: item.bgColor }}
      >
        <div className="flex flex-col items-center justify-center p-4 h-24">
          <div className="text-white font-bold text-center">
            {item.logo}
          </div>
        </div>
        
        {item.subItems && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-500 p-2 flex items-center justify-center">
            {item.subItems.map((subItem, idx) => (
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

  const renderMobileLayout = () => (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="pb-16 px-2">
        {serviceCategories.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-center text-sm text-gray-400 font-medium mb-3">
              {category.title}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {category.items.map((item) => renderServiceItem(item))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  const renderDesktopLayout = () => (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="container mx-auto py-4 pb-16">
        <div className="grid grid-cols-3 gap-8">
          {serviceCategories.slice(0, 3).map((category, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-center text-gray-400 font-medium mb-4">
                {category.title}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {category.items.slice(0, 9).map((item) => renderServiceItem(item))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8">
          {serviceCategories.slice(3, 6).map((category, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-center text-gray-400 font-medium mb-4">
                {category.title}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {category.items.slice(0, 9).map((item) => renderServiceItem(item))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          {serviceCategories.slice(6, 8).map((category, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-center text-gray-400 font-medium mb-4">
                {category.title}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {category.items.map((item) => renderServiceItem(item))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0A2645]">
      <div className="flex items-center p-4 border-b border-gray-700">
        <Button 
          variant="ghost" 
          className="text-white"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <h1 className="text-xl font-bold text-white mx-auto pr-12">ProfitPlus Services</h1>
      </div>
      
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
      
      <div className="mt-auto py-2 text-center text-white opacity-70 text-xs fixed bottom-0 left-0 right-0 bg-[#0A2645]">
        Powered by ProfitPlus
      </div>
    </div>
  );
};

export default ProfitPlusScreen;
