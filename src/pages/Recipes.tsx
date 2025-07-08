import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon, ChefHatIcon, DollarSignIcon } from 'lucide-react';
import RecipeForm from '@/components/RecipeForm';
import DeleteRecipeDialog from '@/components/DeleteRecipeDialog';
import { Recipe } from '@/types';

const Recipes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      name: 'Classic Burger',
      description: 'Juicy beef burger with fresh toppings',
      ingredients: [
        { id: 1, name: 'Beef Patty', quantity: 1, unit: 'piece', costPerUnit: 3.50 },
        { id: 2, name: 'Burger Bun', quantity: 1, unit: 'piece', costPerUnit: 0.75 },
        { id: 3, name: 'Lettuce', quantity: 2, unit: 'leaves', costPerUnit: 0.25 },
        { id: 4, name: 'Tomato', quantity: 2, unit: 'slices', costPerUnit: 0.15 },
        { id: 5, name: 'Onion', quantity: 1, unit: 'slice', costPerUnit: 0.10 },
      ],
      instructions: [
        'Grill the beef patty for 4-5 minutes on each side',
        'Toast the burger bun lightly',
        'Assemble with lettuce, tomato, and onion',
        'Serve immediately'
      ],
      prepTime: 10,
      cookTime: 10,
      servings: 1,
      isManualCost: false
    },
    {
      id: 2,
      name: 'French Fries',
      description: 'Crispy golden french fries',
      ingredients: [
        { id: 1, name: 'Potatoes', quantity: 2, unit: 'large', costPerUnit: 0.80 },
        { id: 2, name: 'Oil', quantity: 500, unit: 'ml', costPerUnit: 0.002 },
        { id: 3, name: 'Salt', quantity: 1, unit: 'tsp', costPerUnit: 0.01 },
      ],
      instructions: [
        'Cut potatoes into fry-shaped pieces',
        'Heat oil to 175°C',
        'Fry potatoes until golden brown',
        'Season with salt while hot'
      ],
      prepTime: 15,
      cookTime: 10,
      servings: 2,
      totalCost: 3.50,
      isManualCost: true
    }
  ]);
  
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [isEditRecipeOpen, setIsEditRecipeOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const calculateRecipeCost = (recipe: Recipe) => {
    if (recipe.isManualCost && recipe.totalCost) {
      return {
        totalCost: recipe.totalCost,
        costPerServing: recipe.totalCost / recipe.servings
      };
    }
    
    const totalCost = recipe.ingredients.reduce((sum, ingredient) => {
      const ingredientCost = ingredient.costPerUnit * ingredient.quantity;
      return sum + ingredientCost;
    }, 0);
    
    return {
      totalCost,
      costPerServing: totalCost / recipe.servings
    };
  };
  
  const handleAddRecipe = (data: Omit<Recipe, 'id'>) => {
    const newRecipe = { ...data, id: Date.now() };
    setRecipes(prev => [...prev, newRecipe]);
    toast({
      title: "Recipe added",
      description: `${data.name} has been added to your recipes.`,
    });
  };
  
  const handleEditRecipe = (data: Omit<Recipe, 'id'>) => {
    if (selectedRecipe) {
      setRecipes(prev => prev.map(r => 
        r.id === selectedRecipe.id ? { ...r, ...data } : r
      ));
      toast({
        title: "Recipe updated",
        description: `${data.name} has been updated.`,
      });
    }
  };
  
  const handleDeleteRecipe = () => {
    if (selectedRecipe) {
      setRecipes(prev => prev.filter(r => r.id !== selectedRecipe.id));
      toast({
        title: "Recipe deleted",
        description: `${selectedRecipe.name} has been removed from your recipes.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  const openEditModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsEditRecipeOpen(true);
  };
  
  const openDeleteDialog = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/40">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-white via-blue-50/80 to-blue-100/60 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-[#FAA225]/20 rounded-xl m-4 mb-6 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-[#0A2645] hover:bg-[#0A2645]/10 hover:scale-110 transition-all duration-200 rounded-xl"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-[#FAA225] to-[#FAA225]/80 p-3 rounded-xl shadow-lg">
                <ChefHatIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0A2645] to-[#0A2645]/80 bg-clip-text text-transparent">
                  👨‍🍳 Recipe Manager
                </h1>
                <p className="text-sm text-[#0A2645]/70 font-medium">Create and manage your menu recipes with cost tracking</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddRecipeOpen(true)}
            className="bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 hover:from-[#FAA225]/90 hover:to-[#FAA225] text-white px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            ➕ Add Recipe
          </Button>
        </div>
      </header>
      
      {/* Recipes Grid */}
      <div className="p-4">
        {recipes.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-white via-blue-50/50 to-blue-100/40 rounded-2xl shadow-xl border-2 border-blue-200">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <h3 className="text-2xl font-bold text-[#0A2645] mb-3">No recipes yet</h3>
            <p className="text-[#0A2645]/70 mb-4 text-lg">Start by creating your first delicious recipe! 🍽️</p>
            <Button 
              onClick={() => setIsAddRecipeOpen(true)}
              className="bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 hover:from-[#FAA225]/90 hover:to-[#FAA225] text-white px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              ➕ Add Recipe
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const costInfo = calculateRecipeCost(recipe);
              return (
                <Card key={recipe.id} className="bg-gradient-to-br from-white via-blue-50/50 to-blue-100/40 border-2 border-blue-200/50 hover:border-[#FAA225] transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-xl overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-r from-[#0A2645] via-[#0A2645]/95 to-[#0A2645]/90 text-white rounded-t-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl font-bold mb-2 flex items-center gap-2">
                          🍽️ {recipe.name}
                        </CardTitle>
                        <p className="text-white/80 text-sm">{recipe.description}</p>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(recipe)}
                          className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 rounded-lg"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(recipe)}
                          className="text-red-300 hover:text-red-200 hover:bg-red-500/20 hover:scale-110 transition-all duration-200 rounded-lg"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm bg-blue-50/50 p-3 rounded-lg">
                        <span className="text-[#0A2645]/70 font-medium">⏱️ Prep: {recipe.prepTime}min</span>
                        <span className="text-[#0A2645]/70 font-medium">🔥 Cook: {recipe.cookTime}min</span>
                        <span className="text-[#0A2645]/70 font-medium">👥 Serves: {recipe.servings}</span>
                      </div>
                      
                      {/* Enhanced Cost Information */}
                      <div className="bg-gradient-to-r from-[#FAA225]/10 via-orange-50/50 to-yellow-50/40 p-4 rounded-xl border-2 border-[#FAA225]/30 shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-[#FAA225]/20 p-2 rounded-lg">
                            <DollarSignIcon className="h-4 w-4 text-[#FAA225]" />
                          </div>
                          <span className="font-bold text-[#0A2645] text-sm">💰 Recipe Cost</span>
                          {recipe.isManualCost && (
                            <span className="text-xs bg-gradient-to-r from-[#0A2645] to-[#0A2645]/80 text-white px-2 py-1 rounded-full font-bold">Manual</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white/80 p-2 rounded-lg text-center">
                            <span className="text-[#0A2645]/70 text-xs block">Total Cost</span>
                            <span className="font-bold text-[#0A2645] text-lg">R{costInfo.totalCost.toFixed(2)}</span>
                          </div>
                          <div className="bg-white/80 p-2 rounded-lg text-center">
                            <span className="text-[#0A2645]/70 text-xs block">Per Serving</span>
                            <span className="font-bold text-[#0A2645] text-lg">R{costInfo.costPerServing.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-[#0A2645] text-sm mb-3 flex items-center gap-2">
                          🥘 Ingredients:
                        </h4>
                        <ul className="text-sm text-[#0A2645]/70 space-y-2">
                          {recipe.ingredients.slice(0, 3).map((ingredient) => (
                            <li key={ingredient.id} className="bg-white/60 p-2 rounded-lg flex justify-between items-center">
                              <span className="font-medium">
                                {ingredient.quantity} {ingredient.unit} {ingredient.name}
                              </span>
                              <span className="text-[#FAA225] font-bold text-xs bg-[#FAA225]/10 px-2 py-1 rounded">
                                R{(ingredient.costPerUnit * ingredient.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                          {recipe.ingredients.length > 3 && (
                            <li className="text-[#FAA225] font-bold text-center p-2 bg-[#FAA225]/10 rounded-lg">
                              +{recipe.ingredients.length - 3} more ingredients
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Forms and Dialogs */}
      <RecipeForm
        isOpen={isAddRecipeOpen}
        onClose={() => setIsAddRecipeOpen(false)}
        onSubmit={handleAddRecipe}
      />
      
      {selectedRecipe && (
        <RecipeForm
          recipe={selectedRecipe}
          isOpen={isEditRecipeOpen}
          onClose={() => setIsEditRecipeOpen(false)}
          onSubmit={handleEditRecipe}
        />
      )}
      
      <DeleteRecipeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        recipe={selectedRecipe}
        onDelete={handleDeleteRecipe}
      />
    </div>
  );
};

export default Recipes;
