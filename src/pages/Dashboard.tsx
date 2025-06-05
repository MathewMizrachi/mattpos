import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/contexts/AppContext';
import FloatForm from '@/components/FloatForm';
import EndShiftForm from '@/components/EndShiftForm';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardActions from '@/components/Dashboard/DashboardActions';
import RestaurantActions from '@/components/Dashboard/RestaurantActions';
import TableSelectionDialog from '@/components/TableSelectionDialog';

const Dashboard = () => {
  const { currentUser, currentShift, currentMode, logout, startShift } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showFloatForm, setShowFloatForm] = useState(false);
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [expectedCashAmount, setExpectedCashAmount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleStartShift = () => {
    setShowFloatForm(true);
  };
  
  const handleResumeShift = () => {
    navigate('/pos');
  };

  const handleTakeOrders = () => {
    setShowTableDialog(true);
  };

  const handleTableSelection = (tableNumber: number, peopleCount: number) => {
    // Start shift with 0 float if no active shift in restaurant mode
    if (!currentShift && currentUser) {
      startShift(currentUser.id, 0);
    }
    
    setShowTableDialog(false);
    
    // Navigate to POS with table info (could be passed as state or stored in context)
    navigate('/pos', { 
      state: { 
        selectedTable: tableNumber, 
        peopleCount: peopleCount 
      } 
    });
  };

  const handleManageTables = () => {
    navigate('/tables');
  };
  
  const handleFloatSubmit = (amount: number) => {
    if (currentUser) {
      startShift(currentUser.id, amount);
      if (currentMode === 'restaurant') {
        navigate('/pos');
      } else {
        navigate('/pos');
      }
    }
  };
  
  const handleManageStock = () => {
    navigate('/stock-management');
  };

  const handleManageCustomers = () => {
    navigate('/customers');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleEndShiftReport = () => {
    setShowFloatForm(false);
    navigate('/reports');
  };
  
  const handleSubmitEndShift = (cashAmount: number) => {
    // Implementation would go here
    setShowEndShiftForm(false);
    navigate('/dashboard');
  };
  
  if (showFloatForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
        <FloatForm 
          onSubmit={handleFloatSubmit}
          onCancel={() => setShowFloatForm(false)}
        />
      </div>
    );
  }
  
  if (showEndShiftForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
        <EndShiftForm 
          onSubmit={handleSubmitEndShift}
          onCancel={() => setShowEndShiftForm(false)}
          onEndShiftReport={handleEndShiftReport}
          expectedAmount={expectedCashAmount}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A2645] p-4">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader 
          userName={currentUser?.name || ''} 
          onLogout={handleLogout}
        />
        
        {currentMode === 'restaurant' ? (
          <RestaurantActions 
            onTakeOrders={handleTakeOrders}
            onManageTables={handleManageTables}
            onManageStock={handleManageStock}
            onManageCustomers={handleManageCustomers}
            onViewReports={handleViewReports}
          />
        ) : (
          <DashboardActions 
            hasActiveShift={!!currentShift}
            onStartShift={handleStartShift}
            onResumeShift={handleResumeShift}
            onManageStock={handleManageStock}
            onManageCustomers={handleManageCustomers}
            onViewReports={handleViewReports}
          />
        )}
      </div>
      
      <TableSelectionDialog
        open={showTableDialog}
        onOpenChange={setShowTableDialog}
        onConfirm={handleTableSelection}
      />
    </div>
  );
};

export default Dashboard;
