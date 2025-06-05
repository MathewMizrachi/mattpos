
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scan, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface BarcodeScannerProps {
  products: Product[];
  onProductFound: (product: Product) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  products,
  onProductFound,
  onClose
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleBarcodeSubmit = (barcode: string) => {
    console.log('BarcodeScanner: Searching for barcode:', barcode);
    
    // In a real implementation, products would have barcode property
    // For now, we'll search by product ID as a demonstration
    const productId = parseInt(barcode);
    const foundProduct = products.find(p => p.id === productId);
    
    if (foundProduct) {
      console.log('BarcodeScanner: Product found:', foundProduct);
      toast({
        title: "Product found!",
        description: `${foundProduct.name} added to cart`,
      });
      onProductFound(foundProduct);
      setBarcodeInput('');
    } else {
      console.log('BarcodeScanner: No product found for barcode:', barcode);
      toast({
        title: "Product not found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      handleBarcodeSubmit(barcodeInput.trim());
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleManualSubmit = () => {
    if (barcodeInput.trim()) {
      handleBarcodeSubmit(barcodeInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Scan className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Barcode Scanner</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium mb-2">
              Scan or enter barcode
            </label>
            <Input
              ref={inputRef}
              id="barcode"
              type="text"
              placeholder="Scan barcode or enter product ID..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-lg"
              autoComplete="off"
            />
          </div>
          
          <div className="text-sm text-gray-500">
            <p>• Scan a barcode or manually enter product ID</p>
            <p>• Press Enter to search</p>
            <p>• Press Escape to close</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleManualSubmit}
              disabled={!barcodeInput.trim()}
              className="flex-1"
            >
              Search Product
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
