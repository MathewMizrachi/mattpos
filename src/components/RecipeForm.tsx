
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusIcon, XIcon } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
}

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: Omit<Recipe, 'id'>) => void;
  recipe?: Recipe;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ isOpen, onClose, onSubmit, recipe }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
  });
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '', quantity: 0, unit: '' }
  ]);
  
  const [instructions, setInstructions] = useState<string[]>(['']);
  
  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
      });
      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
    } else {
      // Reset form
      setFormData({
        name: '',
        description: '',
        prepTime: 0,
        cookTime: 0,
        servings: 1,
      });
      setIngredients([{ id: 1, name: '', quantity: 0, unit: '' }]);
      setInstructions(['']);
    }
  }, [recipe, isOpen]);
  
  const addIngredient = () => {
    setIngredients(prev => [...prev, { 
      id: Math.max(...prev.map(i => i.id)) + 1, 
      name: '', 
      quantity: 0, 
      unit: '' 
    }]);
  };
  
  const removeIngredient = (id: number) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };
  
  const updateIngredient = (id: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };
  
  const addInstruction = () => {
    setInstructions(prev => [...prev, '']);
  };
  
  const removeInstruction = (index: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateInstruction = (index: number, value: string) => {
    setInstructions(prev => prev.map((inst, i) => i === index ? value : inst));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validIngredients = ingredients.filter(i => i.name.trim() && i.quantity > 0 && i.unit.trim());
    const validInstructions = instructions.filter(i => i.trim());
    
    if (!formData.name.trim() || validIngredients.length === 0 || validInstructions.length === 0) {
      return;
    }
    
    onSubmit({
      ...formData,
      ingredients: validIngredients,
      instructions: validInstructions,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {recipe ? 'Edit Recipe' : 'Add New Recipe'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Recipe Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
                placeholder="Enter recipe name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the recipe"
                rows={2}
              />
            </div>
          </div>

          {/* Timing and Servings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="prepTime" className="text-sm font-medium text-gray-700 mb-2 block">
                Prep (min)
              </Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cookTime" className="text-sm font-medium text-gray-700 mb-2 block">
                Cook (min)
              </Label>
              <Input
                id="cookTime"
                type="number"
                min="0"
                value={formData.cookTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="servings" className="text-sm font-medium text-gray-700 mb-2 block">
                Servings
              </Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Ingredients</Label>
              <Button
                type="button"
                onClick={addIngredient}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="Ingredient"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="0"
                    step="0.1"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Input
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                    className="w-20"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Instructions</Label>
              <Button
                type="button"
                onClick={addInstruction}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add Step
              </Button>
            </div>
            
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 mt-2 flex-shrink-0">
                    {index + 1}
                  </div>
                  <Textarea
                    placeholder="Describe this step..."
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="text-gray-400 hover:text-red-500 p-1 mt-2"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0A2645] hover:bg-[#0A2645]/90 text-white"
            >
              {recipe ? 'Update Recipe' : 'Save Recipe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeForm;
