
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon, ChefHatIcon } from 'lucide-react';
import RecipeForm from '@/components/RecipeForm';
import DeleteRecipeDialog from '@/components/DeleteRecipeDialog';

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

const Recipes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      name: 'Classic Burger',
      description: 'Juicy beef burger with fresh toppings',
      ingredients: [
        { id: 1, name: 'Beef Patty', quantity: 1, unit: 'piece' },
        { id: 2, name: 'Burger Bun', quantity: 1, unit: 'piece' },
        { id: 3, name: 'Lettuce', quantity: 2, unit: 'leaves' },
        { id: 4, name: 'Tomato', quantity: 2, unit: 'slices' },
        { id: 5, name: 'Onion', quantity: 1, unit: 'slice' },
      ],
      instructions: [
        'Grill the beef patty for 4-5 minutes on each side',
        'Toast the burger bun lightly',
        'Assemble with lettuce, tomato, and onion',
        'Serve immediately'
      ],
      prepTime: 10,
      cookTime: 10,
      servings: 1
    },
    {
      id: 2,
      name: 'French Fries',
      description: 'Crispy golden french fries',
      ingredients: [
        { id: 1, name: 'Potatoes', quantity: 2, unit: 'large' },
        { id: 2, name: 'Oil', quantity: 500, unit: 'ml' },
        { id: 3, name: 'Salt', quantity: 1, unit: 'tsp' },
      ],
      instructions: [
        'Cut potatoes into fry-shaped pieces',
        'Heat oil to 175°C',
        'Fry potatoes until golden brown',
        'Season with salt while hot'
      ],
      prepTime: 15,
      cookTime: 10,
      servings: 2
    }
  ]);
  
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [isEditRecipeOpen, setIsEditRecipeOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
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
            <p className="text-sm text-[#0A2645]/70">Create and manage your menu recipes</p>
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
            {recipes.map((recipe) => (
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
                    
                    <div>
                      <h4 className="font-semibold text-[#0A2645] text-sm mb-2">Ingredients:</h4>
                      <ul className="text-sm text-[#0A2645]/70 space-y-1">
                        {recipe.ingredients.slice(0, 3).map((ingredient) => (
                          <li key={ingredient.id}>
                            {ingredient.quantity} {ingredient.unit} {ingredient.name}
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
            ))}
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
