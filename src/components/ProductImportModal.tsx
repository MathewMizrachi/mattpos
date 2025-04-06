
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface ProductImportModalProps {
  isOpen: boolean; // Add isOpen prop to match what's passed in Stock.tsx
  onClose: () => void;
  onImport: (products: any[]) => void;
}

const ProductImportModal: React.FC<ProductImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [csvText, setCsvText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setCsvText(evt.target.result as string);
      }
    };
    reader.readAsText(selectedFile);
  };
  
  const handleImport = () => {
    if (!csvText.trim()) {
      toast({
        title: "No data to import",
        description: "Please upload a CSV file or paste CSV data",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Parse CSV
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      const products = [];
      
      // Process up to 1000 products max
      const maxProducts = Math.min(lines.length - 1, 1000);
      
      for (let i = 1; i <= maxProducts; i++) {
        if (!lines[i]?.trim()) continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        
        if (values.length !== headers.length) {
          toast({
            title: "Invalid CSV format",
            description: `Line ${i+1} has a different number of columns than the header`,
            variant: "destructive"
          });
          return;
        }
        
        const product = {};
        headers.forEach((header, index) => {
          product[header] = values[index];
        });
        
        // Convert numeric fields - Fix TypeScript errors by adding explicit type checks
        if ('price' in product && product['price'] !== undefined) {
          product['price'] = parseFloat(String(product['price']));
        }
        if ('stock' in product && product['stock'] !== undefined) {
          product['stock'] = parseInt(String(product['stock']));
        }
        if ('barcode' in product && product['barcode'] !== undefined) {
          product['barcode'] = String(product['barcode']);
        }
        
        products.push(product);
      }
      
      if (products.length > 0) {
        onImport(products);
        toast({
          title: `${products.length} products imported`,
          description: products.length < 1000 
            ? "All products were imported successfully"
            : "Maximum 1000 products imported. If you have more, please import them in batches."
        });
      } else {
        toast({
          title: "No valid products found",
          description: "Check your CSV format and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error importing products",
        description: "An error occurred while parsing the CSV data",
        variant: "destructive"
      });
    }
  };
  
  const handleDownloadSample = () => {
    const sampleCSV = "name,price,stock,barcode,category\nProduct 1,19.99,50,123456789,Category A\nProduct 2,29.99,75,987654321,Category B";
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_products.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Import Products</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="mb-2">Upload a CSV file or paste CSV content below. Maximum 1000 products per import.</p>
            <p className="mb-2 text-sm text-gray-600">CSV should have headers: name, price, stock, barcode, category</p>
            <Input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              className="mb-2" 
            />
            <Button 
              onClick={handleDownloadSample}
              className="text-[#0A2645] bg-white border border-[#0A2645] hover:bg-gray-100"
            >
              Download Sample CSV
            </Button>
          </div>
          
          <div>
            <label className="block mb-2">Or paste CSV content:</label>
            <Textarea 
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={10}
              placeholder="name,price,stock,barcode,category"
              className="w-full p-2 border"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              onClick={onClose}
              className="text-[#0A2645] bg-white border border-[#0A2645] hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90"
            >
              Import Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImportModal;
