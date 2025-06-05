
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/AppContext';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import POS from '@/pages/POS';
import Stock from '@/pages/Stock';
import PurchaseOrder from '@/pages/PurchaseOrder';
import RestaurantStock from '@/pages/RestaurantStock';
import Reports from '@/pages/Reports';
import Customers from '@/pages/Customers';
import TableManagement from '@/pages/TableManagement';
import KitchenOrders from '@/pages/KitchenOrders';
import Recipes from '@/pages/Recipes';
import Cashup from '@/pages/Cashup';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/purchase-order" element={<PurchaseOrder />} />
            <Route path="/restaurant-stock" element={<RestaurantStock />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/table-management" element={<TableManagement />} />
            <Route path="/kitchen-orders" element={<KitchenOrders />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/cashup" element={<Cashup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
