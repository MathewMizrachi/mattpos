
import { toast } from "@/hooks/use-toast";

export const showLowStockAlert = (productName: string, stockQuantity: number) => {
  toast({
    title: "Low Stock Alert",
    description: `${productName} only has ${stockQuantity} items remaining`,
    className: "bg-red-500 text-white font-semibold",
    duration: 3000, // 3 seconds
  });
};
