
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import ProductForm from '@/components/ProductForm';
import ProductImportModal from '@/components/ProductImportModal';
import StockHeader from '@/components/Stock/StockHeader';
import SearchBar from '@/components/Stock/SearchBar';
import ProductTable from '@/components/Stock/ProductTable';
import DeleteProductDialog from '@/components/Stock/DeleteProductDialog';
import RawGoodsSection from '@/components/Stock/RawGoodsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RestaurantStock = () => {
  const { currentUser, addProduct, updateProduct, deleteProduct } = useApp();
  const { toast } = useToast();
  
  // Restaurant-specific products
  const [restaurantProducts, setRestaurantProducts] = useState([
    { id: 1001, name: 'Classic Burger', price: 85, stock: 50, barcode: '8001001001', stockCode: 'REST001', linkCode: 'REST001-001', avgCostIncl: 45 },
    { id: 1002, name: 'Cheeseburger', price: 95, stock: 40, barcode: '8001001002', stockCode: 'REST002', linkCode: 'REST002-001', avgCostIncl: 52 },
    { id: 1003, name: 'Chicken Burger', price: 90, stock: 35, barcode: '8001001003', stockCode: 'REST003', linkCode: 'REST003-001', avgCostIncl: 48 },
    { id: 1004, name: 'Fish & Chips', price: 120, stock: 25, barcode: '8001001004', stockCode: 'REST004', linkCode: 'REST004-001', avgCostIncl: 65 },
    { id: 1005, name: 'Coca Cola 330ml', price: 25, stock: 100, barcode: '8001001005', stockCode: 'REST005', linkCode: 'REST005-001', avgCostIncl: 15 },
    { id: 1006, name: 'Sprite 330ml', price: 25, stock: 80, barcode: '8001001006', stockCode: 'REST006', linkCode: 'REST006-001', avgCostIncl: 15 },
    { id: 1007, name: 'Fanta Orange 330ml', price: 25, stock: 90, barcode: '8001001007', stockCode: 'REST007', linkCode: 'REST007-001', avgCostIncl: 15 },
    { id: 1008, name: 'French Fries Regular', price: 35, stock: 60, barcode: '8001001008', stockCode: 'REST008', linkCode: 'REST008-001', avgCostIncl: 18 },
    { id: 1009, name: 'French Fries Large', price: 45, stock: 45, barcode: '8001001009', stockCode: 'REST009', linkCode: 'REST009-001', avgCostIncl: 22 },
    { id: 1010, name: 'Chicken Wings (6pc)', price: 75, stock: 30, barcode: '8001001010', stockCode: 'REST010', linkCode: 'REST010-001', avgCostIncl: 38 },
    { id: 1011, name: 'Pizza Margherita', price: 110, stock: 20, barcode: '8001001011', stockCode: 'REST011', linkCode: 'REST011-001', avgCostIncl: 55 },
    { id: 1012, name: 'Caesar Salad', price: 65, stock: 25, barcode: '8001001012', stockCode: 'REST012', linkCode: 'REST012-001', avgCostIncl: 32 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportProductOpen, setIsImportProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const filteredProducts = restaurantProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddProduct = (data: any) => {
    const newProduct = { ...data, id: Date.now() };
    setRestaurantProducts(prev => [...prev, newProduct]);
    toast({
      title: "Restaurant item added",
      description: `${data.name} has been added to your restaurant inventory.`,
    });
  };
  
  const handleEditProduct = (data: any) => {
    if (selectedProduct) {
      setRestaurantProducts(prev => prev.map(p => 
        p.id === selectedProduct.id ? { ...p, ...data } : p
      ));
      toast({
        title: "Restaurant item updated",
        description: `${data.name} has been updated.`,
      });
    }
  };
  
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setRestaurantProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      toast({
        title: "Restaurant item deleted",
        description: `${selectedProduct.name} has been removed from your restaurant inventory.`,
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
    setRestaurantProducts(prev => [...prev, ...newProducts]);
    toast({
      title: "Restaurant items imported",
      description: `${products.length} items have been imported to your restaurant inventory.`,
    });
    setIsImportProductOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StockHeader 
        title="Restaurant Stock"
        description="Manage restaurant menu items and ingredients"
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onOpenImportProduct={() => setIsImportProductOpen(true)}
        showPurchaseOrder={true}
      />
      
      <div className="p-4 flex-1">
        <Tabs defaultValue="menu-items" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="menu-items" className="text-base font-semibold">Menu Items</TabsTrigger>
            <TabsTrigger value="raw-goods" className="text-base font-semibold">Raw Goods & Ingredients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu-items" className="space-y-4">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            <div className="bg-white rounded-lg shadow">
              <ProductTable 
                products={filteredProducts} 
                onEdit={openEditModal} 
                onDelete={openDeleteDialog} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="raw-goods">
            <RawGoodsSection />
          </TabsContent>
        </Tabs>
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

export default RestaurantStock;
