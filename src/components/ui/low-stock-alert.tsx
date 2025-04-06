
import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { createRoot } from "react-dom/client";

interface LowStockAlertProps {
  productName: string;
  stockLevel: number;
}

const LowStockAlert = ({ productName, stockLevel }: LowStockAlertProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <Alert className="w-auto max-w-md bg-red-100 border-red-500 shadow-lg text-red-700 animate-in fade-in slide-in-from-top-0 duration-300">
        <AlertCircle className="h-6 w-6" />
        <AlertDescription className="text-lg">
          <span className="font-bold">{productName}</span> has low stock! 
          <span className="ml-1 font-bold text-red-800">({stockLevel} left)</span>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const showLowStockAlert = (productName: string, stockLevel: number) => {
  const alertRoot = document.createElement("div");
  document.body.appendChild(alertRoot);
  
  const root = createRoot(alertRoot);
  root.render(<LowStockAlert productName={productName} stockLevel={stockLevel} />);
  
  setTimeout(() => {
    root.unmount();
    alertRoot.remove();
  }, 3000);
};
