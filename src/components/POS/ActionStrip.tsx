
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { CreditCard, Banknote, ShoppingBag } from 'lucide-react';

interface ActionStripProps {
  onRefund: () => void;
  onProfitPlus: () => void;
  onWithdrawal?: () => void;
  onCashPayment?: () => void;
  onCardPayment?: () => void;
  onShop2ShopPayment?: () => void;
}

const ActionStrip: React.FC<ActionStripProps> = ({ 
  onRefund, 
  onProfitPlus, 
  onWithdrawal = () => {}, 
  onCashPayment = () => {}, 
  onCardPayment = () => {}, 
  onShop2ShopPayment = () => {} 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`fixed ${isMobile ? 'bottom-[4.5rem] left-0 right-0' : 'bottom-0 left-0 right-[24rem]'} z-10 flex flex-wrap items-center`}
      style={{ 
        backgroundColor: '#dddddd',
        height: isMobile ? 'auto' : '5rem'
      }}
    >
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] text-[#0A2645] h-full rounded-none text-lg md:text-xl flex items-center justify-center font-bold flex-1"
        onClick={onRefund}
      >
        REFUNDS
      </Button>
      
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] text-[#0A2645] h-full rounded-none text-lg md:text-xl flex items-center justify-center font-bold flex-1"
        onClick={onWithdrawal}
      >
        WITHDRAWAL
      </Button>
      
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] text-[#0A2645] h-full rounded-none text-lg md:text-xl flex items-center justify-center font-bold flex-1"
        onClick={onCashPayment}
      >
        <Banknote className="h-5 w-5 mr-2" />
        CASH
      </Button>
      
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] text-[#0A2645] h-full rounded-none text-lg md:text-xl flex items-center justify-center font-bold flex-1"
        onClick={onCardPayment}
      >
        <CreditCard className="h-5 w-5 mr-2" />
        CARD
      </Button>
      
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] text-[#0A2645] h-full rounded-none text-lg md:text-xl flex items-center justify-center font-bold flex-1"
        onClick={onShop2ShopPayment}
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        SHOP2SHOP
      </Button>
      
      <Button 
        className="bg-[#dddddd] hover:bg-[#cccccc] h-full rounded-none flex items-center justify-center flex-1"
        onClick={onProfitPlus}
      >
        <img 
          src="/lovable-uploads/f4e28baf-787d-4f4b-aebf-26b48b90ba07.png" 
          alt="ProfitPlus" 
          className="h-24 w-24 md:h-30 md:w-30 object-contain"
          style={{ transform: 'scale(1.125)' }} 
        />
      </Button>
    </div>
  );
};

export default ActionStrip;
