
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calculator, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { Recipe } from '@/types';

interface BulkOrderCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  currentStock: any[];
  onCreatePurchaseOrder: (ingredients: any[]) => void;
}

const BulkOrderCalculator: React.FC<BulkOrderCalculatorProps> = ({
  isOpen,
  onClose,
  recipes,
  currentStock,
  onCreatePurchaseOrder
}) => {
  const { toast } = useToast();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [calculatedIngredients, setCalculatedIngredients] = useState<any[]>([]);

  const calculateIngredientNeeds = () => {
    if (!selectedRecipe || quantity <= 0) return;

    const totalIngredients = selectedRecipe.ingredients.map(ingredient => ({
      ...ingredient,
      totalQuantity: ingredient.quantity * quantity,
      totalCost: ingredient.quantity * quantity * ingredient.costPerUnit,
      currentStock: getCurrentStock(ingredient.name),
      needToPurchase: Math.max(
        0, 
        (ingredient.quantity * quantity) - getCurrentStock(ingredient.name)
      )
    }));

    setCalculatedIngredients(totalIngredients);
  };

  const getCurrentStock = (ingredientName: string) => {
    const stockItem = currentStock.find(item => 
      item.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
      ingredientName.toLowerCase().includes(item.name.toLowerCase())
    );
    return stockItem ? stockItem.stock : 0;
  };

  const getTotalCost = () => {
    return calculatedIngredients.reduce((sum, ingredient) => 
      sum + (ingredient.needToPurchase * ingredient.costPerUnit), 0
    );
  };

  const handleCreatePurchaseOrder = () => {
    if (calculatedIngredients.length === 0) {
      toast({
        title: "No calculation",
        description: "Please calculate ingredient needs first",
        variant: "destructive"
      });
      return;
    }

    const purchaseItems = calculatedIngredients
      .filter(ingredient => ingredient.needToPurchase > 0)
      .map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.needToPurchase,
        unit: ingredient.unit,
        costPerUnit: ingredient.costPerUnit,
        totalCost: ingredient.needToPurchase * ingredient.costPerUnit
      }));

    if (purchaseItems.length === 0) {
      toast({
        title: "No items needed",
        description: "You have enough stock for this order",
      });
      return;
    }

    onCreatePurchaseOrder(purchaseItems);
    toast({
      title: "Purchase order created",
      description: `Created order for ${purchaseItems.length} ingredients`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/50 to-blue-100/40 border-2 border-[#0A2645] rounded-2xl">
        <DialogHeader className="bg-gradient-to-r from-[#0A2645] to-[#0A2645]/90 text-white p-6 -m-6 mb-6 rounded-t-2xl">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              🧮 Bulk Order Calculator
              <div className="text-sm text-white/80 font-normal mt-1">Calculate raw ingredient needs for menu items</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe Selection */}
          <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-2 border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-[#0A2645] flex items-center gap-2">
                🍽️ Select Menu Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#0A2645] font-bold mb-2 block">Recipe</Label>
                <select 
                  className="w-full p-3 border-2 border-[#0A2645]/20 rounded-lg bg-white"
                  value={selectedRecipe?.id || ''}
                  onChange={(e) => {
                    const recipe = recipes.find(r => r.id === parseInt(e.target.value));
                    setSelectedRecipe(recipe || null);
                    setCalculatedIngredients([]);
                  }}
                >
                  <option value="">Select a recipe...</option>
                  {recipes.map(recipe => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name} (Serves {recipe.servings})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-[#0A2645] font-bold mb-2 block">Quantity to Make</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="bg-white border-2 border-[#0A2645]/20 focus:border-[#FAA225]"
                  placeholder="Enter quantity"
                />
              </div>

              <Button 
                onClick={calculateIngredientNeeds}
                disabled={!selectedRecipe}
                className="w-full bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 text-white font-bold"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Ingredient Needs
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {calculatedIngredients.length > 0 && (
            <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/30 border-2 border-green-200/50">
              <CardHeader>
                <CardTitle className="text-[#0A2645] flex items-center gap-2">
                  📋 Ingredient Requirements
                  <span className="text-sm font-normal bg-[#FAA225]/20 px-3 py-1 rounded-full">
                    {quantity} × {selectedRecipe?.name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calculatedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white/80 rounded-lg border">
                      <div className="flex-1">
                        <div className="font-semibold text-[#0A2645]">{ingredient.name}</div>
                        <div className="text-sm text-gray-600">
                          Need: {ingredient.totalQuantity} {ingredient.unit} | 
                          Current Stock: {ingredient.currentStock} {ingredient.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        {ingredient.needToPurchase > 0 ? (
                          <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg">
                            <div className="font-bold">📦 Buy: {ingredient.needToPurchase} {ingredient.unit}</div>
                            <div className="text-sm">R{(ingredient.needToPurchase * ingredient.costPerUnit).toFixed(2)}</div>
                          </div>
                        ) : (
                          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-bold">
                            ✅ Sufficient Stock
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-[#FAA225]/10 to-orange-50/50 rounded-xl border-2 border-[#FAA225]/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#0A2645]">💰 Total Purchase Cost:</span>
                    <span className="text-2xl font-bold text-[#FAA225]">R{getTotalCost().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    onClick={handleCreatePurchaseOrder}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Create Purchase Order
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-2 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkOrderCalculator;
