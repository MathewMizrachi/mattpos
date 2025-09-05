
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Scan, X, Database, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface GlobalProduct {
  barcode: string;
  brand: string;
  description: string;
  packSize: string;
  category: string;
}

interface BarcodeScannerProps {
  products: Product[];
  onProductFound: (product: Product) => void;
  onAddNewProduct: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
  onSimulateGlobalFound?: () => void;
  onSimulateNotFound?: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  products,
  onProductFound,
  onAddNewProduct,
  onClose,
  onSimulateGlobalFound,
  onSimulateNotFound
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showGlobalFoundDialog, setShowGlobalFoundDialog] = useState(false);
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [globalProduct, setGlobalProduct] = useState<GlobalProduct | null>(null);
  const [newProductData, setNewProductData] = useState({
    brand: '',
    description: '',
    packSize: '',
    price: ''
  });
  const [sellingPrice, setSellingPrice] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock global database
  const mockGlobalDatabase: GlobalProduct[] = [
    { barcode: '999001', brand: 'Coca-Cola', description: 'Coca-Cola Classic', packSize: '330ml Can', category: 'Beverages' },
    { barcode: '999002', brand: 'Nestlé', description: 'KitKat Chocolate Bar', packSize: '41.5g', category: 'Confectionery' },
    { barcode: '999003', brand: 'Lay\'s', description: 'Classic Potato Chips', packSize: '150g Bag', category: 'Snacks' },
  ];

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchGlobalDatabase = (barcode: string): GlobalProduct | null => {
    return mockGlobalDatabase.find(p => p.barcode === barcode) || null;
  };

  const handleBarcodeSubmit = (barcode: string) => {
    console.log('BarcodeScanner: Searching for barcode:', barcode);
    
    // First search local products
    const productId = parseInt(barcode);
    const foundProduct = products.find(p => p.id === productId || p.barcode === barcode);
    
    if (foundProduct) {
      console.log('BarcodeScanner: Product found locally:', foundProduct);
      toast({
        title: "Product found!",
        description: `${foundProduct.name} added to cart`,
      });
      onProductFound(foundProduct);
      setBarcodeInput('');
      return;
    }

    // If not found locally, search global database
    const globalProduct = searchGlobalDatabase(barcode);
    if (globalProduct) {
      console.log('BarcodeScanner: Product found in global database:', globalProduct);
      setGlobalProduct(globalProduct);
      setShowGlobalFoundDialog(true);
      setBarcodeInput('');
      return;
    }

    // If not found anywhere, prompt for new product creation
    console.log('BarcodeScanner: No product found for barcode:', barcode);
    setNewProductData({
      brand: '',
      description: '',
      packSize: '',
      price: ''
    });
    setShowNewProductDialog(true);
    setBarcodeInput('');
  };

  const handleGlobalProductConfirm = () => {
    if (globalProduct && sellingPrice) {
      const newProduct: Omit<Product, 'id'> = {
        name: `${globalProduct.brand} ${globalProduct.description}`,
        price: parseFloat(sellingPrice),
        barcode: globalProduct.barcode,
        stock: 0 // New product starts with 0 stock
      };
      
      onAddNewProduct(newProduct);
      toast({
        title: "Product added!",
        description: `${newProduct.name} has been added to your inventory`,
      });
      
      setShowGlobalFoundDialog(false);
      setGlobalProduct(null);
      setSellingPrice('');
    }
  };

  const handleNewProductConfirm = () => {
    if (newProductData.brand && newProductData.description && newProductData.price) {
      const newProduct: Omit<Product, 'id'> = {
        name: `${newProductData.brand} ${newProductData.description}`,
        price: parseFloat(newProductData.price),
        barcode: barcodeInput,
        stock: 0
      };
      
      onAddNewProduct(newProduct);
      toast({
        title: "Product created!",
        description: `${newProduct.name} has been created and added to your inventory`,
      });
      
      setShowNewProductDialog(false);
      setNewProductData({ brand: '', description: '', packSize: '', price: '' });
    }
  };

  const simulateGlobalFound = () => {
    if (onSimulateGlobalFound) {
      onSimulateGlobalFound();
    } else {
      const sampleGlobal = mockGlobalDatabase[0];
      setGlobalProduct(sampleGlobal);
      setShowGlobalFoundDialog(true);
    }
  };

  const simulateNotFound = () => {
    if (onSimulateNotFound) {
      onSimulateNotFound();
    } else {
      setNewProductData({
        brand: '',
        description: '',
        packSize: '',
        price: ''
      });
      setShowNewProductDialog(true);
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
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#FAA225] rounded-lg p-6 w-full max-w-md mx-4 text-[#0A2645]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Scan className="h-5 w-5 text-[#0A2645]" />
              <h2 className="text-lg font-semibold text-[#0A2645]">Barcode Scanner</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 text-[#0A2645] hover:bg-[#0A2645]/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="barcode" className="block text-sm font-medium mb-2 text-[#0A2645]">
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
                className="text-lg bg-white text-[#0A2645] border-[#0A2645] focus:border-[#0A2645] focus:ring-[#0A2645]"
                autoComplete="off"
              />
            </div>
            
            <div className="text-sm text-[#0A2645]/80">
              <p>• Scan a barcode or manually enter product ID</p>
              <p>• Press Enter to search</p>
              <p>• Press Escape to close</p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleManualSubmit}
                disabled={!barcodeInput.trim()}
                className="flex-1 bg-[#0A2645] text-white hover:bg-[#0A2645]/90"
              >
                Search Product
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="text-[#0A2645] border-[#0A2645] hover:bg-[#0A2645]/10"
              >
                Cancel
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Global Product Found Dialog */}
      <Dialog open={showGlobalFoundDialog} onOpenChange={setShowGlobalFoundDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>Product Found in Global Database</span>
            </DialogTitle>
          </DialogHeader>
          {globalProduct && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{globalProduct.brand} {globalProduct.description}</h3>
                <p className="text-sm text-gray-600">Pack Size: {globalProduct.packSize}</p>
                <p className="text-sm text-gray-600">Category: {globalProduct.category}</p>
                <p className="text-sm text-gray-600">Barcode: {globalProduct.barcode}</p>
              </div>
              
              <div>
                <Label htmlFor="selling-price">Set Your Selling Price</Label>
                <Input
                  id="selling-price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleGlobalProductConfirm}
                  disabled={!sellingPrice}
                  className="flex-1"
                >
                  Add to Inventory
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowGlobalFoundDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Product Creation Dialog */}
      <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-orange-600" />
              <span>Create New Product</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                Product not found anywhere. Please provide details to create a new product.
              </p>
            </div>
            
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Coca-Cola"
                value={newProductData.brand}
                onChange={(e) => setNewProductData({...newProductData, brand: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Classic Cola Drink"
                value={newProductData.description}
                onChange={(e) => setNewProductData({...newProductData, description: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="pack-size">Pack Size</Label>
              <Input
                id="pack-size"
                placeholder="e.g., 330ml Can"
                value={newProductData.packSize}
                onChange={(e) => setNewProductData({...newProductData, packSize: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="price">Selling Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newProductData.price}
                onChange={(e) => setNewProductData({...newProductData, price: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleNewProductConfirm}
                disabled={!newProductData.brand || !newProductData.description || !newProductData.price}
                className="flex-1"
              >
                Create Product
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewProductDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BarcodeScanner;
