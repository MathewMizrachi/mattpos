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
      const ingredientCost = (ingredient.costPerUnit || 0) * ingredient.quantity;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b-2 border-[#FAA225] rounded-lg m-4 mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-[#0A2645] hover:bg-[#0A2645]/10"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0A2645]">Recipes</h1>
            <p className="text-sm text-[#0A2645]/70">Create and manage your menu recipes with cost tracking</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddRecipeOpen(true)}
          className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </header>
      
      {/* Recipes Grid */}
      <div className="p-4">
        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHatIcon className="h-16 w-16 mx-auto text-[#0A2645]/20 mb-4" />
            <h3 className="text-xl font-semibold text-[#0A2645] mb-2">No recipes yet</h3>
            <p className="text-[#0A2645]/70 mb-4">Start by creating your first recipe</p>
            <Button 
              onClick={() => setIsAddRecipeOpen(true)}
              className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const costInfo = calculateRecipeCost(recipe);
              return (
                <Card key={recipe.id} className="bg-white border-2 border-[#0A2645]/10 hover:border-[#FAA225] transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-[#0A2645] text-lg">{recipe.name}</CardTitle>
                        <p className="text-[#0A2645]/70 text-sm mt-1">{recipe.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(recipe)}
                          className="text-[#0A2645] hover:bg-[#FAA225]/10"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(recipe)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#0A2645]/70">Prep: {recipe.prepTime}min</span>
                        <span className="text-[#0A2645]/70">Cook: {recipe.cookTime}min</span>
                        <span className="text-[#0A2645]/70">Serves: {recipe.servings}</span>
                      </div>
                      
                      {/* Cost Information */}
                      <div className="bg-[#FAA225]/10 p-3 rounded-lg border border-[#FAA225]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSignIcon className="h-4 w-4 text-[#FAA225]" />
                          <span className="font-semibold text-[#0A2645] text-sm">Recipe Cost</span>
                          {recipe.isManualCost && (
                            <span className="text-xs bg-[#0A2645] text-white px-2 py-0.5 rounded">Manual</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-[#0A2645]/70">Total: </span>
                            <span className="font-medium text-[#0A2645]">R{costInfo.totalCost.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-[#0A2645]/70">Per serving: </span>
                            <span className="font-medium text-[#0A2645]">R{costInfo.costPerServing.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-[#0A2645] text-sm mb-2">Ingredients:</h4>
                        <ul className="text-sm text-[#0A2645]/70 space-y-1">
                          {recipe.ingredients.slice(0, 3).map((ingredient) => (
                            <li key={ingredient.id}>
                              {ingredient.quantity} {ingredient.unit} {ingredient.name}
                              {ingredient.costPerUnit && (
                                <span className="text-[#FAA225] ml-1">
                                  (R{(ingredient.costPerUnit * ingredient.quantity).toFixed(2)})
                                </span>
                              )}
                            </li>
                          ))}
                          {recipe.ingredients.length > 3 && (
                            <li className="text-[#FAA225] font-medium">
                              +{recipe.ingredients.length - 3} more
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
