
import { toast } from "@/hooks/use-toast";

export const showLowStockAlert = (productName: string, stockQuantity: number) => {
  toast({
    title: "⚠️ Low Stock Alert",
    description: `${productName} only has ${stockQuantity} items remaining`,
    className: "bg-white border-l-4 border-l-orange-500 shadow-2xl rounded-lg",
    duration: 4000,
  });
};
