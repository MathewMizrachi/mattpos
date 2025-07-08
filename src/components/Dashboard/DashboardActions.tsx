
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  BarChart3, 
  Users, 
  Package, 
  DollarSign,
  Play
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface DashboardActionsProps {
  hasActiveShift: boolean;
  onStartShift: () => void;
  onResumeShift: () => void;
  onManageStock: () => void;
  onManageCustomers: () => void;
  onViewReports: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ 
  hasActiveShift,
  onStartShift,
  onResumeShift,
  onManageStock,
  onManageCustomers,
  onViewReports
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {hasActiveShift ? (
        <Card 
          className="border-2 hover:shadow-lg transition-all"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.accent
          }}
        >
          <CardContent className="p-6">
            <Button
              onClick={onResumeShift}
              className="w-full h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
              style={{
                backgroundColor: theme.accent,
                color: theme.buttonText
              }}
            >
              <Play className="h-8 w-8" />
              Resume Shift
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className="border-2 hover:shadow-lg transition-all"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.accent
          }}
        >
          <CardContent className="p-6">
            <Button
              onClick={onStartShift}
              className="w-full h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
              style={{
                backgroundColor: theme.accent,
                color: theme.buttonText
              }}
            >
              <Calculator className="h-8 w-8" />
              Start Shift
            </Button>
          </CardContent>
        </Card>
      )}

      <Card 
        className="border-2 hover:shadow-lg transition-all"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <CardContent className="p-6">
          <Button
            onClick={onManageStock}
            className="w-full h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
            style={{
              backgroundColor: theme.button,
              color: theme.buttonText
            }}
          >
            <Package className="h-8 w-8" />
            Manage Stock
          </Button>
        </CardContent>
      </Card>

      <Card 
        className="border-2 hover:shadow-lg transition-all"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.accent
        }}
      >
        <CardContent className="p-6">
          <Button
            onClick={onManageCustomers}
            className="w-full h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
            style={{
              backgroundColor: theme.accent,
              color: theme.buttonText
            }}
          >
            <Users className="h-8 w-8" />
            Manage Customers
          </Button>
        </CardContent>
      </Card>

      <Card 
        className="border-2 hover:shadow-lg transition-all"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.accent
        }}
      >
        <CardContent className="p-6">
          <Button
            onClick={() => navigate('/cashup')}
            className="w-full h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
            style={{
              backgroundColor: theme.accent,
              color: theme.buttonText
            }}
          >
            <DollarSign className="h-8 w-8" />
            Cashup
          </Button>
        </CardContent>
      </Card>

      <Card 
        className="border-2 hover:shadow-lg transition-all"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <CardContent className="p-6">
          <Button
            onClick={onViewReports}
            className="w-full h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
            style={{
              backgroundColor: theme.button,
              color: theme.buttonText
            }}
          >
            <BarChart3 className="h-8 w-8" />
            View Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActions;
