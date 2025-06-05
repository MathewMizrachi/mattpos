import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/contexts/AppContext';
import db from '@/lib/db';
import ProductForm from '@/components/ProductForm';
import ProductImportModal from '@/components/ProductImportModal';
import StockHeader from '@/components/Stock/StockHeader';
import SearchBar from '@/components/Stock/SearchBar';
import ProductTable from '@/components/Stock/ProductTable';
import DeleteProductDialog from '@/components/Stock/DeleteProductDialog';

const Stock = () => {
  const { currentUser, addProduct, updateProduct, deleteProduct } = useApp();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportProductOpen, setIsImportProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load products from database on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dbProducts = db.getAllProducts();
        console.log('Loaded products from database:', dbProducts.length);
        setProducts(dbProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error loading products",
          description: "Could not load products from database",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddProduct = async (data: any) => {
    try {
      const newProduct = db.addProduct(data);
      setProducts(prev => [...prev, newProduct]);
      // Also add to context for POS
      addProduct(data);
      toast({
        title: "Till item added",
        description: `${data.name} has been added to your till stock.`,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Could not add product",
        variant: "destructive"
      });
    }
  };
  
  const handleEditProduct = async (data: any) => {
    if (selectedProduct) {
      try {
        const updatedProduct = db.updateProduct(selectedProduct.id, data);
        if (updatedProduct) {
          setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
          // Also update in context
          updateProduct(selectedProduct.id, data);
          toast({
            title: "Till item updated",
            description: `${data.name} has been updated.`,
          });
        }
      } catch (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Error",
          description: "Could not update product",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        const success = db.deleteProduct(selectedProduct.id);
        if (success) {
          setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
          // Also delete from context
          deleteProduct(selectedProduct.id);
          toast({
            title: "Till item deleted",
            description: `${selectedProduct.name} has been removed from your till stock.`,
          });
          setIsDeleteDialogOpen(false);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Could not delete product",
          variant: "destructive"
        });
      }
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
  
  const handleImportProducts = async (products: any[]) => {
    try {
      const addedProducts = [];
      for (const product of products) {
        const newProduct = db.addProduct(product);
        addedProducts.push(newProduct);
        // Also add to context
        addProduct(product);
      }
      setProducts(prev => [...prev, ...addedProducts]);
      toast({
        title: "Till items imported",
        description: `${products.length} items have been imported to your till stock.`,
      });
      setIsImportProductOpen(false);
    } catch (error) {
      console.error('Error importing products:', error);
      toast({
        title: "Error",
        description: "Could not import products",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading till stock...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StockHeader 
        title="Till Stock"
        description="Manage till inventory and products"
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
