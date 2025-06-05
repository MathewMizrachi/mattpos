
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChartBarIcon, ArrowLeft } from 'lucide-react';

export const ReportHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b-2 border-[#FAA225] rounded-lg mb-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="text-[#0A2645] hover:bg-[#0A2645]/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A2645] flex items-center">
            <ChartBarIcon className="mr-2 h-6 w-6" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-[#0A2645]/70">View and analyze business performance</p>
        </div>
      </div>
    </header>
  );
};
