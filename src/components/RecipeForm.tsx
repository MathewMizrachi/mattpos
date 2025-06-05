import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlusIcon, XIcon, DollarSignIcon } from 'lucide-react';
import { Recipe } from '@/types';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
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
  totalCost: number;
  isManualCost: boolean;
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
    totalCost: 0,
    isManualCost: false,
  });
  
  const [ingredients, setIngredients] = useState<Recipe['ingredients']>([
    { id: 1, name: '', quantity: 0, unit: '', costPerUnit: 0 }
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
        totalCost: recipe.totalCost || 0,
        isManualCost: recipe.isManualCost || false,
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
        totalCost: 0,
        isManualCost: false,
      });
      setIngredients([{ id: 1, name: '', quantity: 0, unit: '', costPerUnit: 0 }]);
      setInstructions(['']);
    }
  }, [recipe, isOpen]);
  
  const calculateAutomaticCost = () => {
    return ingredients.reduce((sum, ingredient) => {
      const ingredientCost = (ingredient.costPerUnit || 0) * ingredient.quantity;
      return sum + ingredientCost;
    }, 0);
  };
  
  const automaticCost = calculateAutomaticCost();
  const finalCost = formData.isManualCost ? formData.totalCost : automaticCost;
  const costPerServing = formData.servings > 0 ? finalCost / formData.servings : 0;
  
  const addIngredient = () => {
    setIngredients(prev => [...prev, { 
      id: Math.max(...prev.map(i => i.id)) + 1, 
      name: '', 
      quantity: 0, 
      unit: '', 
      costPerUnit: 0 
    }]);
  };
  
  const removeIngredient = (id: number) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };
  
  const updateIngredient = (id: number, field: keyof Recipe['ingredients'][0], value: string | number) => {
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
      totalCost: finalCost,
      costPerServing,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A2645] border-[#0A2645]">
        <DialogHeader className="pb-4 border-b border-[#FAA225]/30">
          <DialogTitle className="text-xl font-semibold text-white">
            {recipe ? 'Edit Recipe' : 'Add New Recipe'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-white mb-2 block">
                Recipe Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                placeholder="Enter recipe name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-white mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the recipe"
                rows={2}
                className="bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
              />
            </div>
          </div>

          {/* Timing and Servings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="prepTime" className="text-sm font-medium text-white mb-2 block">
                Prep (min)
              </Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                className="bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cookTime" className="text-sm font-medium text-white mb-2 block">
                Cook (min)
              </Label>
              <Input
                id="cookTime"
                type="number"
                min="0"
                value={formData.cookTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                className="bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="servings" className="text-sm font-medium text-white mb-2 block">
                Servings
              </Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                className="bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                required
              />
            </div>
          </div>
          
          {/* Cost Section */}
          <div className="space-y-4 bg-[#FAA225]/10 p-4 rounded-lg border border-[#FAA225]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5 text-[#FAA225]" />
                <Label className="text-sm font-medium text-white">Recipe Costing</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="manualCost" className="text-sm text-white">Manual Cost Entry</Label>
                <Switch
                  id="manualCost"
                  checked={formData.isManualCost}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isManualCost: checked }))}
                />
              </div>
            </div>
            
            {formData.isManualCost ? (
              <div>
                <Label htmlFor="totalCost" className="text-sm font-medium text-white mb-2 block">
                  Total Recipe Cost (R)
                </Label>
                <Input
                  id="totalCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalCost: parseFloat(e.target.value) || 0 }))}
                  className="bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                  placeholder="Enter total cost"
                />
              </div>
            ) : (
              <div className="text-white/80 text-sm">
                Cost will be automatically calculated from ingredient costs below.
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 p-2 rounded">
                <span className="text-white/70">Total Cost: </span>
                <span className="font-medium text-white">R{finalCost.toFixed(2)}</span>
              </div>
              <div className="bg-white/10 p-2 rounded">
                <span className="text-white/70">Cost per serving: </span>
                <span className="font-medium text-white">R{costPerServing.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">Ingredients</Label>
              <Button
                type="button"
                onClick={addIngredient}
                className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] border-[#FAA225]"
                size="sm"
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
                    className="flex-1 bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="0"
                    step="0.1"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                  />
                  <Input
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                    className="w-20 bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                  />
                  <Input
                    type="number"
                    placeholder="Cost/Unit"
                    min="0"
                    step="0.01"
                    value={ingredient.costPerUnit || ''}
                    onChange={(e) => updateIngredient(ingredient.id, 'costPerUnit', parseFloat(e.target.value) || 0)}
                    className="w-24 bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="text-white hover:text-[#FAA225] hover:bg-white/10 p-1"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {!formData.isManualCost && (
                <div className="text-right text-sm text-white/70">
                  Automatic total: R{automaticCost.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-white">Instructions</Label>
              <Button
                type="button"
                onClick={addInstruction}
                className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] border-[#FAA225]"
                size="sm"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add Step
              </Button>
            </div>
            
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#FAA225] flex items-center justify-center text-xs font-medium text-[#0A2645] mt-2 flex-shrink-0">
                    {index + 1}
                  </div>
                  <Textarea
                    placeholder="Describe this step..."
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1 bg-white text-[#0A2645] border-white focus:border-[#FAA225] focus:ring-[#FAA225]"
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="text-white hover:text-[#FAA225] hover:bg-white/10 p-1 mt-2"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#FAA225]/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white text-white hover:bg-white hover:text-[#0A2645]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
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
