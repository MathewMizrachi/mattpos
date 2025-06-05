
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ShoppingCartIcon } from 'lucide-react';
import SearchBar from '@/components/Stock/SearchBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  costPrice: number;
}

const PurchaseOrder = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const suppliers = [
    { id: 'supplier1', name: 'ABC Food Supplies' },
    { id: 'supplier2', name: 'Fresh Market Distributors' },
    { id: 'supplier3', name: 'Global Food Partners' },
    { id: 'supplier4', name: 'Premium Ingredients Co.' },
  ];

  // Load products from database on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dbProducts = db.getAllProducts();
        console.log('Loaded products for purchase order:', dbProducts.length);
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

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    if (!selectedSupplier) {
      setShowSupplierDialog(true);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Calculate cost price as 6%-20% lower than selling price
      const discountPercentage = 0.06 + (Math.random() * 0.14); // Random between 6% and 20%
      const costPrice = (product as any).avgCostIncl ?? (product.price * (1 - discountPercentage));
      
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        costPrice: costPrice
      }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => total + (item.costPrice * item.quantity), 0);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add items to your order before placing it.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSupplier) {
      toast({
        title: "No Supplier Selected",
        description: "Please select a supplier for your order.",
        variant: "destructive"
      });
      return;
    }

    const supplierName = suppliers.find(s => s.id === selectedSupplier)?.name;
    
    toast({
      title: "Purchase Order Placed",
      description: `Order placed with ${supplierName} for R${getTotalCost().toFixed(2)}`,
    });

    // Reset the order
    setCart([]);
    setSelectedSupplier('');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b-2 border-[#FAA225] rounded-lg m-4 mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/stock-management')}
            className="text-[#0A2645] hover:bg-[#0A2645]/10"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0A2645]">Purchase Order</h1>
            <p className="text-sm text-[#0A2645]/70">Create purchase orders for stock replenishment</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-64 bg-white text-[#0A2645] border-[#0A2645]">
              <SelectValue placeholder="Select Supplier" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id} className="text-[#0A2645]">
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex flex-1 gap-4 p-4">
        {/* Products Grid */}
        <div className="flex-1">
          {/* Search Bar */}
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              // Calculate display cost price for each product
              const discountPercentage = 0.06 + (Math.random() * 0.14);
              const displayCostPrice = (product as any).avgCostIncl ?? (product.price * (1 - discountPercentage));
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-[#0A2645] mb-2">{product.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p>Sell Price: R{product.price.toFixed(2)}</p>
                    <p>Cost Price: R{displayCostPrice.toFixed(2)}</p>
                    <p>Stock: {(product as any).stock ?? 0}</p>
                  </div>
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
                    size="sm"
                  >
                    Add to Order
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-80 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0A2645] flex items-center">
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Purchase Order
            </h2>
            <span className="text-sm text-gray-600">{cart.length} items</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items in order</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">R{item.costPrice.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-6 w-6 p-0"
                    >
                      -
                    </Button>
                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total Cost:</span>
                  <span className="font-bold text-lg">R{getTotalCost().toFixed(2)}</span>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#0A2645] hover:bg-[#0A2645]/90 text-white"
                  disabled={!selectedSupplier}
                >
                  Place Order
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Supplier Selection Dialog */}
      <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Select Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Please select a supplier before adding items to your order.</p>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="bg-white text-[#0A2645] border-[#0A2645]">
                <SelectValue placeholder="Choose a supplier..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id} className="text-[#0A2645]">
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setShowSupplierDialog(false)}
              className="w-full"
              disabled={!selectedSupplier}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrder;
