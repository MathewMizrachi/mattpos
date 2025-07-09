
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
import { Recipe } from '@/types';
import { Trash2, AlertTriangle } from 'lucide-react';

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
      <AlertDialogContent className="bg-gradient-to-br from-white via-red-50/80 to-red-100/60 border-2 border-red-300 shadow-2xl rounded-2xl overflow-hidden">
        <AlertDialogHeader className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white p-6 -m-6 mb-6 rounded-t-2xl">
          <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              Delete Recipe
              <div className="text-sm text-white/80 font-normal mt-1">This action cannot be undone</div>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/90 text-base mt-3 bg-white/10 p-3 rounded-lg">
            Are you sure you want to delete <span className="font-bold text-white">"{recipe?.name}"</span>? 
            This will permanently remove the recipe and all its ingredients and instructions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="p-6 -m-6 mt-0">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200 mb-6">
            <div className="text-center">
              <div className="mb-2">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              </div>
              <div className="text-red-700 font-bold text-lg">Warning!</div>
              <div className="text-red-600 text-sm mt-1">
                This recipe will be permanently deleted and cannot be recovered.
              </div>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="bg-gradient-to-r from-gray-50 to-red-50/30 p-6 -m-6 mt-0 rounded-b-2xl border-t-2 border-red-200">
          <AlertDialogCancel className="border-2 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white font-bold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
          >
            Delete Recipe
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRecipeDialog;
