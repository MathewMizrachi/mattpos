
import { toast } from "@/hooks/use-toast";

export const showLowStockAlert = (productName: string, stockQuantity: number) => {
  toast({
    title: "⚠️ Low Stock Alert",
    description: `${productName} only has ${stockQuantity} items remaining`,
    className: "bg-white border border-gray-200 shadow-xl rounded-xl p-6 max-w-md mx-auto",
    duration: 4000,
  });
};
