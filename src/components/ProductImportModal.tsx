
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, Download } from 'lucide-react';

interface ProductImportModalProps {
  isOpen: boolean;
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gradient-to-br from-white via-blue-50/80 to-blue-100/60 rounded-2xl shadow-2xl border-2 border-[#FAA225]/30 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#FAA225] to-[#e8940f] p-3 rounded-xl shadow-lg">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0A2645]">Import Products</h2>
              <p className="text-sm text-[#0A2645]/70">Upload CSV file or paste data below</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-[#0A2645] hover:bg-[#0A2645]/10 hover:scale-110 transition-all duration-200 rounded-xl"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50/80 to-[#FAA225]/10 p-4 rounded-xl border-2 border-blue-200/50">
            <p className="text-[#0A2645] font-medium mb-2">Upload a CSV file or paste CSV content below.</p>
            <p className="text-sm text-[#0A2645]/70 mb-3">Maximum 1000 products per import.</p>
            <p className="text-sm text-[#0A2645]/70 font-medium">CSV should have headers: name, price, stock, barcode, category</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A2645] mb-2">Upload CSV File</label>
              <Input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                className="bg-white/80 border-2 border-blue-200 focus:border-[#FAA225] transition-colors" 
              />
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleDownloadSample}
                variant="outline"
                className="bg-white/80 text-[#0A2645] border-2 border-[#0A2645] hover:bg-[#0A2645] hover:text-white font-semibold transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample CSV
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#0A2645] mb-2">Or paste CSV content:</label>
            <Textarea 
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              placeholder="name,price,stock,barcode,category&#10;Product 1,19.99,50,123456789,Electronics&#10;Product 2,29.99,75,987654321,Books"
              className="bg-white/80 border-2 border-blue-200 focus:border-[#FAA225] transition-colors font-mono text-sm"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t-2 border-blue-200/50">
            <Button 
              onClick={onClose}
              variant="outline"
              className="bg-white/80 text-[#0A2645] border-2 border-[#0A2645] hover:bg-[#0A2645]/10 font-semibold transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              className="bg-gradient-to-r from-[#FAA225] to-[#e8940f] hover:from-[#e8940f] hover:to-[#FAA225] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
