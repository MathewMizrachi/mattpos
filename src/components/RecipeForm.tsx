
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusIcon, TrashIcon } from 'lucide-react';

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0A2645]">
            {recipe ? 'Edit Recipe' : 'Add New Recipe'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-[#0A2645]">Recipe Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="border-[#0A2645]/20 focus:border-[#FAA225]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="servings" className="text-[#0A2645]">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                className="border-[#0A2645]/20 focus:border-[#FAA225]"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-[#0A2645]">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="border-[#0A2645]/20 focus:border-[#FAA225]"
              rows={3}
            />
          </div>
          
          {/* Timing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prepTime" className="text-[#0A2645]">Prep Time (minutes)</Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                className="border-[#0A2645]/20 focus:border-[#FAA225]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cookTime" className="text-[#0A2645]">Cook Time (minutes)</Label>
              <Input
                id="cookTime"
                type="number"
                min="0"
                value={formData.cookTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                className="border-[#0A2645]/20 focus:border-[#FAA225]"
                required
              />
            </div>
          </div>
          
          {/* Ingredients */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-[#0A2645] text-lg font-semibold">Ingredients</Label>
              <Button
                type="button"
                onClick={addIngredient}
                className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
            
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                      className="border-[#0A2645]/20 focus:border-[#FAA225]"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Qty"
                      min="0"
                      step="0.1"
                      value={ingredient.quantity || ''}
                      onChange={(e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="border-[#0A2645]/20 focus:border-[#FAA225]"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                      className="border-[#0A2645]/20 focus:border-[#FAA225]"
                    />
                  </div>
                  <div className="col-span-1">
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-[#0A2645] text-lg font-semibold">Instructions</Label>
              <Button
                type="button"
                onClick={addInstruction}
                className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
            
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-[#0A2645] font-semibold min-w-[30px]">{index + 1}.</span>
                  <Textarea
                    placeholder="Instruction step"
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="border-[#0A2645]/20 focus:border-[#FAA225] flex-1"
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645]/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0A2645] hover:bg-[#0A2645]/90 text-white"
            >
              {recipe ? 'Update Recipe' : 'Add Recipe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeForm;
