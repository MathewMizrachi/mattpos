
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/AppContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import POS from '@/pages/POS';
import KitchenOrders from '@/pages/KitchenOrders';
import TableManagement from '@/pages/TableManagement';
import Stock from '@/pages/Stock';
import Reports from '@/pages/Reports';
import Customers from '@/pages/Customers';
import Cashup from '@/pages/Cashup';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/kitchen-orders" element={<KitchenOrders />} />
            <Route path="/table-management" element={<TableManagement />} />
            <Route path="/stock-management" element={<Stock />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/cashup" element={<Cashup />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </AppProvider>
  );
}

export default App;
