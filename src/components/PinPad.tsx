
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PinPadProps {
  onSubmit: (pin: string) => void;
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const PinPad: React.FC<PinPadProps> = ({ 
  onSubmit, 
  title, 
  subtitle, 
  titleClassName = "",
  subtitleClassName = ""
}) => {
  const [pin, setPin] = useState<string>('');
  
  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };
  
  const handleClear = () => {
    setPin('');
  };
  
  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    if (pin.length > 0) {
      onSubmit(pin);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        {title && <h2 className={`text-2xl font-bold ${titleClassName}`}>{title}</h2>}
        {subtitle && <p className={`text-muted-foreground mt-1 ${subtitleClassName}`}>{subtitle}</p>}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                i < pin.length 
                  ? 'bg-[#FAA225] border-[#FAA225]' 
                  : 'border-gray-300 bg-transparent'
              }`}
            >
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Button 
            key={num} 
            variant="outline"
            className="py-6 text-xl font-medium bg-white text-black hover:bg-white/90"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </Button>
        ))}
        
        <Button 
          variant="outline" 
          className="py-6 text-xl font-medium bg-white text-black hover:bg-white/90"
          onClick={handleClear}
        >
          Clear
        </Button>
        
        <Button 
          variant="outline" 
          className="py-6 text-xl font-medium bg-white text-black hover:bg-white/90"
          onClick={() => handleNumberClick(0)}
        >
          0
        </Button>
        
        <Button 
          variant="outline" 
          className="py-6 text-xl font-medium bg-white text-black hover:bg-white/90"
          onClick={handleDelete}
        >
          ←
        </Button>
        
        <Button 
          className="col-span-3 py-6 text-xl font-medium mt-4 bg-white text-black hover:bg-white/90"
          onClick={handleSubmit}
          disabled={pin.length === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PinPad;
