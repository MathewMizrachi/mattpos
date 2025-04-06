
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeftIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  Package2Icon,
  ImportIcon,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import ProductForm from '@/components/ProductForm';
import ProductImportModal from '@/components/ProductImportModal';

const Stock = () => {
  const { currentUser, products, addProduct, updateProduct, deleteProduct } = useApp();
  const navigate = useNavigate();
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
    toast({
      title: "Products imported",
      description: `${products.length} products have been imported to your inventory.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Stock</h1>
            <p className="text-sm text-muted-foreground">Add, edit, and remove products</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsImportProductOpen(true)} 
            className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
          >
            <ImportIcon className="h-4 w-4 mr-2" />
            Import Products
          </Button>
          <Button onClick={() => setIsAddProductOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </header>
      
      <div className="p-4">
        <div className="relative mb-4">
          <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2645]" />
          <Input
            className="pl-9 max-w-md bg-white text-[#0A2645]"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchTerm('')}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package2Icon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">No products found</p>
              {searchTerm ? (
                <p className="text-sm text-muted-foreground">
                  Try searching for something else
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click "Add Product" to add your first product
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {product.stock !== undefined ? product.stock : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(product)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {/* Add Product Modal */}
      <ProductForm
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleAddProduct}
      />
      
      {/* Edit Product Modal */}
      {selectedProduct && (
        <ProductForm
          product={selectedProduct}
          isOpen={isEditProductOpen}
          onClose={() => setIsEditProductOpen(false)}
          onSubmit={handleEditProduct}
        />
      )}
      
      {/* Import Products Modal */}
      <ProductImportModal
        isOpen={isImportProductOpen}
        onClose={() => setIsImportProductOpen(false)}
        onImport={handleImportProducts}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Stock;
