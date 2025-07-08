
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Product {
  id: number;
  name: string;
}

interface DeleteProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onDelete: () => void;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  onOpenChange,
  product,
  onDelete,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-red-200 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-700 flex items-center">
            🗑️ Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-base">
            Are you sure you want to delete <span className="font-semibold text-[#0A2645]">"{product?.name}"</span>? 
            <br />
            <span className="text-red-600 font-medium">⚠️ This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-3">
          <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 transition-all duration-200 hover:scale-105">
            ❌ Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete} 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            🗑️ Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
