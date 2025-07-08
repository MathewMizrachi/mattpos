
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import db from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ShoppingCartIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('create');

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

    // Reset the order and switch to history tab
    setCart([]);
    setSelectedSupplier('');
    setActiveTab('history');
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
      case 'pending': return 'text-amber-700 bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300';
      case 'ordered': return 'text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300';
      case 'received': return 'text-green-700 bg-gradient-to-r from-green-100 to-green-200 border border-green-300';
      case 'cancelled': return 'text-red-700 bg-gradient-to-r from-red-100 to-red-200 border border-red-300';
      default: return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FAA225] to-[#e8940f] rounded-full flex items-center justify-center shadow-2xl mx-auto animate-pulse">
            <ShoppingCartIcon className="h-8 w-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FAA225] border-t-transparent mx-auto"></div>
          <p className="text-[#0A2645] font-semibold text-lg">🛒 Loading purchase orders...</p>
          <p className="text-[#0A2645]/70 text-sm">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAA225]/20 via-[#FAA225]/10 to-transparent opacity-50"></div>
        <header className="relative bg-white/95 backdrop-blur-sm p-6 shadow-2xl border-b-4 border-[#FAA225] rounded-xl m-6 mb-8 transition-all duration-300 hover:shadow-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/stock-management')}
                className="text-[#0A2645] hover:bg-[#0A2645]/10 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-[#FAA225] to-[#e8940f] rounded-lg shadow-lg">
                  <ShoppingCartIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#0A2645] bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] bg-clip-text">
                    🛒 Purchase Orders
                  </h1>
                  <p className="text-sm text-[#0A2645]/70 mt-1">📋 Create and manage purchase orders for stock replenishment</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-xl shadow-lg">
            <TabsTrigger 
              value="create" 
              className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] text-[#FAA225] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FAA225] data-[state=active]:to-[#e8940f] data-[state=active]:text-[#0A2645] hover:bg-[#0A2645]/90 transition-all duration-200 rounded-lg font-semibold shadow-md"
            >
              ➕ Create Order
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] text-[#FAA225] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FAA225] data-[state=active]:to-[#e8940f] data-[state=active]:text-[#0A2645] hover:bg-[#0A2645]/90 transition-all duration-200 rounded-lg font-semibold shadow-md"
            >
              📊 Order History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            <div className="flex flex-1 gap-6">
              {/* Enhanced Products Grid */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6 gap-4">
                  <div className="flex-1">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/15">
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger className="w-64 bg-white/20 backdrop-blur-sm text-[#0A2645] border-[#0A2645]/30 focus:border-[#FAA225] focus:ring-[#FAA225]/20 transition-all duration-200">
                        <SelectValue placeholder="🏢 Select Supplier" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl">
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id} className="text-[#0A2645] hover:bg-[#FAA225]/10 transition-colors duration-200">
                            🏢 {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    // Calculate display cost price for each product (6-20% lower than selling price)
                    const discountPercentage = 0.06 + (Math.random() * 0.14);
                    const displayCostPrice = product.price * (1 - discountPercentage);
                    
                    return (
                      <div key={product.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
                        <h3 className="font-bold text-[#0A2645] mb-4 text-lg">📦 {product.name}</h3>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">💰 Sell Price:</span>
                            <span className="font-semibold text-green-600">R{product.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">💵 Cost Price:</span>
                            <span className="font-semibold text-blue-600">R{displayCostPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">📊 Stock:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              (product as any).stock > 10 
                                ? 'bg-green-100 text-green-800' 
                                : (product as any).stock > 0 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {(product as any).stock ?? 0}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full bg-gradient-to-r from-[#FAA225] to-[#e8940f] hover:from-[#e8940f] hover:to-[#FAA225] text-[#0A2645] font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                          size="sm"
                        >
                          ➕ Add to Order
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Cart Panel */}
              <div className="w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0A2645] flex items-center">
                    <ShoppingCartIcon className="h-6 w-6 mr-3 text-[#FAA225]" />
                    🛒 Purchase Order
                  </h2>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    📦 {cart.length} items
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto mb-6 pr-2">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <ShoppingCartIcon className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="text-gray-500 font-semibold">🛒 No items in order</p>
                      <p className="text-gray-400 text-sm">Add products to start building your order</p>
                    </div>
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
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <span className="font-bold text-[#0A2645]">💰 Total Cost:</span>
                      <span className="font-bold text-2xl text-green-600">R{getTotalCost().toFixed(2)}</span>
                    </div>
                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] hover:from-[#1a3a5f] hover:to-[#0A2645] text-white font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl py-3"
                      disabled={!selectedSupplier}
                    >
                      🚀 Place Order
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] text-white">
                <h2 className="text-2xl font-bold flex items-center">
                  📊 Purchase Order History
                </h2>
                <p className="text-[#FAA225] mt-2">📋 View and manage all purchase orders</p>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <TableHead className="font-bold text-[#0A2645]">🔢 Order #</TableHead>
                      <TableHead className="font-bold text-[#0A2645]">📅 Date</TableHead>
                      <TableHead className="font-bold text-[#0A2645]">🏢 Supplier</TableHead>
                      <TableHead className="font-bold text-[#0A2645]">📦 Items</TableHead>
                      <TableHead className="font-bold text-[#0A2645]">💰 Total Cost</TableHead>
                      <TableHead className="font-bold text-[#0A2645]">📊 Status</TableHead>
                      <TableHead className="font-bold text-[#0A2645]">⚡ Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto shadow-lg">
                              <ShoppingCartIcon className="h-8 w-8 text-gray-500" />
                            </div>
                            <p className="text-gray-500 font-semibold">📋 No purchase orders found</p>
                            <p className="text-gray-400 text-sm">Create your first purchase order to see it here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      purchaseOrders.map((order, index) => (
                        <TableRow 
                          key={order.id}
                          className={`hover:bg-gradient-to-r hover:from-[#FAA225]/5 hover:to-[#FAA225]/10 transition-all duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <TableCell className="font-bold text-[#0A2645]">#{order.id}</TableCell>
                          <TableCell className="text-[#0A2645]">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-[#0A2645] font-medium">{order.supplier}</TableCell>
                          <TableCell className="text-[#0A2645]">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {order.items.length} items
                            </span>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">R{order.totalCost.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value as PurchaseOrder['status'])}
                            >
                              <SelectTrigger className="w-32 bg-white border-[#0A2645]/20 hover:border-[#FAA225] transition-colors duration-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl">
                                <SelectItem value="pending" className="hover:bg-amber-50">⏳ Pending</SelectItem>
                                <SelectItem value="ordered" className="hover:bg-blue-50">📋 Ordered</SelectItem>
                                <SelectItem value="received" className="hover:bg-green-50">✅ Received</SelectItem>
                                <SelectItem value="cancelled" className="hover:bg-red-50">❌ Cancelled</SelectItem>
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Supplier Selection Dialog */}
      <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0A2645] flex items-center">
              🏢 Select Supplier
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-[#0A2645]/70">📋 Please select a supplier before adding items to your order.</p>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="bg-white/20 backdrop-blur-sm text-[#0A2645] border-[#0A2645]/30 focus:border-[#FAA225] focus:ring-[#FAA225]/20 transition-all duration-200">
                <SelectValue placeholder="🏢 Choose a supplier..." />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl">
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id} className="text-[#0A2645] hover:bg-[#FAA225]/10 transition-colors duration-200">
                    🏢 {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setShowSupplierDialog(false)}
              className="w-full bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] hover:from-[#1a3a5f] hover:to-[#0A2645] text-white font-bold shadow-lg transition-all duration-200 hover:scale-105"
              disabled={!selectedSupplier}
            >
              ✅ Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrder;
