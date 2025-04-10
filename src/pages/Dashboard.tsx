
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import FloatForm from '@/components/FloatForm';
import EndShiftForm from '@/components/EndShiftForm';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardActions from '@/components/Dashboard/DashboardActions';
import StaffAuthPinPad from '@/components/Dashboard/StaffAuthPinPad';

const Dashboard = () => {
  const { currentUser, currentShift, logout, startShift } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showStaffPinPad, setShowStaffPinPad] = useState(false);
  const [showFloatForm, setShowFloatForm] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [expectedCashAmount, setExpectedCashAmount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleStartShift = () => {
    setShowStaffPinPad(true);
  };
  
  const handleResumeShift = () => {
    navigate('/pos');
  };
  
  const handleStaffPinSubmit = (staffId: number) => {
    setSelectedStaffId(staffId);
    setShowStaffPinPad(false);
    setShowFloatForm(true);
  };
  
  const handleFloatSubmit = (amount: number) => {
    if (selectedStaffId) {
      startShift(selectedStaffId, amount);
      navigate('/pos');
    }
  };
  
  const handleManageStock = () => {
    navigate('/stock');
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
    setShowStaffPinPad(false);
    setShowFloatForm(false);
    navigate('/reports');
  };
  
  const handleSubmitEndShift = (cashAmount: number) => {
    // Implementation would go here
    setShowEndShiftForm(false);
    navigate('/dashboard');
  };

  if (showStaffPinPad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
        <StaffAuthPinPad
          onCancel={() => setShowStaffPinPad(false)}
          onPinSubmit={handleStaffPinSubmit}
        />
      </div>
    );
  }
  
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
        
        <DashboardActions 
          hasActiveShift={!!currentShift}
          onStartShift={handleStartShift}
          onResumeShift={handleResumeShift}
          onManageStock={handleManageStock}
          onManageCustomers={handleManageCustomers}
          onViewReports={handleViewReports}
        />
      </div>
    </div>
  );
};

export default Dashboard;
