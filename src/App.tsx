
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Stock from "./pages/Stock";
import RestaurantStock from "./pages/RestaurantStock";
import Recipes from "./pages/Recipes";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import TableManagement from "./pages/TableManagement";
import KitchenOrders from "./pages/KitchenOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/restaurant-stock" element={<RestaurantStock />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tables" element={<TableManagement />} />
            <Route path="/kitchen-orders" element={<KitchenOrders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
