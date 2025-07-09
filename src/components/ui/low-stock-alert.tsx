
import { toast } from "@/hooks/use-toast";

export const showLowStockAlert = (productName: string, stockQuantity: number) => {
  toast({
    title: "Low Stock Alert",
    description: `${productName} only has ${stockQuantity} items remaining`,
    className: "bg-[#0A2645] text-[#FAA225] border-[#FAA225] border-2 font-semibold shadow-xl",
    duration: 4000,
  });
};
