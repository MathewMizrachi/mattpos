
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

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Array<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
}

interface DeleteRecipeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
  onDelete: () => void;
}

const DeleteRecipeDialog: React.FC<DeleteRecipeDialogProps> = ({
  isOpen,
  onOpenChange,
  recipe,
  onDelete,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#0A2645]">Delete Recipe</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{recipe?.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645]/5">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecipeDialog;
