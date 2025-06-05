import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ShoppingCartIcon } from 'lucide-react';
import SearchBar from '@/components/Stock/SearchBar';
import CartItem from '@/components/CartItem';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  costPrice: number;
}

interface PurchaseOrder {
  id: number;
  orderDate: Date;
  supplier: string;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    costPrice: number;
  }>;
  totalCost: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  notes?: string;
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
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const suppliers = [
    { id: 'supplier1', name: 'ABC Food Supplies' },
    { id: 'supplier2', name: 'Fresh Market Distributors' },
    { id: 'supplier3', name: 'Global Food Partners' },
    { id: 'supplier4', name: 'Premium Ingredients Co.' },
  ];

  // Load products and purchase orders from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const dbProducts = db.getAllProducts();
        const dbOrders = db.getAllPurchaseOrders();
        console.log('Loaded products for purchase order:', dbProducts.length);
        console.log('Loaded purchase orders:', dbOrders.length);
        setProducts(dbProducts);
        setPurchaseOrders(dbOrders);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error loading data",
          description: "Could not load data from database",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
      const costPrice = product.price * (1 - discountPercentage);
      
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

    const supplierName = suppliers.find(s => s.id === selectedSupplier)?.name || '';
    
    // Create purchase order items
    const orderItems = cart.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      costPrice: item.costPrice
    }));

    // Save to database
    const newOrder = db.createPurchaseOrder(supplierName, orderItems);
    
    // Update local state
    setPurchaseOrders([newOrder, ...purchaseOrders]);
    
    toast({
      title: "Purchase Order Placed",
      description: `Order #${newOrder.id} placed with ${supplierName} for R${getTotalCost().toFixed(2)}`,
    });

    // Reset the order
    setCart([]);
    setSelectedSupplier('');
  };

  const updateOrderStatus = (orderId: number, status: PurchaseOrder['status']) => {
    const updatedOrder = db.updatePurchaseOrderStatus(orderId, status);
    if (updatedOrder) {
      setPurchaseOrders(purchaseOrders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      toast({
        title: "Status Updated",
        description: `Order #${orderId} status changed to ${status}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'ordered': return 'text-blue-600 bg-blue-100';
      case 'received': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
              // Calculate display cost price for each product (6-20% lower than selling price)
              const discountPercentage = 0.06 + (Math.random() * 0.14);
              const displayCostPrice = product.price * (1 - discountPercentage);
              
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

          <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items in order</p>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.id}
                  product={{
                    id: item.id,
                    name: item.name,
                    price: item.costPrice // Use cost price for display
                  }}
                  quantity={item.quantity}
                  onUpdateQuantity={(productId, quantity) => updateQuantity(productId, quantity)}
                  onRemove={(productId) => removeFromCart(productId)}
                />
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

      {/* Purchase Order History */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-[#0A2645]">Purchase Order History</h2>
            <p className="text-sm text-[#0A2645]/70">View and manage all purchase orders</p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>R{order.totalCost.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as PurchaseOrder['status'])}
                        >
                          <SelectTrigger className="w-32 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="ordered">Ordered</SelectItem>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
