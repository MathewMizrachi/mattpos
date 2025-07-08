import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlusIcon, XIcon, DollarSignIcon, ChefHatIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { Recipe } from '@/types';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
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
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
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
      totalCost: finalCost,
      costPerServing,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/80 to-blue-100/60 border-2 border-[#0A2645] shadow-2xl rounded-2xl">
        <DialogHeader className="pb-6 border-b-2 border-[#FAA225]/30 bg-gradient-to-r from-[#0A2645] via-[#0A2645]/95 to-[#0A2645]/90 text-white p-6 -m-6 mb-6 rounded-t-2xl">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <ChefHatIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              {recipe ? '✏️ Edit Recipe' : '➕ Add New Recipe'}
              <div className="text-sm text-white/80 font-normal mt-1">Create delicious recipes with cost tracking</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Basic Information */}
          <div className="space-y-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 p-6 rounded-xl border-2 border-blue-200/50">
            <h3 className="text-lg font-bold text-[#0A2645] flex items-center gap-2 mb-4">
              📝 Basic Information
            </h3>
            <div>
              <Label htmlFor="name" className="text-sm font-bold text-[#0A2645] mb-2 block">
                Recipe Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg shadow-lg"
                placeholder="🍽️ Enter recipe name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-bold text-[#0A2645] mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="📖 Brief description of the recipe"
                rows={2}
                className="bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Timing and Servings */}
          <div className="bg-gradient-to-r from-orange-50/50 to-yellow-50/30 p-6 rounded-xl border-2 border-orange-200/50">
            <h3 className="text-lg font-bold text-[#0A2645] flex items-center gap-2 mb-4">
              ⏱️ Timing & Servings
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prepTime" className="text-sm font-bold text-[#0A2645] mb-2 block flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  Prep (min)
                </Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={formData.prepTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  className="bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg shadow-lg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cookTime" className="text-sm font-bold text-[#0A2645] mb-2 block flex items-center gap-1">
                  🔥 Cook (min)
                </Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  value={formData.cookTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                  className="bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg shadow-lg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="servings" className="text-sm font-bold text-[#0A2645] mb-2 block flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  Servings
                </Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                  className="bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg shadow-lg"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced Cost Section */}
          <div className="space-y-4 bg-gradient-to-r from-[#FAA225]/10 via-orange-50/50 to-yellow-50/40 p-6 rounded-xl border-2 border-[#FAA225]/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#FAA225]/20 p-3 rounded-xl">
                  <DollarSignIcon className="h-6 w-6 text-[#FAA225]" />
                </div>
                <div>
                  <Label className="text-lg font-bold text-[#0A2645]">💰 Recipe Costing</Label>
                  <p className="text-sm text-[#0A2645]/70">Track your recipe costs accurately</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-[#FAA225]/30">
                <Label htmlFor="manualCost" className="text-sm font-bold text-[#0A2645]">Manual Cost Entry</Label>
                <Switch
                  id="manualCost"
                  checked={formData.isManualCost}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isManualCost: checked }))}
                />
              </div>
            </div>
            
            {formData.isManualCost ? (
              <div className="bg-white/80 p-4 rounded-lg border border-[#FAA225]/30">
                <Label htmlFor="totalCost" className="text-sm font-bold text-[#0A2645] mb-2 block">
                  Total Recipe Cost (R)
                </Label>
                <Input
                  id="totalCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalCost: parseFloat(e.target.value) || 0 }))}
                  className="bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg shadow-lg"
                  placeholder="Enter total cost"
                />
              </div>
            ) : (
              <div className="text-[#0A2645]/70 text-sm bg-white/60 p-3 rounded-lg border border-blue-200">
                ✨ Cost will be automatically calculated from ingredient costs below.
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-xl border-2 border-green-200 text-center">
                <span className="text-green-700 font-medium block text-xs mb-1">Total Cost</span>
                <span className="font-bold text-green-800 text-xl">R{finalCost.toFixed(2)}</span>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl border-2 border-blue-200 text-center">
                <span className="text-blue-700 font-medium block text-xs mb-1">Cost per serving</span>
                <span className="font-bold text-blue-800 text-xl">R{costPerServing.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Ingredients */}
          <div className="space-y-4 bg-gradient-to-r from-green-50/50 to-emerald-50/30 p-6 rounded-xl border-2 border-green-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0A2645] flex items-center gap-2">
                🥘 Ingredients
              </h3>
              <Button
                type="button"
                onClick={addIngredient}
                className="bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 hover:from-[#FAA225]/90 hover:to-[#FAA225] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg"
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>
            
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex gap-3 items-center bg-white/80 p-3 rounded-lg border border-green-200 shadow-lg">
                  <Input
                    placeholder="🥬 Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                    className="flex-1 bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="0"
                    step="0.1"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg"
                  />
                  <Input
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                    className="w-20 bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg"
                  />
                  <Input
                    type="number"
                    placeholder="Cost/Unit"
                    min="0"
                    step="0.01"
                    value={ingredient.costPerUnit || ''}
                    onChange={(e) => updateIngredient(ingredient.id, 'costPerUnit', parseFloat(e.target.value) || 0)}
                    className="w-28 bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:scale-110 transition-all duration-200 rounded-lg p-2"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {!formData.isManualCost && (
                <div className="text-right text-sm text-[#0A2645]/70 bg-white/60 p-2 rounded-lg">
                  Automatic total: <span className="font-bold text-[#FAA225]">R{automaticCost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Instructions */}
          <div className="space-y-4 bg-gradient-to-r from-purple-50/50 to-pink-50/30 p-6 rounded-xl border-2 border-purple-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0A2645] flex items-center gap-2">
                📋 Cooking Instructions
              </h3>
              <Button
                type="button"
                onClick={addInstruction}
                className="bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 hover:from-[#FAA225]/90 hover:to-[#FAA225] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg"
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            
            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3 items-start bg-white/80 p-4 rounded-lg border border-purple-200 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 flex items-center justify-center text-sm font-bold text-white mt-2 flex-shrink-0 shadow-lg">
                    {index + 1}
                  </div>
                  <Textarea
                    placeholder="📝 Describe this cooking step in detail..."
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1 bg-white text-[#0A2645] border-2 border-[#0A2645]/20 focus:border-[#FAA225] focus:ring-[#FAA225] rounded-lg shadow-lg"
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:scale-110 transition-all duration-200 rounded-lg p-2 mt-2"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t-2 border-[#FAA225]/30 bg-gradient-to-r from-gray-50/50 to-blue-50/30 p-6 -m-6 mt-6 rounded-b-2xl">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white font-bold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              ❌ Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 hover:from-[#FAA225]/90 hover:to-[#FAA225] text-white font-bold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              {recipe ? '✅ Update Recipe' : '💾 Save Recipe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeForm;
