
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText, Upload } from 'lucide-react';

interface ProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: any[]) => void;
}

interface ImportedProduct {
  name: string;
  price: number;
  stock?: number;
}

const ProductImportModal: React.FC<ProductImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportedProduct[]>([]);
  
  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const header = lines[0].split(',');
    
    if (!header.includes('name') || !header.includes('price')) {
      throw new Error('CSV must include at least "name" and "price" columns');
    }
    
    const nameIndex = header.indexOf('name');
    const priceIndex = header.indexOf('price');
    const stockIndex = header.indexOf('stock');
    
    const products: ImportedProduct[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      if (values.length >= 2) {
        const product: ImportedProduct = {
          name: values[nameIndex].trim(),
          price: parseFloat(values[priceIndex].trim()),
        };
        
        if (stockIndex !== -1 && values[stockIndex]) {
          product.stock = parseInt(values[stockIndex].trim(), 10);
        }
        
        // Validate product
        if (!product.name || isNaN(product.price) || product.price <= 0) {
          throw new Error(`Invalid product at line ${i + 1}: Name must not be empty, price must be a positive number`);
        }
        
        if (product.stock !== undefined && (isNaN(product.stock) || product.stock < 0)) {
          throw new Error(`Invalid stock value at line ${i + 1}: Stock must be a non-negative number`);
        }
        
        products.push(product);
      }
    }
    
    if (products.length > 1000) {
      throw new Error('Import limited to 1000 products at a time');
    }
    
    return products;
  };
  
  const handlePreview = () => {
    try {
      setError(null);
      const products = parseCSV(importText);
      setPreview(products);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV data');
      setPreview([]);
    }
  };
  
  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
      onClose();
    } else {
      handlePreview();
    }
  };
  
  const handleSampleDownload = () => {
    const sampleCSV = 'name,price,stock\nSample Product,19.99,10\nAnother Product,24.50,5';
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_import.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Import products from a CSV file (max 1000 products at a time)
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSampleDownload}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              Download Sample
            </Button>
          </div>
          
          <Textarea 
            placeholder="Paste your CSV data here (name,price,stock)"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="min-h-[200px] font-mono"
          />
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {preview.length > 0 && (
            <div className="border rounded-md p-2">
              <p className="font-medium mb-2">Preview ({preview.length} products)</p>
              <div className="max-h-[200px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1 px-2">Name</th>
                      <th className="text-right py-1 px-2">Price</th>
                      <th className="text-right py-1 px-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((product, index) => (
                      <tr key={index} className="border-b border-dashed">
                        <td className="py-1 px-2">{product.name}</td>
                        <td className="text-right py-1 px-2">${product.price.toFixed(2)}</td>
                        <td className="text-right py-1 px-2">{product.stock ?? 'N/A'}</td>
                      </tr>
                    ))}
                    {preview.length > 5 && (
                      <tr>
                        <td colSpan={3} className="text-center py-1 px-2 text-muted-foreground">
                          And {preview.length - 5} more...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {preview.length > 0 ? (
            <Button onClick={handleImport} className="bg-[#0A2645] hover:bg-[#0A2645]/90">
              <Upload className="h-4 w-4 mr-2" />
              Import {preview.length} Products
            </Button>
          ) : (
            <Button onClick={handlePreview}>
              Preview
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImportModal;
