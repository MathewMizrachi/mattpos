
import { toast } from "@/hooks/use-toast";

export const showLowStockAlert = (productName: string, stockQuantity: number) => {
  toast({
    title: "Low Stock Alert",
    description: `${productName} only has ${stockQuantity} items remaining`,
    className: "bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold border-red-400 shadow-lg",
    duration: 5000, // 5 seconds for better visibility
  });
};
