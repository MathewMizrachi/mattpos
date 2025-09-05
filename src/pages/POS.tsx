import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useToast, showLowStockAlert } from '@/hooks/use-toast';
import POSScreenManager from './POS/POSScreenManager';
import POSMain from './POS/POSMain';
import { usePOSState } from './POS/usePOSState';
import { usePaymentStates } from './POS/usePaymentStates';
import { usePaymentHandlers } from './POS/usePaymentHandlers';
import PaymentOptions from '@/components/PaymentOptions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Plus } from 'lucide-react';
import db from '@/lib/db';

// Restaurant stock items for restaurant mode
const restaurantProducts = [
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
];

const POS = () => {
  const { 
    currentUser, 
    currentShift, 
    currentMode,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    processTransaction,
    processRefund,
    endShift,
    logout,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    getLowStockProducts,
    calculateExpectedCashInDrawer
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Load database products for till mode
  const [databaseProducts, setDatabaseProducts] = React.useState<any[]>([]);
  
  // Get table information from navigation state
  const tableInfo = location.state as {
    selectedTable?: number;
    peopleCount?: number;
    isNewOrder?: boolean;
    isAddingToOrder?: boolean;
    existingOrders?: any[];
  } | null;

  React.useEffect(() => {
    if (currentMode === 'till') {
      try {
        const dbProducts = db.getAllProducts();
        setDatabaseProducts(dbProducts);
        console.log('Loaded database products for POS:', dbProducts.length);
      } catch (error) {
        console.error('Error loading database products:', error);
      }
    }
  }, [currentMode]);
  
  const {
    searchTerm,
    setSearchTerm,
    cartExpanded,
    toggleCartExpand,
    calculateTotal,
  } = usePOSState({ cart });

  const paymentStates = usePaymentStates();
  
  const processWithdrawal = (amount: number, reason: string): boolean => {
    if (!currentShift) {
      toast({
        title: "Error",
        description: "No active shift to withdraw from",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Withdrawal successful",
      description: `${amount.toFixed(2)} withdrawn from register for: ${reason}`,
    });
    return true;
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleProcessPayment = (amount: number, method: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: any[]) => {
    if (method === 'split' && splitPayments) {
      return processTransaction(splitPayments);
    }
    const paymentDetails = [{
      method: method as 'cash' | 'card' | 'shop2shop' | 'account',
      amount,
      customerName,
      customerPhone
    }];
    return processTransaction(paymentDetails);
  };
  
  const paymentHandlers = usePaymentHandlers({
    paymentStates,
    currentShift,
    cart,
    calculateTotal,
    processPayment: handleProcessPayment,
    processRefund,
    processWithdrawal,
    endShift
  });
  
  // Restaurant-specific handlers
  const handlePrintReceipt = () => {
    toast({
      title: "Receipt printed",
      description: "Receipt has been sent to printer",
    });
  };

  const handleSendOrder = (tableNumber: number, peopleCount: number) => {
    if (cart.length === 0) return;
    
    const orderType = tableInfo?.isAddingToOrder ? "Additional items" : "Order";
    const actionType = tableInfo?.isAddingToOrder ? "added to" : "sent to";
    
    toast({
      title: `${orderType} sent to kitchen`,
      description: `${orderType} ${actionType} Table ${tableNumber} for ${peopleCount} people`,
    });
    
    clearCart();
    
    // Navigate back to table management after sending order
    navigate('/tables');
  };
  
  // State for simulation dialogs
  const [showGlobalFoundDialog, setShowGlobalFoundDialog] = React.useState(false);
  const [showNewProductDialog, setShowNewProductDialog] = React.useState(false);
  const [sellingPrice, setSellingPrice] = React.useState('');
  const [newProductData, setNewProductData] = React.useState({
    brand: '',
    description: '',
    packSize: '',
    price: ''
  });

  // Mock global database
  const mockGlobalProduct = {
    barcode: '999001',
    brand: 'Coca-Cola',
    description: 'Coca-Cola Classic',
    packSize: '330ml Can',
    category: 'Beverages'
  };
  
  // Simulation handlers for barcode scanner testing
  const handleSimulateGlobalFound = () => {
    setShowGlobalFoundDialog(true);
  };

  const handleSimulateNotFound = () => {
    setNewProductData({
      brand: '',
      description: '',
      packSize: '',
      price: ''
    });
    setShowNewProductDialog(true);
  };

  // Handle global product confirmation
  const handleGlobalProductConfirm = () => {
    if (sellingPrice) {
      toast({
        title: "Product added!",
        description: `${mockGlobalProduct.brand} ${mockGlobalProduct.description} has been added to your inventory`,
      });
      
      setShowGlobalFoundDialog(false);
      setSellingPrice('');
    }
  };

  // Handle new product creation
  const handleNewProductConfirm = () => {
    if (newProductData.brand && newProductData.description && newProductData.price) {
      toast({
        title: "Product created!",
        description: `${newProductData.brand} ${newProductData.description} has been created and added to your inventory`,
      });
      
      setShowNewProductDialog(false);
      setNewProductData({ brand: '', description: '', packSize: '', price: '' });
    }
  };
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  useEffect(() => {
    if (!currentShift && currentMode === 'till') {
      navigate('/dashboard');
    }
  }, [currentShift, currentMode, navigate]);
  
  // Use restaurant products in restaurant mode, database products in till mode
  const activeProducts = currentMode === 'restaurant' ? restaurantProducts : databaseProducts;
  
  const sortedProducts = [...activeProducts].sort((a, b) => {
    return a.id - b.id;
  });
  
  const handleAddToCart = (product: any, quantity: number, customPrice?: number) => {
    addToCart(product, quantity);
    
    if (product.stock !== undefined && product.stock <= 5) {
      // Show low stock alert
      showLowStockAlert(product.name, product.stock);
    }
  };
  
  if (paymentStates.showPaymentOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645]">
        <PaymentOptions 
          onSelectPaymentMethod={paymentHandlers.handleSelectPaymentMethod}
          onCancel={() => paymentStates.setShowPaymentOptions(false)}
        />
      </div>
    );
  }
  
  if (paymentStates.isAnyScreenActive()) {
    return (
      <div id="pos-screen-manager">
        <POSScreenManager
          cart={cart}
          currentShift={currentShift}
          calculateTotal={calculateTotal}
          processPayment={handleProcessPayment}
          processRefund={processRefund}
          processWithdrawal={processWithdrawal}
          endShift={endShift}
          getShiftPaymentBreakdown={getShiftPaymentBreakdown}
          getShiftRefundBreakdown={getShiftRefundBreakdown}
          getLowStockProducts={getLowStockProducts}
          calculateExpectedCashInDrawer={calculateExpectedCashInDrawer}
          navigateToDashboard={navigateToDashboard}
          showPaymentForm={paymentStates.showPaymentForm}
          showCardPayment={paymentStates.showCardPayment}
          showShop2ShopScreen={paymentStates.showShop2ShopScreen}
          showRefundScreen={currentMode === 'till' ? paymentStates.showRefundScreen : false}
          showProfitPlusScreen={currentMode === 'till' ? paymentStates.showProfitPlusScreen : false}
          showWithdrawalScreen={currentMode === 'till' ? paymentStates.showWithdrawalScreen : false}
          showSplitPayment={paymentStates.showSplitPayment}
          showAccountPayment={paymentStates.showAccountPayment}
          showEndShiftForm={paymentStates.showEndShiftForm}
          customerInfo={paymentStates.customerInfo}
          onClosePaymentForm={() => paymentStates.setShowPaymentForm(false)}
          onCloseCardPayment={() => paymentStates.setShowCardPayment(false)}
          onCloseShop2ShopScreen={() => paymentStates.setShowShop2ShopScreen(false)}
          onCloseRefundScreen={() => paymentStates.setShowRefundScreen(false)}
          onCloseProfitPlusScreen={() => {
            paymentStates.setShowProfitPlusScreen(false);
          }}
          onCloseWithdrawalScreen={() => paymentStates.setShowWithdrawalScreen(false)}
          onCloseSplitPayment={() => paymentStates.setShowSplitPayment(false)}
          onCloseAccountPayment={() => paymentStates.setShowAccountPayment(false)}
          onCloseEndShiftForm={() => {
            paymentStates.setShowEndShiftForm(false);
          }}
        />
      </div>
    );
  }
  
  return (
    <>
      <POSMain
        currentUser={currentUser}
        currentShift={currentShift}
        products={sortedProducts}
        cart={cart}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddToCart={handleAddToCart}
        onUpdateCartItem={updateCartQuantity}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        cartExpanded={cartExpanded}
        toggleCartExpand={toggleCartExpand}
        calculateTotal={calculateTotal}
        onEndShift={paymentHandlers.handleEndShift}
        onLogout={logout}
        onShowPaymentForm={paymentHandlers.handleShowPaymentForm}
        onShowRefundScreen={() => currentMode === 'till' && paymentStates.setShowRefundScreen(true)}
        onShowProfitPlusScreen={() => currentMode === 'till' && paymentStates.setShowProfitPlusScreen(true)}
        onShowWithdrawalScreen={() => currentMode === 'till' && paymentStates.setShowWithdrawalScreen(true)}
        onCashPayment={() => paymentStates.setShowPaymentForm(true)}
        onCardPayment={() => paymentStates.setShowCardPayment(true)}
        onShop2ShopPayment={() => paymentStates.setShowShop2ShopScreen(true)}
        onPrintReceipt={handlePrintReceipt}
        onSendOrder={handleSendOrder}
        onSimulateGlobalFound={handleSimulateGlobalFound}
        onSimulateNotFound={handleSimulateNotFound}
        tableInfo={tableInfo}
      />

      {/* Global Product Found Dialog */}
      <Dialog open={showGlobalFoundDialog} onOpenChange={setShowGlobalFoundDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <span>Product Found in Global Database</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Product Information Card */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b">
                <h3 className="text-lg font-semibold text-foreground">
                  {mockGlobalProduct.brand} {mockGlobalProduct.description}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pack Size</p>
                    <p className="text-sm font-semibold">{mockGlobalProduct.packSize}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="text-sm font-semibold">{mockGlobalProduct.category}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Barcode</p>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">{mockGlobalProduct.barcode}</p>
                </div>
              </div>
            </div>
            
            {/* Price Input */}
            <div className="space-y-2">
              <Label htmlFor="selling-price" className="text-sm font-medium">
                Set Your Selling Price (R)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R</span>
                <Input
                  id="selling-price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="pl-8 text-lg font-semibold"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleGlobalProductConfirm}
                disabled={!sellingPrice}
                className="flex-1"
                size="lg"
              >
                Add to Inventory
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowGlobalFoundDialog(false)}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Product Creation Dialog */}
      <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-orange-600" />
              <span>Create New Product</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                Product not found anywhere. Please provide details to create a new product.
              </p>
            </div>
            
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Coca-Cola"
                value={newProductData.brand}
                onChange={(e) => setNewProductData({...newProductData, brand: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Classic Cola Drink"
                value={newProductData.description}
                onChange={(e) => setNewProductData({...newProductData, description: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="pack-size">Pack Size</Label>
              <Input
                id="pack-size"
                placeholder="e.g., 330ml Can"
                value={newProductData.packSize}
                onChange={(e) => setNewProductData({...newProductData, packSize: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="price">Selling Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newProductData.price}
                onChange={(e) => setNewProductData({...newProductData, price: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleNewProductConfirm}
                disabled={!newProductData.brand || !newProductData.description || !newProductData.price}
                className="flex-1"
              >
                Create Product
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewProductDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default POS;
