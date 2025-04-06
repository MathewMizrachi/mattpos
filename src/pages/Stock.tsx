
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import ProductForm from '@/components/ProductForm';
import ProductImportModal from '@/components/ProductImportModal';
import StockHeader from '@/components/Stock/StockHeader';
import SearchBar from '@/components/Stock/SearchBar';
import ProductTable from '@/components/Stock/ProductTable';
import DeleteProductDialog from '@/components/Stock/DeleteProductDialog';

const Stock = () => {
  const { currentUser, products, addProduct, updateProduct, deleteProduct } = useApp();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportProductOpen, setIsImportProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddProduct = (data: any) => {
    addProduct(data);
    toast({
      title: "Product added",
      description: `${data.name} has been added to your inventory.`,
    });
  };
  
  const handleEditProduct = (data: any) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, data);
      toast({
        title: "Product updated",
        description: `${data.name} has been updated.`,
      });
    }
  };
  
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      toast({
        title: "Product deleted",
        description: `${selectedProduct.name} has been removed from your inventory.`,
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
    products.forEach(product => addProduct(product));
    toast({
      title: "Products imported",
      description: `${products.length} products have been imported to your inventory.`,
    });
    setIsImportProductOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StockHeader 
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onOpenImportProduct={() => setIsImportProductOpen(true)}
      />
      
      <div className="p-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="bg-white rounded-lg shadow">
          <ProductTable 
            products={filteredProducts} 
            onEdit={openEditModal} 
            onDelete={openDeleteDialog} 
          />
        </div>
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

export default Stock;
