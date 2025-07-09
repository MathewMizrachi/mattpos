
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import ProductForm from '@/components/ProductForm';
import ProductImportModal from '@/components/ProductImportModal';
import SearchBar from '@/components/Stock/SearchBar';
import ProductTable from '@/components/Stock/ProductTable';
import DeleteProductDialog from '@/components/Stock/DeleteProductDialog';
import { Button } from '@/components/ui/button';
import { PlusIcon, ImportIcon } from 'lucide-react';

const RawGoodsSection: React.FC = () => {
  const { toast } = useToast();
  
  // Raw ingredients/goods data
  const [rawGoods, setRawGoods] = useState([
    { id: 2001, name: 'Beef Patty', price: 3.50, stock: 80, barcode: '8002001001', stockCode: 'RAW001', linkCode: 'RAW001-001', avgCostIncl: 3.50 },
    { id: 2002, name: 'Burger Bun', price: 0.75, stock: 120, barcode: '8002001002', stockCode: 'RAW002', linkCode: 'RAW002-001', avgCostIncl: 0.75 },
    { id: 2003, name: 'Cheddar Cheese Slice', price: 0.85, stock: 150, barcode: '8002001003', stockCode: 'RAW003', linkCode: 'RAW003-001', avgCostIncl: 0.85 },
    { id: 2004, name: 'Lettuce Leaves', price: 0.25, stock: 200, barcode: '8002001004', stockCode: 'RAW004', linkCode: 'RAW004-001', avgCostIncl: 0.25 },
    { id: 2005, name: 'Tomato Slices', price: 0.15, stock: 180, barcode: '8002001005', stockCode: 'RAW005', linkCode: 'RAW005-001', avgCostIncl: 0.15 },
    { id: 2006, name: 'Onion Rings', price: 0.10, stock: 160, barcode: '8002001006', stockCode: 'RAW006', linkCode: 'RAW006-001', avgCostIncl: 0.10 },
    { id: 2007, name: 'Chicken Breast', price: 4.20, stock: 60, barcode: '8002001007', stockCode: 'RAW007', linkCode: 'RAW007-001', avgCostIncl: 4.20 },
    { id: 2008, name: 'Fish Fillet', price: 5.50, stock: 40, barcode: '8002001008', stockCode: 'RAW008', linkCode: 'RAW008-001', avgCostIncl: 5.50 },
    { id: 2009, name: 'Potato (for fries)', price: 0.20, stock: 300, barcode: '8002001009', stockCode: 'RAW009', linkCode: 'RAW009-001', avgCostIncl: 0.20 },
    { id: 2010, name: 'Cooking Oil', price: 8.00, stock: 25, barcode: '8002001010', stockCode: 'RAW010', linkCode: 'RAW010-001', avgCostIncl: 8.00 },
    { id: 2011, name: 'Pizza Dough', price: 2.00, stock: 50, barcode: '8002001011', stockCode: 'RAW011', linkCode: 'RAW011-001', avgCostIncl: 2.00 },
    { id: 2012, name: 'Mozzarella Cheese', price: 3.80, stock: 35, barcode: '8002001012', stockCode: 'RAW012', linkCode: 'RAW012-001', avgCostIncl: 3.80 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportProductOpen, setIsImportProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const filteredProducts = rawGoods.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddProduct = (data: any) => {
    const newProduct = { ...data, id: Date.now() };
    setRawGoods(prev => [...prev, newProduct]);
    toast({
      title: "Raw ingredient added",
      description: `${data.name} has been added to your raw goods inventory.`,
    });
  };
  
  const handleEditProduct = (data: any) => {
    if (selectedProduct) {
      setRawGoods(prev => prev.map(p => 
        p.id === selectedProduct.id ? { ...p, ...data } : p
      ));
      toast({
        title: "Raw ingredient updated",
        description: `${data.name} has been updated.`,
      });
    }
  };
  
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setRawGoods(prev => prev.filter(p => p.id !== selectedProduct.id));
      toast({
        title: "Raw ingredient deleted",
        description: `${selectedProduct.name} has been removed from your raw goods inventory.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };
  
  const openDeleteDialog = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleImportProducts = (products: any[]) => {
    const newProducts = products.map(p => ({ ...p, id: Date.now() + Math.random() }));
    setRawGoods(prev => [...prev, ...newProducts]);
    toast({
      title: "Raw ingredients imported",
      description: `${products.length} items have been imported to your raw goods inventory.`,
    });
    setIsImportProductOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0A2645]">Raw Goods & Ingredients</h2>
          <p className="text-sm text-[#0A2645]/70">Manage your raw ingredients and cooking supplies</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsImportProductOpen(true)}
            className="bg-gradient-to-r from-[#FAA225] to-[#e8940f] hover:from-[#e8940f] hover:to-[#FAA225] text-white"
          >
            <ImportIcon className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button 
            onClick={() => setIsAddProductOpen(true)}
            className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] hover:from-[#1a3a5f] hover:to-[#0A2645] text-[#FAA225]"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Raw Good
          </Button>
        </div>
      </div>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="bg-white rounded-lg shadow">
        <ProductTable 
          products={filteredProducts} 
          onEdit={openEditModal} 
          onDelete={openDeleteDialog} 
        />
      </div>
      
      <ProductForm
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleAddProduct}
      />
      
      {selectedProduct && (
        <ProductForm
          product={selectedProduct}
          isOpen={isEditProductOpen}
          onClose={() => setIsEditProductOpen(false)}
          onSubmit={handleEditProduct}
        />
      )}
      
      <ProductImportModal
        isOpen={isImportProductOpen}
        onClose={() => setIsImportProductOpen(false)}
        onImport={handleImportProducts}
      />
      
      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={selectedProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default RawGoodsSection;
