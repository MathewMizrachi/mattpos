
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import PurchaseOrderHeader from '@/components/PurchaseOrder/PurchaseOrderHeader';
import PurchaseOrderContent from '@/components/PurchaseOrder/PurchaseOrderContent';
import PurchaseOrderFooter from '@/components/PurchaseOrder/PurchaseOrderFooter';
import SupplierSelectionDialog from '@/components/PurchaseOrder/SupplierSelectionDialog';
import db from '@/lib/db';

const PurchaseOrder = () => {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showSupplierDialog, setShowSupplierDialog] = useState(true);
  const [loading, setLoading] = useState(true);

  // Sample suppliers - in a real app this would come from a database
  const suppliers = [
    { id: 1, name: 'Fresh Foods Suppliers', contact: '+27 11 123 4567' },
    { id: 2, name: 'Beverage Distributors', contact: '+27 11 765 4321' },
    { id: 3, name: 'Kitchen Equipment Co', contact: '+27 11 555 0123' },
    { id: 4, name: 'Packaging Solutions', contact: '+27 11 999 8888' },
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dbProducts = db.getAllProducts();
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

  const handleSupplierSelect = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowSupplierDialog(false);
  };

  const handleAddToCart = (product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  const handleUpdateCartItem = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => 
      total + (item.product.avgCostIncl || item.product.price * 0.6) * item.quantity, 0
    );
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your order before placing it.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Purchase order placed",
      description: `Order sent to ${selectedSupplier?.name} for ${cart.length} items`,
    });

    // Clear cart after placing order
    setCart([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PurchaseOrderHeader 
        selectedSupplier={selectedSupplier}
        onChangeSupplier={() => setShowSupplierDialog(true)}
      />
      
      <PurchaseOrderContent
        products={products}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cart={cart}
        onAddToCart={handleAddToCart}
        onUpdateCartItem={handleUpdateCartItem}
        onRemoveFromCart={handleRemoveFromCart}
      />

      <PurchaseOrderFooter
        cart={cart}
        total={calculateTotal()}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        supplierSelected={!!selectedSupplier}
      />

      <SupplierSelectionDialog
        isOpen={showSupplierDialog}
        suppliers={suppliers}
        onSelect={handleSupplierSelect}
        onClose={() => {
          if (!selectedSupplier) {
            navigate('/stock');
          } else {
            setShowSupplierDialog(false);
          }
        }}
      />
    </div>
  );
};

export default PurchaseOrder;
